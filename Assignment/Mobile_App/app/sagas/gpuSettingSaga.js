import { call, put, takeLatest } from "redux-saga/effects";
import { receiveGpuList, FETCH_GPU_LIST } from "../actions/gpuSettingActions";

import * as Config from '../config';

function* getJsonData(action) {
    try {
        const tokens = yield call(fetchData);
        yield put(receiveGpuList(tokens));
    } catch (e) {
        console.log(e);
    }
}

const fetchData = async () => {
    try {
        let response = await fetch(Config.apiUrl.gpuSetting, {
            headers: new Headers({
                'User': '1'
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log(error)
    }
};

export default (gpuSettingSaga = [takeLatest(FETCH_GPU_LIST, getJsonData)]);