const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const path = require('path');

const fs = require('fs');

// ============================
// Actualizar imagen de USUARIO
// ============================
function actualizarImgUsuario(id, res, nombreUnicoArchivo) {

    //  { new: false } - Obtenemos registro anterior para eliminar archivo
    Usuario.findByIdAndUpdate(id, { img: nombreUnicoArchivo }, { new: false, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            // si hay error elimina el ultimo archivo cargado
            eliminarArchivo('usuarios', nombreUnicoArchivo);

            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // si no existe el ID elimina el ultimo archivo cargado
            eliminarArchivo('usuarios', nombreUnicoArchivo);

            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no existe' }
            });
        }

        // Funciona con el valor anterior a la carga de la nueva imagen
        eliminarArchivo('usuarios', usuarioDB.img);

        res.json({
            ok: true,
            msg: 'Archivo Cargado!',
            usuario: usuarioDB,
            newfile: nombreUnicoArchivo

        });
    });
}


// =============================
// Actualizar imagen de PRODUCTO
// =============================
function actualizarImgProducto(id, res, nombreUnicoArchivo) {

    Producto.findByIdAndUpdate(id, { img: nombreUnicoArchivo }, { new: false, runValidators: true }, (err, productoDB) => {

        if (err) {
            // si hay error elimina el ultimo archivo cargado
            eliminarArchivo('productos', nombreUnicoArchivo);

            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            // si no existe el ID elimina el ultimo archivo cargado
            eliminarArchivo('productos', nombreUnicoArchivo);

            return res.status(400).json({
                ok: false,
                err: { message: 'Producto no existe' }
            });
        }

        // Funciona con el valor anterior a la carga de la nueva imagen
        eliminarArchivo('productos', productoDB.img);

        res.json({
            ok: true,
            msg: 'Archivo Cargado!',
            producto: productoDB,
            newfile: nombreUnicoArchivo

        });

    });
}


// =========================
// Eliminar archivo anterior
// =========================
function eliminarArchivo(tipo, imgDB) {

    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ imgDB }`);

    // Si ya existe el archivo, se elimina. Para evitar sobrecarga
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = {
    actualizarImgProducto,
    actualizarImgUsuario
}