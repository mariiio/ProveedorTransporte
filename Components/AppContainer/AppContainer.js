import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Modal,
  Linking
} from 'react-native';
import MapView from 'react-native-maps';
import StarRating from 'react-native-star-rating';
const History = require('./History')

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

      client: {lat: null,
                lng: null,
                username: null,
                address: null},

      modalVisible: false,
      
      modalReviewVisible: false,

      History: false,

      starCount: 3,

      withClient: 0, // 0: nada, 1: por iniciar, 2: en servicio

      onService : false,

      markers: []
    }
  }

  watchID: ?number = null;

  pos = [0,0];

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
          this.pos[0] = position.coords.latitude;
          this.pos[1] = position.coords.longitude; 
      }, (error) => {
          alert('Asegurate que tu GPS está habilitado');
      }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    if (!this.state.History) {
      return (
        <View style = {styles.container}>

          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
            >
           <View style={styles.modal}>
            <View>
              <Text style={styles.textModal}>El usuario {this.state.client.username} se encuentra en {this.state.client.address} y ha solicitado tu servicio</Text>

              <TouchableHighlight style={[styles.button,{backgroundColor: 'green'}]} onPress={() => {
                this.setState({modalVisible: false});
                this.setState({withClient: 1});
                var obj = '{'
                          + '"command" : "ProveedorAcceptMatch"'
                          +'}';
                this.state.ws.send(obj);
              }}>
                <Text style={styles.buttonText} >Aceptar</Text>
              </TouchableHighlight>

              <TouchableHighlight style={[styles.button,{backgroundColor: 'red'}]} onPress={() => {
                this.setState({modalVisible: false});
                this.setState({withClient: 0});
                var obj = '{'
                          + '"command" : "ProveedorDeclineMatch"'
                          +'}';
                this.state.ws.send(obj);
              }}>
                <Text style={styles.buttonText} >Cancelar</Text>
              </TouchableHighlight>

            </View>
           </View>
          </Modal>

          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalReviewVisible}
            onRequestClose={() => {}}
            >
           <View style={styles.modal}>
            <View>
              <Text style={styles.textModal}>Califica tu experiencia con {this.state.client.username}</Text>
              <StarRating 
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
              <TouchableHighlight style={[styles.button,{backgroundColor: 'black'}]} onPress={() => {
                this.setState({modalReviewVisible: false});
                this.setState({withClient: 0});
                var obj = '{'
                      +'"command" : "FinalizarServicio",'
                      +'"rating" : '+this.state.starCount
                     +'}';
                this.state.ws.send(obj);
                }}>
                <Text style={styles.buttonText} >Enviar</Text>
              </TouchableHighlight>

            </View>
           </View>
          </Modal>

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
          <TouchableHighlight style={styles.Button}
              onPress = {this.goToPaypal.bind(this)}>
              <Text style={styles.buttonText}>PayPal</Text>
            </TouchableHighlight> 
          <TouchableHighlight style={styles.Button}
              onPress = {this.showHistory.bind(this)}>
              <Text style={styles.buttonText}>Historial</Text>
            </TouchableHighlight> 
          {(this.state.withClient != 0
          ? <TouchableHighlight style={[styles.roundButton, {backgroundColor: this.state.withClient == 1 ? 'green' : 'red'}]}
              onPress = {this.startService.bind(this)}>
              {this.state.withClient == 1 ? <Text style={styles.buttonText}>Inicio</Text> : <Text style={styles.buttonText}>Fin</Text>}
            </TouchableHighlight>
          : <TouchableHighlight style={[styles.button, {backgroundColor: this.props.vertical.color}]}
              onPress = {this.onPress.bind(this)}>
              {this.state.onService ? <Text style={styles.buttonText}>Terminar</Text> : <Text style={styles.buttonText}>Comenzar</Text>}
            </TouchableHighlight>
          )}

        </View>
      );
    } else {
      return(
          <History vertical={this.props.vertical} user={this.props.user} onBack={()=>this.onBack()}></History>     
        );
    }
  }

  onBack() {
    this.setState({History: false})
  }

  showHistory() {
    this.setState({History: true});
  }

  goToPaypal() {
    Linking.openURL('https://www.sandbox.paypal.com/webscr?cmd=_account&nav=0').catch(err => console.error('An error occurred', err));
  }

  startService() {
    if (this.state.withClient == 1) {
      var obj = '{'
                +'"command" : "ComenzarServicio",'
                +'"lat" : '+this.pos[0]+' ,'
                +'"lng" : '+this.pos[1]
               +'}';
      this.state.ws.send(obj);
    } else {
      this.setState({modalReviewVisible: true});
    }
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
          var ws = new WebSocket('ws://yubertransport.mybluemix.net/WebSocketServer/servicio/' + this.props.vertical.nombre);
          ws.onmessage = ((msg) => {
            mensaje = JSON.parse(String(msg.data));
              if (mensaje.respuesta.command == 'Ok') {
                alert('Te encuentras disponible para los clientes.');
              } else if (mensaje.respuesta.command == 'Error') {
                alert('Demasiado tarde, que lástima!');
              } else if (mensaje.respuesta.command == 'SolicitudMatch') {
                this.setState({client: { lat: mensaje.respuesta.lat,
                                         lng: mensaje.respuesta.lng,
                                         username: mensaje.respuesta.username,
                                         address: mensaje.respuesta.address}});
                this.setState({modalVisible: true});
                this.setState({markers: [{
                    latlng: {latitude: this.state.client.lat,
                    longitude: this.state.client.lng},
                    title: this.state.client.username,
                    description: this.state.client.address
                  }]})
              } else if (mensaje.respuesta.command == 'OkComenzar') {
                  this.setState({
                      region: {
                      latitude: this.pos[0],
                      longitude: this.pos[1],
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01
                    }
                  });
                  this.setState({withClient: 2}); 
              } else if (mensaje.respuesta.command == 'ErrorComenzar') {
                alert('Acercate al cliente para iniciar el servicio');
              }
          });

          ws.onopen = () => {
            var obj = '{'
                +'"command" : "ProveedorDisponible",'
                +'"userName" : "'+this.props.user.username+'" ,'
                // +'"Telefono" : '+this.props.user.phone+' ,'
                +'"lat" : '+this.state.region.latitude+' ,'
                +'"lng" : '+this.state.region.longitude
               +'}';
            ws.send(obj);
          };

          ws.onerror = () => {
            this.setState({withClient: 0});
            this.setState({onService: false});
            alert('Error WebSocket');
          }

          this.setState({ws: ws});

          this.watchID = navigator.geolocation.watchPosition((position) => {
          this.pos[0] = position.coords.latitude;
          this.pos[1] = position.coords.longitude;
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
                +'"lat" : '+position.coords.latitude+' ,'
                +'"lng" : '+position.coords.longitude
               +'}';
            if (ws.readyState == 1 && this.state.client){
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
  roundButton: {
     height: 100,
     backgroundColor: 'green',
     width: 100,
     margin: 20,
     justifyContent: 'center',
     borderRadius: 64
  },
  buttonText: {
     fontSize: 22,
     color: '#fff',
     alignSelf: 'center'
  },
  modal:{
    margin: 50,
    marginTop: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20
  },
  textModal: {
     fontSize: 18,
     color: 'black',
     textAlign: 'center',
     marginBottom: 10
   }

});

module.exports = AppContainer;
