const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colaborador = new Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    foto: { type: String, required: true },
    dataNascimento: { type: String, required: true },
    status: { type: String, enum: ['I', 'A'], required: true, default: 'A' },
    sexo: { type: String, enum: ['M', 'F'], required: true },
    contaBancaria: {
        titular: { type: String, required: true },
        cpfCnpj: { type: String, required: true },
        banco: { type: String, required: true },
        tipo: { type: String, required: true },
        agencia: { type: String, required: true },
        numero: { type: String, required: true },
        dv: { type: String, required: true },
        recipiendId: { type: String, required: true }
    }
});

module.exports = mongoose.model('Colaborador', colaborador);
