import { UPDATE_PERFORMANCE } from '../actions/performanceActions';
initState = [];

export default performanceReducer = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_PERFORMANCE:
            const { data } = action;
            var isExist = false;
            var updatedData = state.map((computer) => {
                if (computer.ID === data.ID) {
                    isExist = true
                    return data
                } else return computer
            })

            if (!isExist) {
                updatedData.push(data)
            }
            return updatedData
        default:
            return state
    }
}