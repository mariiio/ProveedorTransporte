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
      markers: [{
        latlng: {latitude: -34.917678,
              longitude: -56.166401},
            title: 'title',
            description: 'description'
      },
      { 
      latlng: {latitude: -34.917900,
              longitude: -56.166900},
            title: 'title',
            description: 'description'
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
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
        />
  ))}
         </MapView>
      </View>
    );
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
  }
});

module.exports = AppContainer;
