export const FETCH_HISTORY = 'FETCH_HISTORY';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';
export const REFRESH_HISTORY = 'REFRESH_HISTORY';

export const clearHistory = () => {
    return {
        type: CLEAR_HISTORY
    }
}

export const refreshHistory = () => {
    return {
        type: REFRESH_HISTORY
    }
}

export const fetchHistory = (gpuID, begin, number) => {
    return {
        type: FETCH_HISTORY,
        gpuID,
        begin,
        number
    }
}

export const receiveHistory = (data) => {
    return {
        type: RECEIVE_HISTORY,
        data
    }
}