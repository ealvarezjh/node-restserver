const express = require('express');

// Encriptación de contraseña
const bcrypt = require('bcrypt');

// Filtrado de propiedades
const _ = require('underscore');

const Usuario = require('../models/usuario');
const app = express();


app.get('/usuario', function(req, res) {

    // Parámetros opcionales se almacenan en -req.query-
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Retorna conteo total de registros
            Usuario.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    usuarios
                });

            });

        });

});

app.post('/usuario', function(req, res) {
    // Obtenemos cuerpo de la petición - body-parser
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Encriptación de contraseña por método Hash - 10 vueltas
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    // Utilizamos underscore para filtrar propiedades de retorno
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Método de Mongoose, habilitamos validaciones en schema y retornamos valor actulizado
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    // Borrado físico de Mongodb
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    // Borrado lógico de Mongodb
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            usuarioBorrado
        });


    });



});



module.exports = app;