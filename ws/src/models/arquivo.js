const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arquivo = new Schema({
    referenciaId:{
        type: Schema.Types.ObjectId,
        refPath: 'model',
    },
    model:{
        type: String,
        require: true,
        enum: ['Servicos', 'Salao'],
    },
    caminho:{
        type: String,
        require: true,
    },
    dataCadatro:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Arquivo', arquivo);