const express = require('express');

const app = express();

const Categoria = require('../models/categoria');

const { validarToken, validarRole } = require('../middlewares/autenticacion');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', validarToken, (req, res) => {

    Categoria.find()
        .sort('descripcion') //Ordenamos por ....
        .populate('usuario', 'nombre') // Relacionamos ID con el nombre de usuario
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    categorias
                });

            });

        });
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', validarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            res.status(404).json({
                ok: false,
                err: 'El ID no existe'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });



});


// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', [validarToken, validarRole], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ============================
// Modificar categoria por ID
// ============================
app.put('/categoria/:id', [validarToken, validarRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(404).json({
                ok: false,
                err: 'El ID no existe'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ===========================
// Eliminar categoria por ID
// ===========================
app.delete('/categoria/:id', [validarToken, validarRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            res.status(404).json({
                ok: false,
                err: 'El ID no existe'
            });
        }

        res.json({
            ok: true,
            categoriaBorrada
        });
    });
});



module.exports = app;