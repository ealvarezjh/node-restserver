const express = require('express');

const app = express();

const fileUpload = require('express-fileupload');

const { actualizarImgUsuario, actualizarImgProducto } = require('../services/archivo')

// Configuración para la carga de archivos completos
app.use(fileUpload());



app.put('/upload/:tipo/:id', (req, res) => {

    // Especificiar tipo (producto o usuario)
    let tipo = req.params.tipo;

    // ID de producto o usuario
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            err: { message: 'No se ha seleccionado ningún archivo.' }
        });

    }

    // ============
    // Validar tipo
    // ============

    let tiposPermitidos = ['productos', 'usuarios'];

    if (tiposPermitidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipos válidos: ' + tiposPermitidos.join(', '),
            }

        });

    }

    // form-data
    let archivo = req.files.archivo;



    // =================
    // Validar extensión
    // =================

    // Obtenemos la extensión del archivo
    let divisionDeNombre = archivo.name.split('.');
    let extension = divisionDeNombre[divisionDeNombre.length - 1];

    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg']

    // Validamos el tipo de archivo por cargar
    if (extensionesPermitidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extensiones válidas: ' + extensionesPermitidas.join(', '),
                ext: extension
            }

        });
    }


    // ============
    // Nombre único
    // ============

    let nombreUnicoArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreUnicoArchivo }`, function(err) {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        (tipo === 'usuarios') ? actualizarImgUsuario(id, res, nombreUnicoArchivo): actualizarImgProducto(id, res, nombreUnicoArchivo);
    });
});


module.exports = app;