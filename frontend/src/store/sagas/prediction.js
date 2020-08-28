import api from '../../services/api';
import { Creators } from '../ducks/prediction';
import { call, put } from 'redux-saga/effects';
import { actions as toastrActions } from 'react-redux-toastr';


export function* postPrediction({ filter }) {
  try {
    yield put(Creators.predictionInit());
    yield put(Creators.predictionRequest());

    // Abaixo, fazer chamada para descobrir e pegar as variáveis utilizadas na geração do modelo, de acordo com o phenomenon escolhido pelo usuário e passado no filter. Algo para se basear é o "getModelCopy". P.S.: Não achei essas variáveis salvas no banco, então só devem estar em arquivo. Não seria importante salvar tais variáveis no banco de dados? P.S.: Pegar as variáveis seguindo o modelo de ModelCopy.py | DONE

    // Após pegar as variáveis, fazer chamada para montar e executar a query que dá um SELECT nas colunas correspondentes às variáveis acima, passando as próprias variáveis que foram pegas na chamada acima, e os outros atributos do filter que forem passados (cursos, disciplinas, turmas e período) vão estar no WHERE da query.

    // Após a execução da query acima, passar o retorno desse SELECT (todos os atributos e dados respectivos a cada aluno da base de dados (payload.data)) como payload para fazer a predição.
    const modelEndpoint = filter.phenomenon;
    const response = yield call(api.post, `predict/${modelEndpoint}`, filter);

    yield put(toastrActions.add({
      type: 'success',
      title: 'Sucesso',
      message: `Análise finalizada com sucesso!`
    }));

    yield put(Creators.predictionSuccess(response.data));
  } catch (err) {
    yield put(Creators.predictionError({ err }));
    yield put(toastrActions.add({
      type: 'error',
      title: 'Erro',
      message: 'Falha ao gerar análise'
    }));
  }
}