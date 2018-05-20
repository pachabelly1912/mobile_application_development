import React, { Component } from 'react';
import {
    View,
    Image,
    FlatList,
    Text,
    ActivityIndicator
} from 'react-native';
import { StockLine } from 'react-native-pathjs-charts'
import styles from './styles';
import moment from 'moment';
export default class HistoryGpuContent extends Component {
    renderItem(item, index) {
        return (
            <View style={{ height: 60 }}>
                <View style={{ backgroundColor: '#0B1F3D', height: 55, borderRadius: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={{ color: '#9B9B9B', marginRight: 5 }}>{moment(item.Time).format('D/MM/YYYY, h:mm:ss a')}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 / 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 18, width: 18, resizeMode: 'stretch' }} source={require('../../assets/images/temp.png')} />
                            <Text style={{ color: 'white', fontSize: 15, marginLeft: 5 }}>{item.Temperature + '◦C'}</Text>
                        </View>
                        <View style={{ flex: 1 / 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 18, width: 18, resizeMode: 'stretch' }} source={require('../../assets/images/fan.png')} />
                            <Text style={{ color: 'white', fontSize: 15, marginLeft: 5 }}>{item.FanSpeed + '%'}</Text>
                        </View>
                        <View style={{ flex: 1 / 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 18, width: 18, resizeMode: 'stretch' }} source={require('../../assets/images/power.png')} />
                            <Text style={{ color: 'white', fontSize: 15, marginLeft: 5 }}>{item.PowerUsage + '%'}</Text>
                        </View>
                        <View style={{ flex: 1 / 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 18, width: 18, resizeMode: 'stretch' }} source={require('../../assets/images/ram.png')} />
                            <Text style={{ color: 'white', fontSize: 15, marginLeft: 5 }}>{Math.round(item.MemoryUsage) + '%'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const mainContainer = this.props.isLoading ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View> : <FlatList
                style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
                data={this.props.history}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                keyExtractor={(item, index) => { return index }}
                onEndReached={() => { this.props.onEndReached(this.props.history.slice(-1).pop().ID - 1) }}
            />
        return (

            <View style={styles.container}>
                <View style={styles.snackBar} />
                <Text style={{
                    backgroundColor: '#051429',
                    paddingTop: 10,
                    paddingLeft: 10,
                    height: 30,
                    color: '#42C84B',
                    // fontFamily: 'OCRAStd'
                }}>{this.props.computerName}</Text>
                <Text style={{
                    paddingTop: 10,
                    paddingLeft: 30,
                    fontSize: 13,
                    color: '#50E3C2',
                    // fontFamily: 'OCRAStd'
                }}>{this.props.gpuName}</Text>
                {mainContainer}
            </View>
        )
    }

}