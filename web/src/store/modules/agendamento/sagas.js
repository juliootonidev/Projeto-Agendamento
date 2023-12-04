import { all, takeLatest, call, put } from 'redux-saga/effects';
import types from './types'
import { updateAgendamentos } from './actions'
import api from '../../../services/api'
import consts from '../../../consts'


export function* filterAgendamento({start, end}){
    try {
        const {data: res} = yield call(api.post, '/agendamento/filter', {
            periodo: {
                inicio: start,
                final: end
            },
            salaoId: consts.salaoId
        });

        console.log(res.agendamentos)

        if(res.error){
            alert(res.message);
            return false
        }

        yield put(updateAgendamentos(res.agendamentos));
    } catch (err) {
        alert(err.message);
    }
}

export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)]);