import { call, put, takeLatest } from "redux-saga/effects";
import { receiveGpuStatus, FETCH_GPU_STATUS, REFRESH_GPU_STATUS } from "../actions/gpuStatusActions";

import * as Config from '../config';

function* getJsonData(action) {
    try {
        if (action.type === REFRESH_GPU_STATUS)
            yield put(receiveGpuStatus([]));
        const tokens = yield call(fetchData);
        yield put(receiveGpuStatus(tokens));
    } catch (e) {
        console.log(e);
    }
}

const fetchData = async () => {
    try {
        let response = await fetch(Config.apiUrl.gpuStatus, {
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

export default (gpuSettingSaga = [takeLatest(FETCH_GPU_STATUS, getJsonData), takeLatest(REFRESH_GPU_STATUS, getJsonData)]);