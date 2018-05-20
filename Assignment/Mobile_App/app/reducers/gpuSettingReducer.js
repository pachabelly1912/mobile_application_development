import { RECEIVE_GPU_LIST } from '../actions/gpuSettingActions';

export default gpuSettingReducer = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_GPU_LIST:
            if (action.data.length > 0)
                return action.data
            else
                return state
        default:
            return state
    }
}