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

const Vertical = require('./Vertical');

var verticales = [];

class List extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
       dataSource: ds,
     loaded: false
      };
  }

   componentDidMount() {
    this.getVerticals();
  }

    getVerticals() {
    fetch('http://yubertransport.mybluemix.net/YuberServices/rest/user/verticales')
      .then((response) => response.json())
      .then((responseData) => {
        verticales = responseData.verticales;
        var nombres = [];
        for (var i = 0; i < verticales.length; i++) {
          nombres[i] = verticales[i].nombre;
        }
        console.log(responseData.verticales);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nombres),
            loaded: true,
          });
      })
      .done();
  }

  goToVertical(id:number){
    this.setState({vertical : id});
  }

  render() {
    if (this.state.vertical){
      return <Vertical vertical={verticales[this.state.vertical]}></Vertical>
    }else{
      return (
        <View style={styles.container}>
        <Image style={styles.Image} source={require('../../Images/yuber.png')} />
        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
        </View>
      );
    }
  }

  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    return (
      <TouchableHighlight onPress={() => {
          highlightRow(sectionID, rowID);
          this.goToVertical(rowID);
        }}>
        <View>
          <View style={styles.row}>
            <Image style={styles.imageRow} source={{uri: verticales[rowID].urlLogo}} />
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
  imageRow:{
    width:40,
    height:40,
    padding: 10
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
    padding: 5
  },
});

module.exports = List;
