import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';
import { StockLine } from 'react-native-pathjs-charts'
import styles from './styles';
export default class DetailContent extends Component {

    render() {
        
        let options = {
            min: 0,
            max: 100,
            width: 230,
            height: 80,
            color: '#2980B9',
            margin: {
                top: 10,
                left: 35,
                bottom: 30,
                right: 10
            },
            animate: {
                type: 'delayed',
                duration: 200
            },
            axisX: {
                showAxis: true,
                showLines: false,
                showLabels: false,
                showTicks: false,
                zeroAxis: false,
                orient: 'bottom',
                tickValues: [],
                label: {
                    // fontFamily: 'OCRAStd',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#ffffff'
                }
            },
            axisY: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'left',
                tickValues: [],
                label: {
                    // fontFamily: 'OCRAStd',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#ffffff'
                }
            }
        }

        return (

            <View style={styles.container}>
                <View style={styles.snackBar} />
                <View style={{ flex: 1 }}>
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
                        color: 'white',
                        // fontFamily: 'OCRAStd'
                    }}>{this.props.gpuName}</Text>
                    <View style={{ flexDirection: 'row', flex: 1 / 4, paddingTop: 10 }}>
                        <View style={{ width: 70, justifyContent: 'center' }} >
                            <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/temp.png')} />
                            <Text style={{color: 'white', alignSelf: 'center', height: 30,fontFamily: 'OCRAStd', marginTop: 10}}>{this.props.tempData[0].y+ '◦C'}</Text>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <StockLine data={[this.props.tempData]} options={options} xKey='x' yKey='y' />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 / 4, paddingTop: 10 }}>
                        <View style={{ width: 70, justifyContent: 'center' }} >
                            <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/fan.png')} />
                            <Text style={{color: 'white', alignSelf: 'center', height: 30,fontFamily: 'OCRAStd', marginTop: 10}}>{this.props.fanData[0].y+ '%'}</Text>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <StockLine data={[this.props.fanData]} options={options} xKey='x' yKey='y' />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 / 4, paddingTop: 10 }}>
                        <View style={{ width: 70, justifyContent: 'center' }} >
                            <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/power.png')} />
                            <Text style={{color: 'white', alignSelf: 'center', height: 30,fontFamily: 'OCRAStd', marginTop: 10}}>{this.props.powerData[0].y+ '%'}</Text>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                            <StockLine data={[this.props.powerData]} options={{ ...options, min: 0, max: 200 }} xKey='x' yKey='y' />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 / 4, paddingTop: 10 }}>
                        <View style={{ width: 70, justifyContent: 'center' }} >
                            <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/ram.png')} />
                            <Text style={{color: 'white', alignSelf: 'center', height: 30,fontFamily: 'OCRAStd', marginTop: 10}}>{Math.round(this.props.ramData[0].y)+ '%'}</Text>
                        </View>
                        <View style={{ paddingTop: 20 }}>
                        <StockLine data={[this.props.ramData]} options={options} xKey='x' yKey='y' />
                        </View>
                    </View>

                </ View>

            </View>
        )
    }

}