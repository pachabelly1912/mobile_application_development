import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  ActivityIndicator,
  AsyncStorage
} from "react-native";

import Converter from "./components/Converter";

class App extends Component {
  state = {
    data: {
      base: "USD",
      rates: [
        { currency: "USD", rate: "1.2309" },
        { currency: "JPY", rate: "132.41" },
        { currency: "BGN", rate: "1.9558" },
        { currency: "VND", rate: "22727.2727273" }
      ]
    }
};

  render() {
    const date = new Date();
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Currency Converter</Text>
          <Text style={styles.subtitle}>
            Conversion rates for {date.toDateString()}
          </Text>
        </View>
        <Converter
          data={this.state.data}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#4ed34e',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 5,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
  },
  loader: {
    alignSelf: 'center',
    marginTop: 50,
  },
});

export default App;
