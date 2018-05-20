import { call, put, takeEvery, takeLatest, all } from "redux-saga/effects";
import sagas from '../sagas'
export default function* rootSaga() {
    yield all([sagas.computerListSaga, sagas.gpuSettingSaga, sagas.performanceInfoSaga, sagas.gpuStatusSaga, sagas.historySaga]);
}
