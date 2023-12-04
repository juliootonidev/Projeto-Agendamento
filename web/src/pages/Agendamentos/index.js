import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useDispatch, useSelector} from 'react-redux';
import util from '../../util'


import { filterAgendamentos } from '../../store/modules/agendamento/actions'

const localizer = momentLocalizer(moment);

const Agendamentos = () => {
    const today = new Date(); 
    const startOfWeek = moment(today).startOf('week').toDate();
    const dispatch = useDispatch(); 
    const { agendamentos } = useSelector((state) => state.agendamento);




    const formatEvents = agendamentos.map((agendamento) => {      
        return {
          title: `${agendamento.servico.titulo} - Cliente: ${agendamento.cliente.nome} - Colaborador: ${agendamento.colaborador.nome}`,
          start: moment(agendamento.data).toDate(),
          end: moment(agendamento.data)
            .add(util.hourToMinutes(moment(agendamento.servico.duracao).format('HH:mm')), 'minutes')
            .toDate(),
        };
      });
      

    useEffect(()=>{
        dispatch(
            filterAgendamentos(
                moment().weekday(0).format('YYYY-MM-DD'),
                moment().weekday(6).format('YYYY-MM-DD')
            )
            //start:moment().weekday(0).format('YYYY-MM-DD'),
            //end:moment().weekday(6).format('YYYY-MM-DD')
        )
    },[dispatch])

    return( 
        <div className='col p-5 overflow-auto h-100'>
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4 mt-0">Agendamentos</h2>
                    <Calendar
                        localizer={localizer}
                        events={formatEvents}
                        defaultView='week'
                        defaultDate={startOfWeek}
                        selectable
                        popup
                        style={{ height: 500 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Agendamentos;
