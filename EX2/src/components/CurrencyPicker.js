import React, { Component } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  Modal,
  ListView,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';

class CurrencyPicker extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.currencies),
      isVisible: false,
    };
  }

  renderRow = (data) => {
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.onCurrencyChange(data);
          this.setState({
            isVisible: false,
          });
        }}
      >
        <View style={styles.row}>
          <Text>{data.currency}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderHeader = () => {
    return (
      <View style={styles.heading}>
        <Text style={styles.title}>Select Currency</Text>
        <Button
          style={styles.close}
          onPress={() => {
            this.setState({
              isVisible: false,
            });
          }}
          title='CLOSE'
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => {
            this.setState({
              isVisible: false,
            });
          }}
        >
          <View style={styles.modal}>
            <ListView
              renderHeader={this.renderHeader}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              renderSeparator={() => <View style={styles.separator}/>}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>
        <Button
          style={styles.currency}
          color='red'
          title={this.props.selectedCurrency} 
          onPress={() => {
            this.setState({
              isVisible: true,
            });
          }}
        >
          {this.props.selectedCurrency}
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    marginTop: 22,
    flex: 1,
  },
  heading: {
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  row: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  separator: {
    backgroundColor: '#d5d6d9',
    height: 1 / PixelRatio.get(),
  },
  close: {
    alignSelf: 'flex-end',
  },
  container: {
    alignItems: 'flex-start',
    paddingLeft: 3,
  },
})

export default CurrencyPicker;
