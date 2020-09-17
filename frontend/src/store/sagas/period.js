import api from '../../services/api';
import { Creators } from '../ducks/period';
import { call, put } from 'redux-saga/effects';
import { actions as toastrActions } from 'react-redux-toastr';


export function* getPeriods({ filter }) {
  try {
    yield put(Creators.periodRequest());
    const response = yield call(api.post, 'period', filter);

    yield put(Creators.periodSuccess(response.data));
  } catch (err) {
    yield put(Creators.periodError({ err }));
    yield put(toastrActions.add({
      type: 'error',
      title: 'Erro',
      message: 'Falha ao listar Períodos'
    }));
  }
}