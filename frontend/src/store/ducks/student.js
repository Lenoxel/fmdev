import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

export const { Types, Creators } = createActions({
  studentInit: [],
  studentRequest: [],
  studentSuccess: ['data'],
  studentError: ['err'],
  getStudents: ['filter']
});

/** --------------------------------
 * Variable declarations
 * --------------------------------- */

const INITIAL_STATE = Immutable({
  data: [],
  loading: false,
  error: false
});

/* Reducers */

export const init = state => state.merge({ data: [] });

export const request = state => state.merge({ loading: true });

export const success = (state, { data }) => state.merge({ data, error: false, loading: false });

export const error = state => state.merge({ loading: false, error: true });

/* Reducers to types */

export default createReducer(INITIAL_STATE, {
  [Types.STUDENT_INIT]: init,
  [Types.STUDENT_REQUEST]: request,
  [Types.STUDENT_SUCCESS]: success,
  [Types.STUDENT_ERROR]: error
});