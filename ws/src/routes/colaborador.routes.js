const express = require('express');
const router = express.Router();

const Colaborador = require('../models/colaborador');
const SalaoColaborador = require('../models/relationship/salaoColaborador');
const ColaboradorServico = require('../models/relationship/colaboradorServiso');

router.post('/', async (req, res) => {
    try {
        // Dados recebidos no corpo da requisição
        const { nome, telefone, email, senha, foto, dataNascimento, sexo, contaBancaria, servicoId, salaoId } = req.body;

        // Crie um novo colaborador com os dados fornecidos
        const novoColaborador = new Colaborador({
            nome,
            telefone,
            email,
            senha,
            foto,
            dataNascimento,
            status: 'A', // Definindo o status como ativo (A)
            sexo,
            contaBancaria
        });

        // Salve o novo colaborador no banco de dados
        const colaboradorSalvo = await novoColaborador.save();

        // Vincule o colaborador ao serviço e ao salão usando os IDs fornecidos
        const novoColaboradorServico = new ColaboradorServico({
            colaboradorId: colaboradorSalvo._id,
            servicoId,
            status: 'A' // Definindo o status do vínculo como ativo (A)
        });

        const novoSalaoColaborador = new SalaoColaborador({
            salaoId,
            colaboradorId: colaboradorSalvo._id,
            status: 'A' // Definindo o status do vínculo como ativo (A)
        });

        // Salve os vínculos no banco de dados
        await novoColaboradorServico.save();
        await novoSalaoColaborador.save();

        // Envie uma resposta de sucesso com o colaborador recém-criado
        res.status(201).json({ message: 'Colaborador cadastrado com sucesso', colaborador: colaboradorSalvo });
    } catch (error) {
        console.error('Erro ao cadastrar colaborador:', error);
        res.status(500).json({ message: 'Erro ao cadastrar colaborador', error: error.message });
    }
});

router.delete('/delete/:colaboradorId', async (req, res) => {
    try {
        const colaboradorId = req.params.colaboradorId;

        // Verifique se o colaborador existe
        const colaborador = await Colaborador.findById(colaboradorId);

        if (!colaborador) {
            return res.status(404).json({ message: 'Colaborador não encontrado' });
        }

        // Exclua o vínculo de serviço e salão (se existirem)
        await ColaboradorServico.deleteOne({ colaboradorId });
        await SalaoColaborador.deleteOne({ colaboradorId });

        // Exclua o colaborador
        await colaborador.remove();

        res.json({ message: 'Colaborador excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir colaborador:', error);
        res.status(500).json({ message: 'Erro ao excluir colaborador', error: error.message });
    }
});

router.put('/update/:colaboradorId', async (req, res) => {
    try {
        const colaboradorId = req.params.colaboradorId;
        const { nome, telefone, email, foto, dataNascimento, sexo, contaBancaria, servicoId, salaoId } = req.body;

        // Encontre o colaborador pelo ID
        const colaborador = await Colaborador.findById(colaboradorId);

        if (!colaborador) {
            return res.status(404).json({ message: 'Colaborador não encontrado' });
        }

        // Atualize os campos do colaborador
        colaborador.nome = nome;
        colaborador.telefone = telefone;
        colaborador.email = email;
        colaborador.foto = foto;
        colaborador.dataNascimento = dataNascimento;
        colaborador.sexo = sexo;
        colaborador.contaBancaria = contaBancaria;

        await colaborador.save();

        // Atualize a relação de serviço (se fornecida)
        if (servicoId) {
            await ColaboradorServico.updateOne({ colaboradorId }, { servicoId });
        }

        // Atualize a relação de salão (se fornecida)
        if (salaoId) {
            await SalaoColaborador.updateOne({ colaboradorId }, { salaoId });
        }

        res.json({ message: 'Colaborador atualizado com sucesso', colaborador });
    } catch (error) {
        console.error('Erro ao atualizar colaborador:', error);
        res.status(500).json({ message: 'Erro ao atualizar colaborador', error: error.message });
    }
});

router.get('/lista/:colaboradorId', async (req, res) => {
    try {
        const colaboradorId = req.params.colaboradorId;

        // Busque o colaborador pelo ID
        const colaborador = await Colaborador.findById(colaboradorId)
            .populate('servicoId') // Popule a relação com serviço
            .populate('salaoId');   // Popule a relação com salão

        if (!colaborador) {
            return res.status(404).json({ message: 'Colaborador não encontrado' });
        }

        res.json({ message: 'Colaborador encontrado', colaborador });
    } catch (error) {
        console.error('Erro ao buscar colaborador:', error);
        res.status(500).json({ message: 'Erro ao buscar colaborador', error: error.message });
    }
});

router.get('/listGeral', async (req, res) => {
    try {
        // Busque todos os colaboradores
        const colaboradores = await Colaborador.find()
            .populate('servicoId') // Popule a relação com serviço
            .populate('salaoId');   // Popule a relação com salão

        res.json({ message: 'Lista de colaboradores', colaboradores });
    } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        res.status(500).json({ message: 'Erro ao buscar colaboradores', error: error.message });
    }
});

module.exports = router;
