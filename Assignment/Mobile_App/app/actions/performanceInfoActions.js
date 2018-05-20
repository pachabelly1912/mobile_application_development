export const FETCH_PERFORMANCE_INFO = 'FETCH_PERFORMANCE_INFO';
export const RECEIVE_PERFORMANCE_INFO = 'RECEIVE_PERFORMANCE_INFO';

export const fetchPerformanceInfo = (gpuID) => {
    return {
        type: FETCH_PERFORMANCE_INFO,
        gpuID
    }
} 

export const receivePerformanceInfo = (data) => {
    return {
        type: RECEIVE_PERFORMANCE_INFO,
        data
    }
}


