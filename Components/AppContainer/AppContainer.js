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
      region: {
              latitude: -34.917678,
              longitude: -56.166401,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            },

      onService : false,

      trueSwitchIsOn: true,
      falseSwitchIsOn: false,

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

    } else {

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
