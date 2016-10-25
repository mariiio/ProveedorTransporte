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

  watchID: ?number = null;

  componentWillMount() {
      this._setPosition();
  }

  _setPosition() {
      navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
          });
      }, (error) => {
          alert('Asegurate que tu GPS está habilitado');
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
    if (this.state.region) {

        this.setState({onService : !this.state.onService})

        if (this.state.onService) {
          if (this.state.ws) {
            this.state.ws.close();
            navigator.geolocation.clearWatch(this.watchID);
            alert('Ya no te encuentras disponible para los clientes.');
          }
        } else {
          var ws = new WebSocket('ws://yubertransport.mybluemix.net/WebSocketServer/servicio');
          ws.onmessage = ((msg) => {
            mensaje = JSON.parse(String(msg.data));
              if (mensaje.respuesta.command == 'Ok') {
                alert('Te encuentras disponible para los clientes.');
              } else if (mensaje.respuesta.command == 'SolicitudMatch') {
                this.setState({client: { lat: mensaje.respuesta.lat,
                                         lng: mensaje.respuesta.lng,
                                         name: mensaje.respuesta.userName,
                                         adress: mensaje.respuesta.adress}});

              }
          });

          ws.onopen = () => {
            var obj = '{'
                +'"command" : "ProveedorDisponible",'
                +'"userName"  : "mario",' //this.props.user
                +'"lat" : '+this.state.region.latitude+' ,'
                +'"lng" : '+this.state.region.longitude
               +'}';
            ws.send(obj);
            //alert('Te encuentras disponible para los clientes.'); // Borrar cuando devuelva json
          };

          ws.onerror = () => {
            alert('Error WebSocket');
          }

          this.setState({ws: ws});

          this.watchID = navigator.geolocation.watchPosition((position) => {
            console.log(position.coords);
          //   this.setState({
          //     region: {
          //       latitude: position.coords.latitude,
          //       longitude: position.coords.longitude,
          //       latitudeDelta: 0.01,
          //       longitudeDelta: 0.01
          //   }
          // });
            var obj = '{'
                +'"command" : "ProveedorPosicion",'
                //+'"userName"  : "mario",' //this.props.user
                //+'"client"  : this.state.client,'
                +'"lat" : '+position.coords.latitude+' ,'
                +'"lng" : '+position.coords.longitude
               +'}';
            if (ws.readyState == 1 && this.props.client){
              ws.send(obj);
            }
        });
      }  

    } else {
      alert('Asegurate que tu GPS está habilitado');
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
