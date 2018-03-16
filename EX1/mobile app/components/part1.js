import React, { Component } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as utils from "../utils";
export default class Part1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            isShowLocation: false
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
                    backgroundColor: '#E4F1FE',
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
                            Input latitude and longitude to get address
                        </Text>
                    </View>
                    <View
                        style={{
                            marginTop:5,
                            flex: 1 / 3,
                        }}
                    >
                        <Text style={{ marginLeft: 10 }}>Latitude</Text>
                        <TextInput
                            style={{
                                marginTop: 10,
                                marginLeft: 10,
                                marginRight: 40,
                                height: 40,
                                borderColor: "black",
                                borderWidth: 1,
                                borderRadius: 5
                            }}
                            value={this.state.lat}
                            onChangeText={text => {
                                this.setState({
                                    lat: text
                                });
                            }}
                        />
                    </View>
                    <View
                        style={{
                            marginTop:5,

                            flex: 1 / 3,
                        }}
                    >
                        <Text style={{ marginLeft: 10 }}>longitude</Text>
                        <TextInput
                            style={{
                                marginTop: 10,
                                marginLeft: 10,
                                marginRight: 40,
                                height: 40,
                                borderColor: "black",
                                borderWidth: 1,
                                borderRadius: 5
                            }}
                            value={this.state.lng}
                            onChangeText={text => {
                                this.setState({
                                    lng: text
                                });
                            }}
                        />
                    </View>{" "}
                    <View style={{ flex: 1 / 3 }}>
                        <Button
                            title="Get Address"
                            onPress={async () => {
                                try {
                                    const address = await utils.getAddress({
                                        lat: Number(this.state.lat),
                                        lng: Number(this.state.lng)
                                    });
                                    this.setState({
                                        isShowLocation: true,
                                        address: address[0].formattedAddress
                                    });
                                } catch (error) {
                                    this.setState({
                                        isShowLocation: true,
                                        address:
                                            "check input - cant get address"
                                    });
                                }
                            }}
                        />
                        {this.state.isShowLocation && (
                            <Text style={{ alignSelf: "center" }}>
                                {this.state.address}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
