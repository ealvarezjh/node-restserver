const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');



require('./config/config');


// Configuración body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Publicamos el index.html
// path.resolve -Necesario para especificar la ruta correctamente
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'));


// Conexión: MongoDB(localhost)
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) throw err;
        console.log(`Connected to MongoDB:OK`);
    });


// Puerto servidorweb
app.listen(process.env.PORT, () => {
    console.log(`Listen in port: ${process.env.PORT}`);
});