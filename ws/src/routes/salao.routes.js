const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');
const Servico = require('../models/servico');


router.post('/', async(req, res)=>{
    try{
        const salao = await new Salao(req.body).save();
        res.json({salao});
    }catch (err){
        res.json({error: true, message: err.message});
    }
});

router.get('/servicos/:salaoId', async (req, res) => {
    try {
        const { salaoId } = req.params;
        
        const servicos = await Servico.find({
            salaoId,
            status: 'A'
        }).select('titulo _id');

        res.json({
            servicos: servicos.map(s => ({ label: s.titulo, value: s._id }))
        });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const salao = await Salao.findById(req.params.id).select('foto nome endereco.cidade geo.coordinates telefone email');

        if (!salao) {
            return res.status(404).json({ error: true, message: 'Salão não encontrado' });
        }

        res.json({ error: false, salao });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const saloes = await Salao.find();

        res.json({ saloes });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

router.delete('/delete/:salaoId', async (req, res) => {
    try {
        const salaoId = req.params.salaoId;

        // Verifique se o salão existe
        const salao = await Salao.findById(salaoId);

        if (!salao) {
            return res.status(404).json({ message: 'Salão não encontrado' });
        }

        // Exclua o salão
        await Salao.deleteOne({ _id: salaoId });

        res.json({ message: 'Salão excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir salão:', error);
        res.status(500).json({ message: 'Erro ao excluir salão', error: error.message });
    }
});

router.put('/update/:salaoId', async (req, res) => {
    try {
        const salaoId = req.params.salaoId;
        const { nome, endereco, telefone, email } = req.body;

        // Verifique se o salão existe
        const salao = await Salao.findById(salaoId);

        if (!salao) {
            return res.status(404).json({ message: 'Salão não encontrado' });
        }

        // Atualize os campos do salão
        salao.nome = nome;
        salao.endereco = endereco;
        salao.telefone = telefone;
        salao.email = email;

        await salao.save();

        res.json({ message: 'Salão atualizado com sucesso', salao });
    } catch (error) {
        console.error('Erro ao atualizar salão:', error);
        res.status(500).json({ message: 'Erro ao atualizar salão', error: error.message });
    }
});


module.exports = router;