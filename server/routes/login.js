const express = require('express');

const app = express();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');



app.post('/login', (req, res) => {

    // Obtenemos parametros de la petición
    let body = req.body;

    // Se busca y retorna un solo registro si es válido
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // Capturamos el error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Verificamos si existe el registro en BD
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: "(Usuario) o contraseña incorrectos." }
            });
        }

        // Se compara contraseña en BD encriptada con el dato de la petición 
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: "Usuario o (contraseña) incorrectos." }
            });
        }

        // Generamos el token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        // Si todo es correcto se genera el token
        res.json({
            ok: true,
            usuarioDB,
            token
        });

    });

});

module.exports = app;