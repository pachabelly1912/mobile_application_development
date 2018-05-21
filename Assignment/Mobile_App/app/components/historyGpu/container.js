import React, { Component } from 'react';
import {
    BackHandler
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as historyActions from '../../actions/historyActions';
import HeaderBar from '../../commons/headerBar';
import HistoryGpuContent from './content';
import moment from 'moment'

export class HistoryGpuContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    static navigationOptions = (navigator) => {
        const params = navigator.navigation.state.params
        return {
            header: <HeaderBar
                title={'History'}
                renderLeftButton={true}
                isHomeScreen={false}
                renderRightButton={true}
                handleRightButton={params === undefined ? null : params.onRefresh}
                handleLeftButton={() => {
                    navigator.navigation.goBack();
                }} />
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack(null);
        return true;
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.navigation.setParams({ onRefresh: this.onRefresh })
        this.props.fetchHistory(params.gpuId, 100000000, 10)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.history.length === 0)
            this.setState({
                isLoading: true
            })
        else
            this.setState({
                isLoading: false
            })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.clearHistory()
    }

    onRefresh = () => {
        const { params } = this.props.navigation.state;
        this.props.clearHistory()
        this.props.fetchHistory(params.gpuId, 100000000, 10)
    }

    onEndReached = (begin) => {
        const { params } = this.props.navigation.state;
        this.props.fetchHistory(params.gpuId, begin, 10)
    }

    render() {
        const { params } = this.props.navigation.state;
        const data = params.isDanger ? this.props.history.filter(item => moment(item.Time).format('x') > moment(item.Time).format('x')  ) : this.props.history
        return (
            <HistoryGpuContent
                isLoading={this.state.isLoading}
                history={this.props.history}
                computerName={params.computerName}
                gpuName={params.gpuName + '-' + (params.gpuIndex + 1)}
                onEndReached={this.onEndReached}
                gpuSetting = {params.gpuSetting}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        history: state.historyReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, historyActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryGpuContainer)