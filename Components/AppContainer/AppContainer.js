import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import MapView from 'react-native-maps';

class AppContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // region: {
      //         latitude: -34.917678,
      //         longitude: -56.166401,
      //         latitudeDelta: 0.01,
      //         longitudeDelta: 0.01
      //       }, <- FING
      ws : null,

      onService : false,

      markers: [{
        latlng: {latitude: -34.917678,
              longitude: -56.166401},
            title: 'Mario',
            description: 'Saul'
      },
      { 
      latlng: {latitude: -34.912900,
              longitude: -56.168900},
            title: 'TSI',
            description: '2'
      }
      ]
    }
  }

  componentWillMount() {
      this._setPosition();
  }

  _setPosition() {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords);
          this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
          });
      }, (error) => {
          alert(error)
      }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  render() {
    return (
      <View style = {styles.container}>

        <MapView style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          followUserLocation={true}
        >
        {this.state.markers.map(marker => (
          <MapView.Marker
            key={marker.latlng.latitude+marker.latlng.longitude}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            //image={require('../../Images/pin.png')}
          />
        ))}
        </MapView>

        <TouchableHighlight style={[styles.button, {backgroundColor: this.props.vertical.color}]}
          onPress = {this.onPress.bind(this)}>
          {this.state.onService ? <Text style={styles.buttonText}>Terminar</Text> : <Text style={styles.buttonText}>Comenzar</Text>}
        </TouchableHighlight>

      </View>
    );
  }

  onPress(){
    this.setState({onService : !this.state.onService})
    if (this.state.onService) {
      if (this.state.ws) {
        this.state.ws.close();
      }
    } else {
      var ws = new WebSocket('ws://yubertransport.mybluemix.net/WebSocketServer/servicio');
      // var obj = '{'
      //      +'"command" : "ClienteNuevo",'
      //      +'"userName"  : "mario",'
      //      +'"lat" : '+this.state.region.latitude+' ,'
      //      +'"lng" : '+this.state.region.longitude
      //     +'}';
      // ws.send(obj)
      ws.onmessage = ((msg) => {this.setState({output: this.state.output + msg.data})});
      this.setState({ws: ws});
    }
  }

}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
     height: 50,
     // backgroundColor: '#48bbec',
     width: 200,
     margin: 20,
     justifyContent: 'center'
  },
  buttonText: {
     fontSize: 22,
     color: '#fff',
     alignSelf: 'center'
  }
});

module.exports = AppContainer;
