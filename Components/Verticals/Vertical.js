'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const Login = require('../login/Login')
const Register = require('../login/Register')
const AppContainer = require('../AppContainer/AppContainer')

var Vertical = React.createClass({
  render: function() {
    if (this.state.isLoggedIn) {
      return (
        <AppContainer vertical={this.props.vertical} user={this.state.user}></AppContainer>
      );
    } else if (this.state.register) {
      return(
        <Register vertical={this.props.vertical} onRegister={()=>this.onRegister()} onLogin={()=>this.onRegister()}></Register>
      )
    } else {
      return (
        <Login vertical={this.props.vertical} onRegister={()=>this.onRegister()} onLogin={(user)=>this.onLogin(user)}></Login>
      );
    }
  },

  onLogin: function(user: string) {
    this.setState({isLoggedIn: true});
    this.setState({user: user});
  },


  onRegister: function() {
    this.setState({register: !this.state.register});
  },

  getInitialState : function() {
    return {
      isLoggedIn: false,
      register: false 
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