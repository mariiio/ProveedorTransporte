'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const Login = require('./Components/login/Login')
const AppContainer = require('./Components/AppContainer/AppContainer')

var TSI2 = React.createClass({
  render: function() {
    if (this.state.isLoggedIn) {
      return (
        <AppContainer></AppContainer>
      );
    } else {
      return (
        <Login onLogin={this.onLogin}></Login>
      );
    }
  },

  onLogin: function() {
    this.setState({isLoggedIn: true});
  },

  getInitialState : function() {
    return {
      isLoggedIn: false   
    }
  }
});

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  welcome:{
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('ProveedorTransporte', () => TSI2);