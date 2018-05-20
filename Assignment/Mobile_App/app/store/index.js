import { createStore, combineReducers, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import rootSaga from './saga';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware()

export default store = createStore(rootReducer,applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)