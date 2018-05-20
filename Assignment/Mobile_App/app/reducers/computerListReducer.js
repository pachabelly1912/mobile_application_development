import { RECEIVE_COMPUTER_LIST, UPDATE_COMPUTER_LIST } from '../actions/computerListActions';

export default computerListReducer = (state = [], action) => {
    switch (action.type) {
        case  RECEIVE_COMPUTER_LIST:
        if (action.data !== undefined)
            return action.data
        else 
            return state
        case UPDATE_COMPUTER_LIST:
            return state.map((computer, index)=>{
                    if(computer.ComputerID === action.id) {
                        return {
                            ...computer,
                            GPUs: action
                        }
                    } else return computer
                })
        default:
            return state
    }
}