import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler } from 'react-native'
import { bindActionCreators } from 'redux';
import SettingContent from './content';
import * as gpuSettingActions from '../../actions/gpuSettingActions';
import HeaderBar from '../../commons/headerBar';
import * as config from '../../config';
// import DetailContent from './content';

export class SettingContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedGpu: null
        }
    }

    static navigationOptions = (navigator) => {
        return {
            header: <HeaderBar title={'Setting'} renderLeftButton={true} isHomeScreen={false} renderRightButton={false} handleLeftButton={() => {
                navigator.navigation.goBack()
            }} />
        }
    }

    postSetting = async ({ enableTemp, enableFan, enablePower, enableRam, MinFanSpeed, MaxFanSpeed, MinTemperature, MaxTemperature, MinPowerUsage, MaxPowerUsage, MinMemoryUsage, MaxMemoryUsage, }) => {
        const minFan = enableFan ? MinFanSpeed : null;
        const maxFan = enableFan ? MaxFanSpeed : null;
        const minTemp = enableTemp ? MinTemperature : null;
        const maxTemp = enableTemp ? MaxTemperature : null;
        const minPower = enablePower ? MinPowerUsage : null;
        const maxPower = enablePower ? MaxPowerUsage : null;
        const minRam = enableRam ? MinMemoryUsage : null;
        const maxRam = enableRam ? MaxMemoryUsage : null;
        const body = JSON.stringify({
            MinFanSpeed: minFan,
            MaxFanSpeed: maxFan,
            MinTemperature: minTemp,
            MaxTemperature: maxTemp,
            MinPowerUsage: minPower,
            MaxPowerUsage: maxPower,
            MinMemoryUsage: minRam,
            MaxMemoryUsage: maxRam,
        })
        const response = await fetch(config.apiUrl.updateSetting(this.state.selectedGpu.Name), {
            method: 'PUT',
            headers: {
                'user': '1',
                'Content-Type': 'application/json',
            },
            body: body
        }).then((response) => {
            if (response.status === 200) {
                this.props.fetchGpuList()
                this.setState({
                    selectedGpu: null,
                })
            }
        })



    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack(null);
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.fetchGpuList()
    }

    selectGpu = (index) => {
        this.setState({
            selectedGpu: this.props.gpuSetting[index]
        })
    }

    render() {
        return <SettingContent
            gpuSetting={this.props.gpuSetting}
            selectedGpu={this.state.selectedGpu}
            selectGpu={this.selectGpu}
            postSetting={this.postSetting}
        />
    }

}

function mapStateToProps(state) {
    return {
        gpuSetting: state.gpuSettingReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, gpuSettingActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)