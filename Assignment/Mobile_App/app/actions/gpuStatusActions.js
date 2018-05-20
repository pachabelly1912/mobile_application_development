export const FETCH_GPU_STATUS = 'FETCH_GPU_STATUS';
export const RECEIVE_GPU_STATUS = 'RECEIVE_GPU_STATUS';
export const REFRESH_GPU_STATUS = 'REFRESH_GPU_STATUS';
export const fetchGpuStatus = () => {
    return {
        type: FETCH_GPU_STATUS
    }
} 

export const refreshGpuStatus = () => {
    return {
        type: REFRESH_GPU_STATUS
    }
}

export const receiveGpuStatus = (data) => {
    return {
        type: RECEIVE_GPU_STATUS,
        data
    }
}


