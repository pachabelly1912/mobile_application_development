import { RECEIVE_GPU_STATUS } from '../actions/gpuStatusActions';

export default gpuStatusReducer = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_GPU_STATUS:
            if (action.data !== undefined)
                return action.data;
            else
                return state
        default:
            return state || []
    }
}