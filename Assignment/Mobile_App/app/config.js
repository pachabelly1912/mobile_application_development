export const apiUrl = {
    computerList: 'http://minertracker.com/api/computers',
    gpuSetting: 'http://minertracker.com/api/settings',
    gpuStatus: 'http://minertracker.com/api/gpus/health',
    OneSignal: (gpuId) => { return 'http://minertracker.com/api/notification/' + gpuId },
    updateSetting: (gpuName) => {
        return 'http://minertracker.com/api/settings/' + gpuName
    },
    performanceInfo: (gpuID) => {
        return 'http://minertracker.com/api/gpus/' + gpuID + '/fields/latest'
    },
    history: (gpuID, begin, number) => {
        return 'http://minertracker.com/api/gpus/' + gpuID + '/fields?begin=' + begin + '&limit=' + number
    },
    deleteComputer: (computerID) => {
        return 'http://minertracker.com/api/computers/' + computerID
    },
    deleteGpu: (computerID, gpuID) => {
        return 'http://minertracker.com/api/computers/' + computerID + '/gpus/' + gpuID
    },
    setSeen: (gpuID) => {
        return 'http://minertracker.com/api/gpus/' + gpuID + '/exceeds/seen'
    }

}

