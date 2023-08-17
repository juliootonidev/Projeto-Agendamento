const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cliente = new Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    foto: { type: String, required: true },
    dataNascimento: { type: String, required: true },
    status: { type: String, enum: ['I', 'A'], required: true, default: 'A' },
    sexo: { type: String, enum: ['M', 'F'], required: true },
    documento: {
        tipo: { type: String, enum: ['individual', 'corporation'], required: true },
        numero: { type: String, required: true }
    },
    endereco:{
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String
    }
});

module.exports = mongoose.model('Cliente', cliente);

