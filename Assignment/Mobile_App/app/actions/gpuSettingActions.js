export const FETCH_GPU_LIST = 'FETCH_GPU_LIST';
export const RECEIVE_GPU_LIST = 'RECEIVE_GPU_LIST';

export const fetchGpuList = () => {
    return {
        type: FETCH_GPU_LIST
    }
}

export const receiveGpuList = (data) => {
    return {
        type: RECEIVE_GPU_LIST,
        data
    }
}