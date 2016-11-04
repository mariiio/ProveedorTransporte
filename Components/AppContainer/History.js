'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = ReactNative;
import StarRating from 'react-native-star-rating';
var history = [];

class History extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
       dataSource: ds,
     loaded: false
      };
  }

   componentDidMount() {
    this.getHistory();
  }

    getHistory() {
    fetch('http://yubertransport.mybluemix.net/YuberServices/rest/proveedor/' + this.props.user.username + '/servicios', {
      headers: {
        'verticalName': this.props.vertical.nombre
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        history = responseData.historial;
        var nombres = [];
        for (var i = 0; i < history.length; i++) {
          nombres[i] = history[i].cliente;
        }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nombres),
            loaded: true,
          });
      })
      .done();
  }

  // goToVertical(id:number){
  //   this.setState({vertical : id});
  // }

  render() {
    // if (this.state.vertical){
    //   return <Vertical vertical={verticales[this.state.vertical]}></Vertical>
    // }else{
      return (
        <View style={styles.container}>
        <Image style={styles.Image} source={require('../../Images/clock.png')} />
        <TouchableHighlight onPress={this._onPressButton.bind(this)}>
          <Image
            source={require('../../Images/back-button.png')}
          />
        </TouchableHighlight>
        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
        </View>
      );
    // }
  }

  _onPressButton(){
    this.props.onBack();
  }

  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    return (
      // <TouchableHighlight onPress={() => {
      //     highlightRow(sectionID, rowID);
      //     this.goToVertical(rowID);
      //   }}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {rowData} ({history[rowID].duration} min)
            </Text>
            <StarRating 
              disabled={true}
              maxStars={5}
              starColor={'red'}
              starSize={15}
              rating={history[rowID].reviewCliente}
              selectedStar={(rating) => {}}
            />
          </View>
        </View>
      // </TouchableHighlight>
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
    padding: 15,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
    fontSize: 18,
    padding: 5
  },
});

module.exports = History;
