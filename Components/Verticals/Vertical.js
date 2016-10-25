'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const Login = require('../login/Login')
const AppContainer = require('../AppContainer/AppContainer')

var Vertical = React.createClass({
  render: function() {
    if (this.state.isLoggedIn) {
      return (
        <AppContainer vertical={this.props.vertical} user={this.state.user}></AppContainer>
      );
    } else {
      return (
        <Login vertical={this.props.vertical} onLogin={(user)=>this.onLogin(user)}></Login>
      );
    }
  },

  onLogin: function(user: string) {
    this.setState({isLoggedIn: true});
    this.setState({user: user});
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