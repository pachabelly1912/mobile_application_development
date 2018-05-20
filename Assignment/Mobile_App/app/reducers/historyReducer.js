import { RECEIVE_HISTORY, CLEAR_HISTORY } from '../actions/historyActions';

export default gpuStatusReducer = (state = [], action) => {
    console.log(action.type)
    switch (action.type) {
        case CLEAR_HISTORY:
            return []
        case RECEIVE_HISTORY:
            if (action.data !== undefined && action.data.length > 0)
                return state.concat(action.data)
            else
                return state
        default:
            return state || []
    }
}