import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

export const { Types, Creators } = createActions({
  predictionInit: [],
  postPrediction: ['filter'],
  predictionRequest: [],
  predictionSuccess: ['data'],
  predictionError: ['err'],
});

/** --------------------------------
 * Variable declarations
 * --------------------------------- */

const INITIAL_STATE = Immutable({
  data: null,
  loading: false,
  error: false,
});

/* Reducers */

export const init = state => state.merge({ ...INITIAL_STATE });

export const request = state => state.merge({ loading: true });

export const success = (state, { data }) => state.merge({ data, loading: false, error: false });

export const error = state => state.merge({ loading: false, error: true });

/* Reducers to types */

export default createReducer(INITIAL_STATE, {
  [Types.PREDICTION_INIT]: init,
  [Types.PREDICTION_REQUEST]: request,
  [Types.PREDICTION_SUCCESS]: success,
  [Types.PREDICTION_ERROR]: error,
});