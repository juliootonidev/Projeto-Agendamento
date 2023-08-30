const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
require('./database');

app.use(morgan('dev'));
app.use(express.json());
app.use(busboy());
app.use(busboyBodyParser());
app.use(cors()); // Adicionamos o cors aqui

app.set('port', 8000);

app.use('/salao', require('./src/routes/salao.routes'));
app.use('/servico', require('./src/routes/servicos.routes'));
app.use('/horario', require('./src/routes/horario.routes'));
app.use('/colaborador', require('./src/routes/colaborador.routes'));
app.use('/cliente', require('./src/routes/cliente.routes'));

app.listen(app.get('port'), () => {
    console.log(`Está funcionando na porta ${app.get('port')}`);
});
