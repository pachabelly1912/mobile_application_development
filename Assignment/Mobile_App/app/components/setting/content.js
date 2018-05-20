import React, { Component } from 'react';
import {
    View,
    Picker,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Switch,
    Slider,
    Alert,
    Dimensions
} from 'react-native';
import styles from './styles'

const { height, width } = Dimensions.get('window')
export default class SettingContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            enableTemp: false,
            enableFan: false,
            enablePower: false,
            enableRam: false,
            showEditButton: true,
            MinFanSpeed: null,
            MaxFanSpeed: null,
            MinTemperature: null,
            MaxTemperature: null,
            MinPowerUsage: null,
            MaxPowerUsage: null,
            MinMemoryUsage: null,
            MaxMemoryUsage: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        const { selectedGpu } = nextProps
        if (selectedGpu !== null) {
            this.setState({
                enableFan: selectedGpu.MinFanSpeed !== null,
                enableTemp: selectedGpu.MinTemperature !== null,
                enablePower: selectedGpu.MinPowerUsage !== null,
                enableRam: selectedGpu.MinMemoryUsage !== null,
                MinFanSpeed: selectedGpu.MinFanSpeed,
                MaxFanSpeed: selectedGpu.MaxFanSpeed,
                MinTemperature: selectedGpu.MinTemperature,
                MaxTemperature: selectedGpu.MaxTemperature,
                MinPowerUsage: selectedGpu.MinPowerUsage,
                MaxPowerUsage: selectedGpu.MaxPowerUsage,
                MinMemoryUsage: selectedGpu.MinMemoryUsage,
                MaxMemoryUsage: selectedGpu.MaxMemoryUsage,
            })
        }
    }

    editButtonTapped = () => {
        this.setState({
            showEditButton: false,

        })
    }

    cancelButtonTapped = () => {
        const { selectedGpu } = this.props
        this.setState({
            showEditButton: true,
            enableFan: selectedGpu.MinFanSpeed !== null,
            enableTemp: selectedGpu.MinTemperature !== null,
            enablePower: selectedGpu.MinPowerUsage !== null,
            enableRam: selectedGpu.MinMemoryUsage !== null,
            MinFanSpeed: selectedGpu.MinFanSpeed,
            MaxFanSpeed: selectedGpu.MaxFanSpeed,
            MinTemperature: selectedGpu.MinTemperature,
            MaxTemperature: selectedGpu.MaxTemperature,
            MinPowerUsage: selectedGpu.MinPowerUsage,
            MaxPowerUsage: selectedGpu.MaxPowerUsage,
            MinMemoryUsage: selectedGpu.MinMemoryUsage,
            MaxMemoryUsage: selectedGpu.MaxMemoryUsage,
        })
    }
    alertMess = (mess) => {
        Alert.alert(
            'Warming',
            mess,
            [
                { text: 'OK', onPress: () => {}},
            ],
            { cancelable: false }
        )
    }
    onDone = async () => {
        const { enableTemp, enableFan, enablePower, enableRam, MinFanSpeed, MaxFanSpeed, MinTemperature, MaxTemperature, MinPowerUsage, MaxPowerUsage, MinMemoryUsage, MaxMemoryUsage } = this.state

        if (enableFan && MinFanSpeed && MaxFanSpeed && MinFanSpeed > MaxFanSpeed) {
            return this.alertMess("Max fan speed must be more than min fan speed")
        }
        if (enableTemp && MinTemperature && MaxTemperature && MinTemperature > MaxTemperature) {
            return this.alertMess("Max temperature must be more than min temperature")
        }
        if (enablePower && MinPowerUsage && MaxPowerUsage && MinPowerUsage > MaxPowerUsage) {
            return this.alertMess("Max power usage must be more than min power usage")
        }
        if (enableRam && MinMemoryUsage && MaxMemoryUsage && MinMemoryUsage > MaxMemoryUsage) {
            return this.alertMess("Max memory usage must be more than min memory usage")
        }

        if (enableFan && (!MinFanSpeed || !MaxFanSpeed)) {
            return this.alertMess("null value of fan speed")
        }

        if (enableTemp && (!MinTemperature || !MaxTemperature)) {
            return this.alertMess("null value of temperature")
        }

        if (enablePower && (!MinPowerUsage || !MaxPowerUsage)) {
            return this.alertMess("null value of power usage")
        }

        if (enableRam && (!MinMemoryUsage || !MaxMemoryUsage)) {
            return this.alertMess("null value of temperature")
        }
        
        await this.props.postSetting(this.state)

        this.setState({
            showEditButton: true
        })
    }

    renderMainBoard() {
        const button = this.state.showEditButton ?
            <TouchableOpacity onPress={this.editButtonTapped} style={{ backgroundColor: '#051429', borderColor: 'white', borderWidth: 1, alignSelf: 'center', justifyContent: 'center', height: 30, width: width / 3 - 10, borderRadius: 5 }}>
                <Text style={{ color: 'red', fontFamily: 'OCRAStd', alignSelf: 'center', fontSize: 13 }}>Edit</Text>
            </TouchableOpacity> :
            [<TouchableOpacity onPress={this.cancelButtonTapped} key={1} style={{ backgroundColor: '#051429', borderColor: 'white', borderWidth: 1, alignSelf: 'center', justifyContent: 'center', height: 30, width: width / 3 - 10, borderRadius: 5 }}>
                <Text style={{ color: '#50E3C2', fontFamily: 'OCRAStd', alignSelf: 'center', fontSize: 13 }}>Cancel</Text>
            </TouchableOpacity>,
            <TouchableOpacity onPress={this.onDone} key={2} style={{ backgroundColor: '#051429', borderColor: 'white', borderWidth: 1, alignSelf: 'center', justifyContent: 'center', height: 30, width: width / 3 - 10, borderRadius: 5 }}>
                <Text style={{ color: '#50E3C2', fontFamily: 'OCRAStd', alignSelf: 'center', fontSize: 13 }}>Okay</Text>
            </TouchableOpacity>]

        return (
            <View style={{ flex: 1 }}>
                <Text style={[styles.topicTxt, { marginTop: 10 }]}>{this.props.selectedGpu.Name}</Text>
                <View style={{ flex: 7 / 8 }}>
                    <View style={{ flex: 1 / 4 }} >
                        <View style={{ flex: 1 / 5, backgroundColor: '#051429', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.topicTxt, { color: '#50E3C2', marginLeft: 10, fontSize: 15 }]}>Temp's bound</Text>
                            <Switch disabled={this.state.showEditButton} value={this.state.enableTemp} onValueChange={() => { this.setState({ enableTemp: !this.state.enableTemp }) }} />
                        </View>
                        <View style={{ flex: 4 / 5, flexDirection: 'row' }}>
                            <View style={{ flex: 1 / 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ resizeMode: 'stretch' }} source={require('../../assets/images/temp.png')} />
                                <Text style={[styles.topicTxt, { color: '#50E3C2', marginTop: 5, fontSize: 10 }]}>{this.state.MinTemperature + '-' + this.state.MaxTemperature + '◦C'}</Text>
                            </View>
                            <View style={{ flex: 4 / 5 }}>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Min value</Text>
                                    <Slider
                                        disabled={!this.state.enableTemp || this.state.showEditButton}
                                        step={1} value={this.state.MinTemperature}
                                        maximumTrackTintColor='white'
                                        maximumValue={100}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MinTemperature: value }) }}
                                    />
                                </View>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Max value</Text>
                                    <Slider
                                        disabled={!this.state.enableTemp || this.state.showEditButton}
                                        step={1} value={this.state.MaxTemperature}
                                        maximumTrackTintColor='white'
                                        maximumValue={100}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MaxTemperature: value }) }}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 / 4 }} >
                        <View style={{ flex: 1 / 5, backgroundColor: '#051429', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.topicTxt, { color: '#50E3C2', marginLeft: 10, fontSize: 15 }]}>Fan's bound</Text>
                            <Switch disabled={this.state.showEditButton} value={this.state.enableFan} onValueChange={() => { this.setState({ enableFan: !this.state.enableFan }) }} />
                        </View>
                        <View style={{ flex: 4 / 5, flexDirection: 'row' }}>
                            <View style={{ flex: 1 / 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ resizeMode: 'stretch' }} source={require('../../assets/images/fan.png')} />
                                <Text style={[styles.topicTxt, { color: '#50E3C2', marginTop: 5, fontSize: 10 }]}>{this.state.MinFanSpeed + '-' + this.state.MaxFanSpeed + '%'}</Text>
                            </View>
                            <View style={{ flex: 4 / 5 }}>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Min value</Text>
                                    <Slider
                                        disabled={!this.state.enableFan || this.state.showEditButton}
                                        step={1}
                                        value={this.state.MinFanSpeed}
                                        maximumTrackTintColor='white'
                                        maximumValue={100}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MinFanSpeed: value }) }}
                                    />
                                </View>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Max value</Text>
                                    <Slider
                                        disabled={!this.state.enableFan || this.state.showEditButton}
                                        step={1}
                                        value={this.state.MaxFanSpeed}
                                        maximumTrackTintColor='white'
                                        maximumValue={100}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MaxFanSpeed: value }) }}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 / 4 }} >
                        <View style={{ flex: 1 / 5, backgroundColor: '#051429', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.topicTxt, { color: '#50E3C2', marginLeft: 10, fontSize: 15 }]}>Power's bound</Text>
                            <Switch disabled={this.state.showEditButton} value={this.state.enablePower} onValueChange={() => { this.setState({ enablePower: !this.state.enablePower }) }} />
                        </View>
                        <View style={{ flex: 4 / 5, flexDirection: 'row' }}>
                            <View style={{ flex: 1 / 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ resizeMode: 'stretch' }} source={require('../../assets/images/power.png')} />
                                <Text style={[styles.topicTxt, { color: '#50E3C2', marginTop: 5, fontSize: 10 }]}>{this.state.MinPowerUsage + '-' + this.state.MaxPowerUsage + '%'}</Text>
                            </View>
                            <View style={{ flex: 4 / 5 }}>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Min value</Text>
                                    <Slider
                                        disabled={!this.state.enablePower || this.state.showEditButton}
                                        step={1} value={this.state.MinPowerUsage}
                                        maximumTrackTintColor='white'
                                        maximumValue={300}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MinPowerUsage: value }) }}
                                    />
                                </View>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Max value</Text>
                                    <Slider
                                        disabled={!this.state.enablePower || this.state.showEditButton}
                                        step={1} value={this.state.MaxPowerUsage}
                                        maximumTrackTintColor='white'
                                        maximumValue={300}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MaxPowerUsage: value }) }}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 / 4 }} >
                        <View style={{ flex: 1 / 5, backgroundColor: '#051429', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.topicTxt, { color: '#50E3C2', marginLeft: 10, fontSize: 15 }]}>Memory's bound</Text>
                            <Switch disabled={this.state.showEditButton} value={this.state.enableRam} onValueChange={() => { this.setState({ enableRam: !this.state.enableRam }) }} />
                        </View>
                        <View style={{ flex: 4 / 5, flexDirection: 'row' }}>
                            <View style={{ flex: 1 / 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={{ resizeMode: 'stretch' }} source={require('../../assets/images/ram.png')} />
                                <Text style={[styles.topicTxt, { color: '#50E3C2', marginTop: 5, fontSize: 10 }]}>{this.state.MinMemoryUsage + '-' + this.state.MaxMemoryUsage + '%'}</Text>
                            </View>
                            <View style={{ flex: 4 / 5 }}>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Min value</Text>
                                    <Slider
                                        disabled={!this.state.enableRam || this.state.showEditButton}
                                        step={1}
                                        value={this.state.MinMemoryUsage}
                                        maximumTrackTintColor='white'
                                        maximumValue={100}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MinMemoryUsage: value }) }}
                                    />
                                </View>
                                <View style={{ flex: 1 / 2, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'OCRAStd', marginLeft: 10, fontSize: 13 }}>Max value</Text>
                                    <Slider
                                        disabled={!this.state.enableRam || this.state.showEditButton}
                                        step={1}
                                        value={this.state.MaxMemoryUsage}
                                        maximumTrackTintColor='white'
                                        maximumValue={100}
                                        minimumValue={0}
                                        onValueChange={(value) => { this.setState({ MaxMemoryUsage: value }) }}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 / 8, flexDirection: 'row', justifyContent: 'space-around' }}>
                    {button}
                </View>
            </View >
        )
    }

    render() {
        const mainContainer = this.props.selectedGpu === null ?
            <View style={styles.selectModelContainer}>
                <View style={styles.topicView}>
                    <Text style={styles.topicTxt}>Select Card Type</Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    {this.props.gpuSetting.map((item, index) => {
                        return (
                            <TouchableOpacity style={styles.cardTypeView} key={index} onPress={() => { this.props.selectGpu(index) }}>
                                <Text style={styles.cardTypeName}>{item.Name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
            : this.renderMainBoard()

        return (
            <View style={styles.container}>
                <View style={styles.snackBar} />
                {mainContainer}
            </View>
        )
    }
}