import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button
} from "react-native";
import utils from "./utils";
import Part1 from './components/part1';
import Part2 from './components/part2'
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            isShowLocation: false
        };
    }
    componentWillMount() {
        // utils({
        //     lat: 40.7809261,
        //     lng:
        // });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        height: 64,
                        backgroundColor: "#4183D7",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text style={{ fontSize: 24, color: "#22313F" }}>
                        Mobile exercise
                    </Text>
                </View>
                <Part1 />
                <Part2 />
            </View>
        );
    }
}
