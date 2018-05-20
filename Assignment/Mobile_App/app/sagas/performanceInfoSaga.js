import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_PERFORMANCE_INFO, receivePerformanceInfo } from "../actions/performanceInfoActions";

import * as Config from '../config';
function* getJsonData(action) {
    try {
        const tokens = yield call(fetchData,action.gpuID);
        yield put(receivePerformanceInfo(tokens));
    } catch (e) {
        console.log(e);
    }
}

const fetchData = async (gpuID) => {
    try {
        console.log(Config.apiUrl.performanceInfo(gpuID))
        let response = await fetch(Config.apiUrl.performanceInfo(gpuID), {
            headers: new Headers({
                'user': '1'
            })
        });
        console.log(response)
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log(error)
    }
};

export default (computerListSaga = [takeLatest(FETCH_PERFORMANCE_INFO, getJsonData)]);