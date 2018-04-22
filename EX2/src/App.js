import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  ActivityIndicator,
  AsyncStorage
} from "react-native";

import { getHistory, setHistory } from "./support/Storage";

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
    },
    history: []
  };

  async getHistory() {
    const savedItems = await getHistory();
    this.setState({
      history: savedItems
    });
  }

  componentDidMount() {
    this.getHistory();
  }

  updateHistory = (amount, converted, from, to) => {
    if (from === to) {
      return;
    }
    const history = this.state.history;
    history.unshift({
      amount,
      converted,
      from,
      to,
      date: this.state.data.time
    });
    this.setState({
      history: history.slice(0, 30)
    });
    setHistory(this.state.history);
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
          onConversion={this.updateHistory}
          history={this.state.history}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  error: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 5
  },
  title: {
    fontSize: 20,
    color: "#fff"
  },
  subtitle: {
    color: "#fff",
    fontSize: 14
  },
  loader: {
    alignSelf: "center",
    marginTop: 50
  }
});

export default App;
