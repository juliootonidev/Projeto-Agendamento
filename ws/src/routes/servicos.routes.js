const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../service/aws');
const Arquivo = require('../models/arquivo');
const Servico = require('../models/servico');
const arquivo = require('../models/arquivo');

/*
router.post('/', async(req, res)=>{
    let busboy = new Busboy({ headers: req.headers});
    busboy.on('finish', async () => {
        try{
            const {salaoId, servico} = req.body;
            let errors = [];
            let arquivos = [];

            if (req.files && Object.keys(req.files) > 0){
                for(let key of Object.keys(req.files)){
                    const file = req.files[key];
                    const nameParts = file.name.slit('.');
                    const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`
                    const path = `servicos/${salaoId}/${fileName}`;
                    const response = await aws.uploadToS3(file, path);

                    if (response.error){
                        errors.push({ error: true, message: response.message});
                    }else{
                        arquivos.push(path);
                    }
                }
            }
            if(errors.length > 0){
                res.json(errors[0]);
                return false;
            }

             Criar Serviço
            let jsonServico  = JSON.parse(servico);
            const servicoCadastrado = await Servico(jsonServico).save();

             Criar arquivo
            arquivos = arquivos.map((arquivo) =>({
                referenciaId: servicoCadastrado._id,
                Model: 'Servico',
                caminho: arquivo,
            }))

            await arquivo.insertMany(arquivos);
            res.json({ servico: servicoCadastrado, arquivos});

            req.pipe(busboy);
        }catch (err){
            res.json({error: true, message: err.message});
        }
    });
});

router.delete('/arquivo/:id', async(req, res) =>{
    try{
        const { id } = req.params;
        await aws.deleteFileS3(id);
        await arquivo.findOneAndaDelete({
            caminho: id;
        });

        res.json({ error: false });
    }catch (err){
        res.json({error: true, message: err.message});
    }
})
*/

router.post('/', async(req, res)=>{
    try{
        const {salaoId, servico} = await new Servico(req.body).save();
        res.json({servico});
    }catch (err){
        res.json({error: true, message: err.message});
    }
});

// Rota de atualização de serviço por ID
router.put('/update/:id', async (req, res) => {
    const servicoId = req.params.id;
    
    try {
        const updatedServico = await Servico.findByIdAndUpdate(
            servicoId,
            req.body,
            { new: true } // Isso retornará o documento atualizado
        );
        
        if (!updatedServico) {
            return res.status(404).json({ error: true, message: 'Servico não encontrado' });
        }
        
        res.json({ servico: updatedServico });
    } catch (err) {
        res.json({error: true, message: err.message});
    }
});

router.delete('/excluir/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedServico = await Servico.findByIdAndUpdate( id, {status: 'E'} );
        res.json({ error: false });
    } catch (err) {
        res.json({error: true, message: err.message});
    }
});

router.get('/salao/:salaoId', async (req, res) => {
    try{
        const servicos = await Servico.find({
            salaoId: req.params.salaoId,
            status: { $ne: 'E'},
        });

        res.json({ servicos });
    }catch (err) {
        res.json({error: true, message: err.message});
    }
});

// Rota para listar todos os serviços
router.get('/lista', async (req, res) => {
    try {
        const servicos = await Servico.find({ status: { $ne: 'E' } });
        res.json({ servicos });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;