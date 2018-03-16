import React, { Component } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as utils from "../utils";
export default class Part1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat1: null,
            long1: null,
            lat2: null,
            long2: null,
            isShowDistance: false
        };
    }

    render() {
        return (
            <View style={{ flex: 1 / 2, padding: 10 }}>
                <View
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: "black",
                        flex: 1
                    }}
                >
                    <View
                        style={{
                            height: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#E4F1FE"
                        }}
                    >
                        <Text
                            style={{
                                color: "#336E7B"
                            }}
                        >
                            Input latitude and longitude of 2 locations to get
                            distance between them
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1 / 3,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <View style={{ flex: 1 / 2 }}>
                            <Text style={{ marginLeft: 10 }}>Latitude 1</Text>
                            <TextInput
                                style={{
                                    marginLeft: 10,
                                    height: 40,
                                    marginRight: 10,
                                    borderColor: "black",
                                    borderWidth: 1,
                                    borderRadius: 5
                                }}
                                value={this.state.lat}
                                onChangeText={text => {
                                    this.setState({
                                        lat1: text
                                    });
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 / 2 }}>
                            <Text style={{ marginLeft: 10 }}>Longitude 1</Text>
                            <TextInput
                                style={{
                                    marginLeft: 10,
                                    height: 40,
                                    marginRight: 10,
                                    borderColor: "black",
                                    borderWidth: 1,
                                    borderRadius: 5
                                }}
                                value={this.state.lat}
                                onChangeText={text => {
                                    this.setState({
                                        long1: text
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1 / 3,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <View style={{ flex: 1 / 2 }}>
                            <Text style={{ marginLeft: 10 }}>latitude 2</Text>
                            <TextInput
                                style={{
                                    marginLeft: 10,
                                    height: 40,
                                    marginRight: 10,
                                    borderColor: "black",
                                    borderWidth: 1,
                                    borderRadius: 5
                                }}
                                value={this.state.lat}
                                onChangeText={text => {
                                    this.setState({
                                        lat2: text
                                    });
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 / 2 }}>
                            <Text style={{ marginLeft: 10 }}>Longitude 2</Text>
                            <TextInput
                                style={{
                                    marginLeft: 10,
                                    height: 40,
                                    marginRight: 10,
                                    borderColor: "black",
                                    borderWidth: 1,
                                    borderRadius: 5
                                }}
                                value={this.state.lat}
                                onChangeText={text => {
                                    this.setState({
                                        long2: text
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 / 3 }}>
                        <Button
                            title="Get distance"
                            onPress={async () => {
                                try {
                                    const {
                                        lat1,
                                        long1,
                                        lat2,
                                        long2
                                    } = this.state;
                                    const {
                                        distance
                                    } = await utils.getDistance(
                                        lat1,
                                        long1,
                                        lat2,
                                        long2
                                    );
                                    this.setState({
                                        isShowDistance: true,
                                        distance
                                    });
                                } catch (error) {
                                    this.setState({
                                        isShowDistance: true,
                                        distance:
                                            "check your input - cant get distance"
                                    });
                                }
                            }}
                        />
                        {this.state.isShowDistance && (
                            <Text style={{ alignSelf: "center" }}>
                                {Math.round(this.state.distance*100)/100} km
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
