const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Horario = require('../models/horario');
const Colaborador = require('../models/colaborador');

router.post('/', async (req, res) => {
    const db = mongoose.connect;
    const session = await db.startSession();
    try{
        const { colaborador, salaoId } =  req.body;

        //verifica se existe 
        const existeColaborador = await Colaborador.findOne({
            $or: [
                {email: colaborador.email},
                {telefone: colaborador.telefone}
            ]
        })

        //se nao existir 
        if(!existeColaborador){
            //criar conta bancaria
            const { contaBancaria } =   colaborador;
            

            //criar recebidor 
        }
    } catch (err){
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message })
    }
});