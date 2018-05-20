export const FETCH_COMPUTER_LIST = 'FETCH_COMPUTER_LIST';
export const RECEIVE_COMPUTER_LIST = 'RECEIVE_COMPUTER_LIST';
export const REFRESH_COMPUTER_LIST = 'REFRESH_COMPUTER_LIST';

export const fetchComputerList = () => {
    return {
        type: FETCH_COMPUTER_LIST
    }
} 

export const refreshComputerList = () => {
    return {
        type: REFRESH_COMPUTER_LIST
    }
}

export const receiveComputerList = (data) => {
    return {
        type: RECEIVE_COMPUTER_LIST,
        data
    }
}


