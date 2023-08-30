const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');
const SalaoCliente = require('../models/relationship/salaoCliente');

// Rota para cadastrar uma relação entre um salão e um cliente
router.post('/cadastrar-salao-cliente', async (req, res) => {
    try {
        const novaRelacao = new SalaoCliente(req.body);
        const relacaoSalva = await novaRelacao.save();
        res.status(201).json(relacaoSalva);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/cadastrar-cliente', async (req, res) => {
    try {
        const novoCliente = new Cliente(req.body);
        const clienteSalvo = await novoCliente.save();
        res.status(201).json(clienteSalvo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota para cadastrar um novo cliente com relação ao salão
router.post('/cadastrar-cliente-salao', async (req, res) => {
    try {
        const { clienteInfo, salaoInfo } = req.body;

        // Crie o cliente
        const novoCliente = new Cliente(clienteInfo);
        const clienteSalvo = await novoCliente.save();

        // Crie a relação entre o cliente e o salão
        const novaRelacao = new SalaoCliente({
            salaoId: salaoInfo.salaoId,
            clienteId: clienteSalvo._id,  // Use o ID do cliente recém-salvo
            status: salaoInfo.status
        });
        const relacaoSalva = await novaRelacao.save();

        res.status(201).json({ cliente: clienteSalvo, relacao: relacaoSalva });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
