import { RECEIVE_PERFORMANCE_INFO } from '../actions/performanceInfoActions';

export default performanceInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_PERFORMANCE_INFO:
            if (action.data !== undefined)
                return action.data;
            else
                return state
        default:
            return state || {}
    }
}