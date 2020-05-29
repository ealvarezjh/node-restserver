const express = require('express');

const app = express();

const Producto = require('../models/producto');

const { validarToken } = require('../middlewares/autenticacion');

// ============================
// Obtener productos
// ============================

app.get('/producto', validarToken, (req, res) => {
    // trae todos los productos
    // populate: usuario, categoria
    // paginado

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    cantidad: conteo,
                    productos: productosDB
                });
            });
        });
});


// ============================
// Obtener un producto por ID
// ============================
app.get('/producto/:id', validarToken, (req, res) => {
    // populate: usuario, categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productoDB
            })
        });
});


// ============================
// Buscar producto
// ============================
app.get('/producto/busqueda/:termino', (req, res) => {

    let termino = req.params.termino;

    // Expresión regular para agilizar búsqueda
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .exec((err, resultadoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!resultadoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'No hay resultados'
                    }
                });

            }

            res.json({
                ok: true,
                resultado: resultadoDB
            })


        });

});

// ============================
// Crear un nuevo producto
// ============================
app.post('/producto', validarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});


// ============================
// Actualizar un producto
// ============================
app.put('/producto/:id', validarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: { msg: "No existe un registro con el ID" }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// ============================
// Borrar un producto(logico)
// ============================
app.delete('/producto/:id', validarToken, (req, res) => {
    // Borrado logico: false

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: { msg: "No existe un registro con el ID" }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto Borrado'
        });
    });
});


module.exports = app;