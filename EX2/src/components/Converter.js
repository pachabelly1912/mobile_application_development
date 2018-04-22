import React, { Component } from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';

import CurrencyPicker from './CurrencyPicker';
import History from './History';

class Converter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromCurrency: props.data.base,
      fromRate: 1,
      toCurrency: props.data.base,
      toRate: 1,
      amount: '',
    };
  }

  getConvertedAmount() {
    const { amount, toRate, fromRate } = this.state;
    const money = parseFloat(amount, 10);
    console.log(money)
    if (money >= 0) {
      return money * toRate / fromRate;
    }
    return 0;
  }

  restore = (history) => {
    const { data } = this.props;
    const from = data.rates.find((item) => item.currency === history.from);
    const to = data.rates.find((item) => item.currency === history.to);
    if (from && to) {
      this.setState({
        amount: history.amount,
        fromRate: from.rate,
        toRate: to.rate,
        fromCurrency: history.from,
        toCurrency: history.to,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.base}>
          <TextInput
            style={styles.amount}
            placeholder="Enter Amount"
            placeholderTextColor='#efefef'
            returnKeyType='done'
            keyboardType='numeric'
            maxLength={15}
            value={this.state.amount}
            onChangeText={(amount) => {
              this.setState({amount});
            }}
          />
          <CurrencyPicker
            selectedCurrency={this.state.fromCurrency}
            currencies={this.props.data.rates}
            onCurrencyChange={(data) => {
              this.setState({
                fromCurrency: data.currency,
                fromRate: data.rate,
              });
            }}
          />
        </View>
        <View style={[styles.base, styles.converted]}>
          <Text style={styles.amount}>{this.getConvertedAmount()}</Text>
          <CurrencyPicker
            selectedCurrency={this.state.toCurrency}
            currencies={this.props.data.rates}
            onCurrencyChange={(data) => {
              this.setState({
                toCurrency: data.currency,
                toRate: data.rate,
              });
            }}
          />
          <View style={styles.save}>
            <Button
              title='Save'
              color="#841584"
              disabled={this.state.fromCurrency === this.state.toCurrency}
              onPress={() => {
                this.props.onConversion(
                  this.state.amount,
                  this.getConvertedAmount(),
                  this.state.fromCurrency,
                  this.state.toCurrency
                )
              }}
            />
          </View>
        </View>
        <History data={this.props.history} onSelect={this.restore} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  base: {
    backgroundColor: 'grey',
    paddingVertical: 5,
  },
  amount: {
    marginHorizontal: 10,
    height: 50,
    fontSize: 25,
    color: '#fff',
  },
  converted: {
    backgroundColor: '#DADFE1',
    alignItems: 'flex-start',
  },
  save: {
    marginLeft: 3,
    marginTop: 4,
  }
});

export default Converter;