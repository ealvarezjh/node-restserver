const express = require('express');

const app = express();

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

// Librerias de Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // Retornamos un objeto deacuerdo a nuestro modelo
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    // Obtenemos el token de google
    let token = req.body.idtoken;

    // Verificación de token de google
    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            });
        });

    // Si el token es correcto, verificamos si existe el usuario(email) en la BD
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si el usuario existe, pueden existir dos escenarios:
        if (usuarioDB) {

            // 1- El usuario ya fue registrado y autenticado por el método normal
            if (googleUser.google === false) {

                return res.status(403).json({
                    ok: false,
                    err: { message: 'Utilice la auntenticación normal' }
                });

            } else {

                // 2- El usuario ya fue registrado y autenticado por google
                // Por lo cuál, se actualiza o genera un nuevo token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }

        } else {
            // Si el usuario no existe en nuestra BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.password = ':)';
            usuario.google = true;

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });


            });

        }

    });

});


module.exports = app;