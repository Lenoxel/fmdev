import api from '../../services/api';
import { Creators } from '../ducks/student';
import { call, put } from 'redux-saga/effects';
import { actions as toastrActions } from 'react-redux-toastr';


export function* getStudents({ filter }) {
  try {
    yield put(Creators.studentRequest());
    const response = yield call(api.post, 'student', filter);

    yield put(Creators.studentSuccess(response.data));
  } catch (err) {
    yield put(Creators.studentError({ err }));
    yield put(toastrActions.add({
      type: 'error',
      title: 'Erro',
      message: 'Falha ao listar Alunos'
    }));
  }
}