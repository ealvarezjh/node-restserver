const express = require('express');

const app = express();

const path = require('path');

const fs = require('fs');

const { validarTokenImg } = require('../middlewares/autenticacion')

app.get('/image/:tipo/:img', validarTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let imgPath = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    let notImagePath = path.resolve(__dirname, '../assets/notFound.jpg');

    (fs.existsSync(imgPath)) ? res.sendFile(imgPath): res.sendFile(notImagePath);

});



module.exports = app;