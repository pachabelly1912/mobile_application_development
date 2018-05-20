import React, { Component } from 'react';
import {
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderBar from '../../commons/headerBar';
import DetailContent from './content';
import * as performanceInfoActions from '../../actions/performanceInfoActions';
const initData = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }];
export class DetailContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tempData: initData,
            fanData: initData,
            powerData: initData,
            ramData: initData
        }
    }

    static navigationOptions = (navigator) => {
        return {
            header: <HeaderBar
                title={'Detail'}
                renderLeftButton={true}
                isHomeScreen={false}
                renderRightButton={false}
                handleLeftButton={() => {
                    navigator.navigation.goBack();
                }} />
        }
    }

    pushData = (newInfo) => {

        const tempData = this.state.tempData.map((point, index) => {
            if (index === 0) {
                return {
                    x: 0,
                    y: newInfo.Temperature
                }
            } else {
                return {
                    x: index,
                    y: this.state.tempData[index - 1].y
                }
            }
        })

        const fanData = this.state.tempData.map((point, index) => {
            if (index === 0) {
                return {
                    x: 0,
                    y: newInfo.FanSpeed
                }
            } else {
                return {
                    x: index,
                    y: this.state.fanData[index - 1].y
                }
            }
        })

        const powerData = this.state.powerData.map((point, index) => {
            if (index === 0) {
                return {
                    x: 0,
                    y: newInfo.PowerUsage
                }
            } else {
                return {
                    x: index,
                    y: this.state.powerData[index - 1].y
                }
            }
        })
        const ramData = this.state.ramData.map((point, index) => {
            if (index === 0) {
                return {
                    x: 0,
                    y: newInfo.MemoryUsage
                }
            } else {
                return {
                    x: index,
                    y: this.state.ramData[index - 1].y
                }
            }
        })
        this.setState({ tempData, fanData, powerData, ramData })

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.performanceInfo !== {}) {
            const tempData = this.state.tempData.map((point, index) => {
                if (index === 0) {
                    return {
                        x: 0,
                        y: nextProps.performanceInfo.Temperature
                    }
                } else {
                    return {
                        x: index,
                        y: this.state.tempData[index - 1].y
                    }
                }
            })

            const fanData = this.state.tempData.map((point, index) => {
                if (index === 0) {
                    return {
                        x: 0,
                        y: nextProps.performanceInfo.FanSpeed
                    }
                } else {
                    return {
                        x: index,
                        y: this.state.fanData[index - 1].y
                    }
                }
            })

            const powerData = this.state.powerData.map((point, index) => {
                if (index === 0) {
                    return {
                        x: 0,
                        y: nextProps.performanceInfo.PowerUsage
                    }
                } else {
                    return {
                        x: index,
                        y: this.state.powerData[index - 1].y
                    }
                }
            })
            const ramData = this.state.ramData.map((point, index) => {
                if (index === 0) {
                    return {
                        x: 0,
                        y: nextProps.performanceInfo.MemoryUsage
                    }
                } else {
                    return {
                        x: index,
                        y: this.state.ramData[index - 1].y
                    }
                }
            })

            this.setState({ tempData, fanData, powerData, ramData })
        }
    }
    
    handleBackButtonClick = () => {
        this.props.navigation.goBack(null);
        return true;
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.myInterval = setInterval(() => {
            this.props.fetchPerformanceInfo(params.gpuId)

        }, 10000)
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        clearInterval(this.myInterval);
    }

    render() {
        const { params } = this.props.navigation.state;
        return <DetailContent
            computerName={params.computerName}
            gpuName={params.gpuName + '-' + (params.gpuIndex + 1)}
            tempData={this.state.tempData}
            fanData={this.state.fanData}
            ramData={this.state.ramData}
            powerData={this.state.powerData}
        />
    }

}

function mapStateToProps(state) {
    return {
        performanceInfo: state.performanceInfoReducer,
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, performanceInfoActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer)