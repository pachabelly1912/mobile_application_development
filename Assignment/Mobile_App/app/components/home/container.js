import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    BackHandler
} from 'react-native';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { connect } from 'react-redux';
import HeaderBar from '../../commons/headerBar';
import HomeContent from './content';
import testData from './testData';
import ENUMS from '../../constants/enums'
import * as computerListActions from '../../actions/computerListActions';
import * as performanceActions from '../../actions/performanceActions';
import * as gpuStatusActions from '../../actions/gpuStatusActions';
import OneSignal from 'react-native-onesignal';
import * as config from '../../config';
import io from 'socket.io-client'
var eventSocket = null;



export class HomeContainer extends Component {

    static navigationOptions = (navigator) => {
        const params = navigator.navigation.state.params
        return {
            header: <HeaderBar
                title={'Miner Tracker'}
                renderLeftButton={true}
                isHomeScreen={true}
                renderRightButton={true}
                handleRightButton={params === undefined ? null : params.onRefresh}
                handleLeftButton={_.throttle(() => navigator.navigation.navigate(ENUMS.SCREEN.SETTING), 200)}
            />
        }
    }



    componentWillMount() {

        this.props.fetchComputerList()
        this.props.fetchGpuStatus()
        this.props.navigation.setParams({ onRefresh: this.onRefresh })

        if (eventSocket !== null) {
            eventSocket.close();
            eventSocket = null;
        }
        // eventSocket = io.connect('minertracker.com?user=1');        
        // eventSocket.on('connect', () => {
        //     eventSocket.on('event', (msg) => {
        //         console.log('incomming data', msg)
        //         this.props.updatePerformance(msg)
        //     })

        //     eventSocket.on('onerror', (error) => {
        //         console.log('error', error)
        //     })

        //     eventSocket.on('ondisconnect', (error) => {
        //         console.log('ondisconnect')
        //     })

        //     eventSocket.on('onreconnect', (error) => {
        //         console.log('onreconnect')
        //         this.props.updatePerformance(msg)
        //     })
        // })

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);

    }

    onRefresh = () => {
        this.props.refreshComputerList()
        this.props.refreshGpuStatus()
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived = (notification) => {
        this.props.fetchGpuStatus()
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    async onIds(device) {
        console.log('Device info: ', device);
        const response = await fetch(config.apiUrl.OneSignal(device.userId), {
            method: 'PUT',
            headers: {
                'user': '1',
            },
        }).then((response) => {
            console.log(response)
        })
    }

    setSeen = async (gpuId) => {
        const response = await fetch(config.apiUrl.setSeen(gpuId), {
            method: 'PUT',
            headers: {
                'user': '1',
            },
        }).then((response) => {
            console.log(response)
        })

        this.props.fetchGpuStatus()

    }

    showDetail = (computerIndex, gpuIndex) => {
        const computerName = this.props.computerList[computerIndex].Name
        const gpuName = this.props.computerList[computerIndex].GPUs[gpuIndex].Name
        const computerId = this.props.computerList[computerIndex].ID
        const gpuId = this.props.computerList[computerIndex].GPUs[gpuIndex].ID
        this.props.navigation.navigate(ENUMS.SCREEN.DETAIL, {
            computerName,
            gpuName,
            computerId,
            gpuId,
            gpuIndex
        })
    }

    showHistory = (computerIndex, gpuIndex) => {
        const computerName = this.props.computerList[computerIndex].Name
        const gpuName = this.props.computerList[computerIndex].GPUs[gpuIndex].Name
        const computerId = this.props.computerList[computerIndex].ID
        const gpuId = this.props.computerList[computerIndex].GPUs[gpuIndex].ID
        this.props.navigation.navigate(ENUMS.SCREEN.HISTORY_GPU, {
            computerName,
            gpuName,
            computerId,
            gpuId,
            gpuIndex
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            listData: testData,
            isLoading: true,
            detailIndex: {
                computerIndex: null,
                gpuIndex: null,
            },
            prepareDelete: false,
            deleteIndex: {
                computerIndex: null,
                gpuIndex: null,
            }
        }
    }

    onPrepareDelete = (computerIndex = null, gpuIndex = null) => {
        if (!this.state.prepareDelete) {
            this.setState({
                prepareDelete: true,
                deleteIndex: {
                    computerIndex,
                    gpuIndex
                }
            })
        } else {
            if (computerIndex !== this.state.deleteIndex.computerIndex || gpuIndex !== this.state.deleteIndex.gpuIndex)
                this.setState({
                    prepareDelete: true,
                    deleteIndex: {
                        computerIndex,
                        gpuIndex
                    }
                })
            else
                this.setState({
                    prepareDelete: false,
                    deleteIndex: {
                        computerIndex: null,
                        gpuIndex: null
                    }
                })
        }

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.computerList.length === 0 || nextProps.gpuStatus.length === 0)
            this.setState({
                isLoading: true
            })
        else
            this.setState({
                isLoading: false
            })
    }

    deleteComputer = async (id) => {
        const response = await fetch(config.apiUrl.deleteComputer(id), {
            method: 'DELETE',
            headers: {
                'user': '1',
            },
        }).then((response) => {
            console.log(response)
        })

        this.props.fetchComputerList()
    }

    deleteGpu = async (computerID, gpuID) => {
        const response = await fetch(config.apiUrl.deleteGpu(computerID, gpuID), {
            method: 'DELETE',
            headers: {
                'user': '1',
            },
        }).then((response) => {
            console.log(response)
        })

        this.props.fetchComputerList()
    }

    render() {
        // console.log(this.props)
        return (
            <HomeContent
                isLoading={this.state.isLoading}
                gpuStatus={this.props.gpuStatus}
                listData={this.props.computerList}
                detailIndex={this.state.detailIndex}
                onTapDetail={this.onTapDetail}
                showDetail={this.showDetail}
                showHistory={this.showHistory}
                onPrepareDelete={this.onPrepareDelete}
                deleteIndex={this.state.deleteIndex}
                deleteComputer={this.deleteComputer}
                deleteGpu={this.deleteGpu}
                setSeen={this.setSeen}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        gpuStatus: state.gpuStatusReducer,
        performanceList: state.performanceReducer,
        computerList: state.computerListReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, computerListActions, performanceActions, gpuStatusActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)