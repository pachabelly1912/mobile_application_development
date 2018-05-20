import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import styles from './styles';

export default class HeaderBar extends Component {
    // 
    renderLeftButton() {
        if (this.props.renderLeftButton) {
            if (this.props.isHomeScreen) {
                return (
                    <TouchableOpacity style={styles.leftButton} onPress={this.props.handleLeftButton}>
                        <Image source={require('../../assets/images/setting-button.png')} />
                    </TouchableOpacity>
                )

            } else {
                return (
                    <TouchableOpacity style={styles.leftButton} onPress={this.props.handleLeftButton}>
                        <Image source={require('../../assets/images/back-button.png')} />
                    </TouchableOpacity>
                )
            }
        }
        return <View />
    }

    renderRightButton() {
        if (this.props.renderRightButton) {

            return (
                <TouchableOpacity style={styles.rightButton} onPress={this.props.handleRightButton}>
                    <Image source={require('../../assets/images/refresh.png')} />
                </TouchableOpacity>
            )

        }
        return <View />
    }

    render() {
        const { title } = this.props
        return (
            <View style={styles.headerContainer}>
                <View style={styles.leftView}>
                    {this.renderLeftButton()}
                </ View>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
                <View style={styles.rightView}>
                    {this.renderRightButton()}
                </ View>

            </View>
        );
    }
}

