'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
//import NavigationBar from 'react-native-navigation-bar';

const Login = require('../login/Login')
const AppContainer = require('../AppContainer/AppContainer')

var Vertical = React.createClass({
  render: function() {
    if (this.state.isLoggedIn) {
      return (
        <AppContainer></AppContainer>
      );
    } else {
      return (
        <Login onLogin={(id)=>this.onVerticalClick(id)}></Login>
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

module.exports = Vertical;