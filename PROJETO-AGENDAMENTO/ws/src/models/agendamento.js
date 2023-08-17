const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agendamento = new Schema({

    salaoId:{tpye: mongoose.Type.ObjectId, ref:'Salao', requeired:true},
    clienteId:{tpye: mongoose.Type.ObjectId, ref:'Cliente', requeired:true},
    servicoId:{tpye: mongoose.Type.ObjectId, ref:'Servico', requeired:true},
    colaboradorId:{tpye: mongoose.Type.ObjectId, ref:'Colaborador', requeired:true},
    data:{type: Date, required: true},
    comissao:{type: Number, required: true},
    valor:{type: Number, required: true},
    transactionId:{type: String, required: true},
    dataCadastro:{type: Date, default: Date.now},
    
});

module.exports = mongoose.model('Agendamento', agendamento);
