const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const util = require('../service/util');
const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Colaborador = require('../models/colaborador');
const Agendamento = require('../models/agendamento');
const Horario = require('../models/horario');

// Rota para criar um novo agendamento
router.post('/agendar', async (req, res) => {
  try {
    const {
      salaoId,
      clienteId,
      servicoId,
      colaboradorId,
      data,
      comissao,
      valor
    } = req.body;

    // Certifique-se de que os IDs de salão, cliente e colaborador existam no banco de dados.
    const salao = await Salao.findById(salaoId);
    const cliente = await Cliente.findById(clienteId);
    const colaborador = await Colaborador.findById(colaboradorId);

    if (!salao || !cliente || !colaborador) {
      return res.status(400).json({ erro: 'Salão, Cliente ou Colaborador não encontrado' });
    }

    // Crie um novo agendamento usando os IDs encontrados
    const novoAgendamento = new Agendamento({
      salaoId,
      clienteId,
      servicoId,
      colaboradorId,
      data,
      comissao,
      valor
    });

    await novoAgendamento.save();

    res.status(201).json({ mensagem: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Ocorreu um erro ao criar o agendamento' });
  }
});


router.post('/dias-disponiveis', async (req, res) => {
    try {
      const { data, salaold, servicold } = req.body;
  
    
      const horarios = await Horario.find({ sala: salaold, data });
  
    
      const servico = await Servico.findById(servicold);
      const duracaoServico = servico ? servico.duracao : 0;
  
    
  
      
      res.json({ horarios, duracaoServico });
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  });

module.exports = router;
