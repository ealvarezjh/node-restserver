const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

require('./config/config');


// Configuración body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(require('./routes/usuario'));


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