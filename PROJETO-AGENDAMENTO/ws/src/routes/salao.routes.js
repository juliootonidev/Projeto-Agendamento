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
module.exports = router;