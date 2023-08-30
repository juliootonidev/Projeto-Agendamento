const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Horario = require('../models/horario');
const Colaborador = require('../models/colaborador');
const ColaboradorServico = require('../models/relationship/colaboradorServiso');

router.post('/', async (req, res) => {
    try{
        const horario = await new Horario(req.body).save();
        res.json({ horario });
    } catch (err){
        res.json({ error: true, message: err.message })
    }
});

router.post('/colaboradores', async (req, res) => {
    try {
        const colaboradorServico = await ColaboradorServico.find({
            servicoId: { $in: req.body.especialidades }, // Deve ser "especialidades" em vez de "especialista"
            status: 'A'
        })
        .populate('colaboradorId', 'nome')
        .select('colaboradorId -_id'); // Deve ser "colaboradorId" em vez de "colaborador"

        const listaColaboradores = _.uniqBy(colaboradorServico, vinculo =>
            vinculo.colaboradorId._id.toString()).map(vinculo => ({
                label: vinculo.colaboradorId.nome, value: vinculo.colaboradorId._id
            }));

        res.json({ error: false, listaColaboradores });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});


// Rota para listar todos os horários
router.get('/lista', async (req, res) => {
    try {
        const horarios = await Horario.find();
        res.json({ horarios });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// Rota para listar os horários de um salão específico
router.get('/salao/:salaoId', async (req, res) => {
    try {
        const { salaoId } = req.params;

        const horarios = await Horario.find({ salaoId });
        res.json({ horarios });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

// Rota para atualizar um horário por horarioId
router.put('/update/:horarioId', async (req, res) => {
    try {
       const { horarioId } = req.params;
       const horario = req.body;

        await Horario.findByIdAndUpdate(horarioId, horario);
        res.json({ error: false});

    } catch (error) {
        console.error('Erro ao atualizar horário:', error);
        res.status(500).json({ message: 'Erro ao atualizar horário', error: error.message });
    }
});

router.delete('/delete/:horarioId', async (req, res) => {
    try {
        const { horarioId } = req.params;
        await Horario.findByIdAndDelete(horarioId);
        res.json({ error: false});

    } catch (error) {
        console.error('Erro ao atualizar horário:', error);
        res.status(500).json({ message: 'Erro ao atualizar horário', error: error.message });
    }
});

module.exports = router;