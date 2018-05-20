import { call, put, takeLatest } from "redux-saga/effects";
import { receiveHistory, FETCH_HISTORY } from "../actions/historyActions";

import * as Config from '../config';

function* getJsonData(action) {
    try {
        const tokens = yield call(fetchData, action.gpuID, action.begin, action.number);
        yield put(receiveHistory(tokens));
    } catch (e) {
        console.log(e);
    }
}

const fetchData = async (gpuID, begin, number) => {
    try {
        let response = await fetch(Config.apiUrl.history(gpuID, begin, number), {
            headers: new Headers({
                'user': '1'
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log(error)
    }
};

export default (gpuSettingSaga = [takeLatest(FETCH_HISTORY, getJsonData)]);