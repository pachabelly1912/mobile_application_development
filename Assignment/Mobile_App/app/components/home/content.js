import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import styles from './styles';
export default class HomeContent extends Component {

    renderItem(item, index) {
        const deleteButton = index === this.props.deleteIndex.computerIndex && this.props.deleteIndex.gpuIndex === null ?
            <TouchableOpacity onPress={() => { this.props.deleteComputer(item.ID) }}>
                <Image style={styles.deleteButton} source={require('../../assets/images/delete.png')} />
            </ TouchableOpacity> : <View />

        return <View style={{ backgroundColor: '#0B1F3D' }}>
            <View style={styles.headerList}>
                {deleteButton}
                <TouchableOpacity style={{ flex: 1 }} onLongPress={() => { this.props.onPrepareDelete(index) }}>
                    <Text style={styles.headerText}>{item.Name}</Text>
                </TouchableOpacity>
            </View>
            <View>
                {item.GPUs.map((gpu, gpuIndex) => {
                    let isOk;
                    let health;
                    if (this.props.gpuStatus.length > 1) {
                        health = this.props.gpuStatus.filter((status)=> status.ID === gpu.ID)[0].health
                        isOk =  health === 0;
                    }
                    const statusButton = isOk ?
                        <TouchableOpacity style={styles.statusButtonContainer}>
                            <Image style={styles.statusButton} source={require('../../assets/images/safe-status-button.png')} />
                        </TouchableOpacity> :
                        health === -1 ?
                            <TouchableOpacity style={styles.statusButtonContainer}>
                                <Image style={styles.statusButton} source={require('../../assets/images/lost-signal.png')} />
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.statusButtonContainer} onPress={()=>{this.props.showDanger(index, gpuIndex)}}>
                                <Image style={styles.statusButton} source={require('../../assets/images/danger-status-button.png')} />
                                <View style={{justifyContent: 'center', alignItems: 'center' ,position: 'absolute', top: -5, right: -5, width: 15, height: 15, borderRadius: 7.5,backgroundColor: 'red'}}>
                                    <Text style={{fontSize: 8, color: 'white'}}>{health}</Text>
                                </View>
                            </TouchableOpacity>


                    const deleleButton = index === this.props.deleteIndex.computerIndex && this.props.deleteIndex.gpuIndex === gpuIndex ?
                        <TouchableOpacity onPress={() => { this.props.deleteGpu(item.ID, gpu.ID) }}>
                            <Image style={styles.deleteButton} source={require('../../assets/images/delete.png')} />
                        </ TouchableOpacity> : <View />
                    return (
                        <View key={gpuIndex}>
                            {gpuIndex !== 0 && <Image style={styles.seperator} source={require('../../assets/images/seperator.png')} />}
                            <View style={styles.gpuContainer}>
                                {deleleButton}
                                {statusButton}
                                <TouchableOpacity style={{ flex: 3 / 5 }} onLongPress={() => { this.props.onPrepareDelete(index, gpuIndex) }}>
                                    <Text style={styles.gpuNameText}>{gpu.Name}</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 2 / 5, justifyContent: 'space-between', flexDirection: 'row', paddingRight: 20 }}>
                                    <TouchableOpacity onPress={()=>{this.props.setSeen(gpu.ID)}} style={{backgroundColor: 'white', marginHorizontal: 5 , width: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style ={{color: 'red', fontWeight: 'bold', fontSize: 12}}>Resolve</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={!isOk} onPress={() => { this.props.showDetail(index, gpuIndex) }}><Image style={styles.detailButton} source={require('../../assets/images/chart.png')} /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.props.showHistory(index, gpuIndex) }}><Image style={styles.detailButton} source={require('../../assets/images/history.png')} /></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
            <View style={{ backgroundColor: 'black', height: 5 }} />
        </View>
    }

    render() {
        const mainContainer = this.props.isLoading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="white" />
            </View> : <FlatList
                style={{ flex: 1 }}
                data={this.props.listData}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                keyExtractor={(item, index) => { return index }}
            />
        return (
            <View style={styles.container}>
                <View style={styles.snackBar} />
                {mainContainer}
            </View>
        )
    }
}