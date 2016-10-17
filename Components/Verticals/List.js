'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Image
} = ReactNative;

class List extends React.Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['Limosina', 'Caballo','Lancha']),
    };
  }

  render() {
    return (
      <View style={styles.container}>
      <Image style={styles.Image} source={require('../../Images/yuber.png')} />
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
      </View>
    );
  }

  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    return (
      <TouchableHighlight onPress={() => {
          highlightRow(sectionID, rowID);
          //REDIRECT
        }}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {rowData}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  
}
  var styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  Image:{
    alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
    fontSize: 30,
  },
});


module.exports = List;