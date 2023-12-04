const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');
const util = require('../service/util');
const Cliente = require('../models/cliente');
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const Colaborador = require('../models/colaborador');
const Agendamento = require('../models/agendamento');
const Horario = require('../models/horario');
const _ = require('lodash');


router.post('/', async ( req, res ) => {
  try{

    const {clienteId, salaoId, servicoId, colaboradorId} = req.body;

    //recuperar o cliente

    const cliente = await Cliente.findById(clienteId).select(
      'nome endereco customerId'
    );

    //recupera salao
    const salao = await Salao.findById(salaoId).select(
      'recipientId'
    );

    //recupera servico
    const servico = await Servico.findById(servicoId).select(
      'preco titulo comissao'
    );

    //recupera colaborador
    const colaborador = await Colaborador.findById(colaboradorId).select(
      'recipientId'
    );

  }catch (err) {

    res.json({error: true, messege: err.message});

  }
})

router.post('/filter', async (req, res) => {
  try {
    const { periodo, salaoId } = req.body;

    const agendamentos = await Agendamento.find({
      salaoId,
      data: {
        $gte: moment(periodo.inicio).startOf('day').toDate(),
        $lte: moment(periodo.final).endOf('day').toDate(),
      },
    }).populate([
      { path: 'servicoId', select: 'titulo duracao' },
      { path: 'colaboradorId', select: 'nome' },
      { path: 'clienteId', select: 'nome' },
    ]);

    // Mapear os resultados para personalizar o retorno
    const resultadoPersonalizado = agendamentos.map(agendamento => ({
      _id: agendamento._id,
      data: agendamento.data,
      valor: agendamento.valor,
      servico: {
        _id: agendamento.servicoId._id,
        titulo: agendamento.servicoId.titulo,
        duracao: agendamento.servicoId.duracao,
      },
      colaborador: {
        _id: agendamento.colaboradorId._id,
        nome: agendamento.colaboradorId.nome,
      },
      cliente: {
        _id: agendamento.clienteId._id,
        nome: agendamento.clienteId.nome,
      },
    }));

    res.json({ error: false, agendamentos: resultadoPersonalizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Erro ao buscar os agendamentos' });
  }
});



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

    const horarios = await Horario.find({ salaold });
    const servicos = await Servico.findById(servicold).select('duracao');
  console.log(servicos)
    if (!servicos) {
      // Lida com o caso em que o serviço não é encontrado
      return res.status(400).json({ error: true, message: 'Serviço não encontrado' });
    }

    

    let agenda = [];
    let colaboradores = [];
    let lastDay = moment(data);

    // PRECISA MUDAR A MODAL DO SERVICO DE NUMBER PARA DATE DA TABELA DURACAO
    const servicoMinutos = util.hourToMinutes(
      moment(servicos.duracao).format('HH:mm')
    );

    const servicoSlots = util.sliceMinutes(
      servicos.duracao, // 1:30
      moment(servicos.duracao).add(servicoMinutos, 'minutes'),
      util.SLOT_DURATION
    ).length;

    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter(horario => {
        const diaSemanDisponivel = horario.dias.includes(moment(lastDay).day());
    
        // Verifique se horario.especialidades é uma matriz antes de usar o método .includes()
        const servicoDisponivel = Array.isArray(horario.especialidades) && horario.especialidades.includes(servicold);
    
        return diaSemanDisponivel && servicoDisponivel;
      });

      if (espacosValidos.length > 0) {
        let todosHorariosDias = {};

        for (let spaco of espacosValidos) {
          for (let colaboradorId of spaco.colaboradores) {
            if (!todosHorariosDias[colaboradorId]) {
              todosHorariosDias[colaboradorId] = [];
            }

            todosHorariosDias[colaboradorId] = {
              ...todosHorariosDias[colaboradorId],
              ...util.sliceMinutes(
                util.mergeDateTime(lastDay, spaco.inicio),
                util.mergeDateTime(lastDay, spaco.fim),
                util.SLOT_DURATION
              ),
            };
          }
          console.log(todosHorariosDias);
        }

        for (let colaboradorId of Object.keys(todosHorariosDias)) {
          const agendamentos = await Agendamento.find({
            colaboradorId,
            data: {
              $gte: moment(lastDay).startOf('day'),
              $lte: moment(lastDay).endOf('day'),
            },
          })
            .select('data servicoId -_id')
            .populate('servicoId', 'duracao');

          let horariosOcupados = agendamentos.map((agendamento) => ({
            inicio: moment(agendamento.data),
            final: moment(agendamento.data).add(
              util.hourToMinutes(
                moment(agendamento.servicoId.duracao).format('HH:mm')
              ),
              'minutes'
            ),
          }));
          horariosOcupados = horariosOcupados.map((horario) =>
            util.sliceMinutes(horario.inicio, horario.final, util.SLOT_DURATION)
          ).flat();

          let horariosLivres = util.aplitByValue(todosHorariosDias[colaboradorId].map((horarioLivre) => {
            return horariosOcupados.includes(horarioLivre) ? '-' : horarioLivre;
          }),
            '-'
          ).filter(space => space.length > 0);

          horariosLivres = horariosLivres.filter((horarios) => horarios.length >= servicoSlots);
          horariosLivres = horariosLivres.map((slot) => slot.filter((hroario, index) => slot.length - index >= servicoSlots)).flat();
          horariosLivres = _.chunk(horariosLivres, 2);

          if (horariosLivres.length == 0) {
            todosHorariosDias = _.omit(todosHorariosDias, colaboradorId);
          } else {
            todosHorariosDias[colaboradorId] = horariosLivres;
          }

          const totalEspecialistas = Object.keys(todosHorariosDias).length;

          if (totalEspecialistas > 0) {
            colaboradores.push(Object.keys(todosHorariosDias));
            agenda.push({
              [lastDay.format('YYYY-MM-DD')]: todosHorariosDias,
            });
          }
        }
      }

      lastDay = lastDay.add(1, 'day');
    }

    colaboradores = _.uniq(colaboradores.flat());

    colaboradores = await Colaborador.find({
      _if: { $in: colaboradores },
    }).select('nome foto');

    colaboradores = colaboradores.map((c) => ({
      ...c,
      nome: c.nome.split(' ')[0],
    }));
    res.json({
      error: false,
      colaboradores,
      agenda,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

router.post('/dias-disponiveis-teste', async (req, res) =>{
  try{
    const { data, salaoId, servicoId } = req.body;
    const horarios = await Horario.find({ salaoId });
    const servicos = await Servico.findById(servicoId).select('duracao');

    let agenda = [];
    let colaboradores = [];
    let lastDay = moment(data);

    const servicoMinutos = util.hourToMinutes(moment(servicos.duracao).format('HH:mm'));

    const servicoSlots = util.sliceMinutes(
      servicos.duracao, // 1:30
      moment(servicos.duracao).add(servicoMinutos, 'minutes'),
      util.SLOT_DURATION
    ).length; 

    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter((horario) => {
        const diaSemanDisponivel = horario.dias.includes(moment(lastDay).day());
        const servicoDisponivel = horario.especialidades.includes(servicoId);
    
        return diaSemanDisponivel && servicoDisponivel;
      });


      //TODOS OS HORARIOS DISPONINVEIS
      if (espacosValidos.length > 0) {
        let todosHorariosDias = {};
        for (let spaco of espacosValidos) {
          for (let colaboradorId of spaco.colaboradores) {
            if (!todosHorariosDias[colaboradorId]) {
              todosHorariosDias[colaboradorId] = [];
            }

            todosHorariosDias[colaboradorId] = {
              ...todosHorariosDias[colaboradorId],
              ...util.sliceMinutes(
                util.mergeDateTime(lastDay, spaco.inicio),
                util.mergeDateTime(lastDay, spaco.fim),
                util.SLOT_DURATION
              ),
            };
          }
        }
       
        for (let colaboradorId of Object.keys(todosHorariosDias)) {
          
          const agendamentos = await Agendamento.find({
            colaboradorId,
            data: {
              $gte: moment(lastDay).startOf('day'),
              $lte: moment(lastDay).endOf('day'),
            },
          })
            .select('data -_id')
            .populate('servicoId', 'duracao');

          let horariosOcupados = agendamentos.map((agendamento) => ({
            colaboradorId,
            inicio: moment(agendamento.data),
            final: moment(agendamento.data).add(
              util.hourToMinutes(
                moment(agendamento.servicoId.duracao).format('HH:mm')
              ),
              'minutes'
            ),
          }));
          horariosOcupados = horariosOcupados.map((horario) =>
            util.sliceMinutes(horario.inicio, horario.final, util.SLOT_DURATION)
          ).flat();

          console.log(horariosOcupados)
         
          let horariosLivres = util.splitByValue(Object.values(todosHorariosDias[colaboradorId]).map(
            (horarioLivre) => {
              
              return horariosOcupados.includes(horarioLivre)
              ? '-'
              : horarioLivre;
            }),
            '-'
          ).filter((space) => space.length > 0 );
          
          horariosLivres = horariosLivres.filter((horarios) => horarios.length >= servicoSlots);
          horariosLivres = horariosLivres.map((slot) => slot.filter((horario, index) => slot.length - index >= servicoSlots)).flat();
          horariosLivres = _.chunk(horariosLivres, 2);

          if (horariosLivres.length == 0) {
            todosHorariosDias = _.omit(todosHorariosDias, colaboradorId);
          } else {
            todosHorariosDias[colaboradorId] = horariosLivres;
          }

          const totalEspecialistas = Object.keys(todosHorariosDias).length;

          if (totalEspecialistas > 0) {
            colaboradores.push(Object.keys(todosHorariosDias));
            agenda.push({
              [lastDay.format('YYYY-MM-DD')]: todosHorariosDias,
            });
          }
        }
      }

      lastDay = moment(lastDay).add(1, 'day');
    }

    res.json({error:false, agenda})

  }catch(err){
    res.json({ error:true, message: err.message})
  }
});

module.exports = router;