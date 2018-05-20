import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_COMPUTER_LIST, receiveComputerList, REFRESH_COMPUTER_LIST } from "../actions/computerListActions";

import * as Config from '../config';
function* getJsonData(action) {
    try {
        if (action.type === REFRESH_COMPUTER_LIST)
            yield put(receiveComputerList([]));
        const tokens = yield call(fetchData);
        yield put(receiveComputerList(tokens));
    } catch (e) {
        console.log(e);
    }
}

const fetchData = async () => {
    try {
        let response = await fetch(Config.apiUrl.computerList, {
            headers: new Headers({
                'Content-Type': 'application/json',
                'User': '1'
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log(error)
    }
};

export default (computerListSaga = [takeLatest(FETCH_COMPUTER_LIST, getJsonData), takeLatest(REFRESH_COMPUTER_LIST, getJsonData)]);