import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  PixelRatio,
} from 'react-native';

class History extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.data),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.length) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(nextProps.data),
      });
    }
  }

  renderRow = (data) => {
    return (
      <TouchableHighlight
        underlayColor='#eee'
        onPress={() => this.props.onSelect(data)}
      >
        <View style={styles.row}>
          <Text style={styles.converted}>{`${data.amount} ${data.from} - ${data.converted} ${data.to}`}</Text>
          <Text style={styles.date}>{`Saved on ${data.date}`}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.props.data && this.props.data.length) {
      return (
        <View style={styles.container}>
          <ListView
            renderHeader={() => <Text style={styles.title}>Saved Results</Text>}
            dataSource={this.state.dataSource}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            renderSeparator={() => <View style={styles.separator}/>}
            renderRow={this.renderRow}
          />
        </View> 
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    paddingBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#179ccc',
  },
  converted: {
    fontSize: 15,
    marginTop: 5,
    color: 'black',
  },
  separator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#d5d6d9',
  }
});

export default History;