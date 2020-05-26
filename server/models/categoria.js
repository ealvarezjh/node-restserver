const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: [true, 'Especificicar usuario es necesario'],
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);