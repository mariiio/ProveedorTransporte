import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';
import NavigationBar from 'react-native-navbar';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showProgress: false
    }
  }

  render() {
    var errorCtrl = <View />;

    if (!this.state.success && this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
        That username and password didn't work
       </Text>; 
    }

    if (!this.state.success && this.state.unknownError){
      errorCtrl = <Text style={styles.error}>
        Unexpected error
       </Text>; 
    }

  var leftButtonConfig = {
    title: '< Verticales',
    handler: function onNext() {
      alert('GO BACK!');
    }
  };

    return(
      <View style={styles.container}>
      <NavigationBar style={{margin: 20}}
        rightButton={leftButtonConfig} />

        <Image style={styles.logo} source={{uri: this.props.vertical.urlLogo}}/>

        <Text style={styles.heading}>Username</Text>
        <TextInput style={[styles.input,{borderColor: this.props.vertical.color}]}
          onChangeText = {(text) => this.setState({username: text})}
          placeholder = "Mario" />

        <Text style={styles.heading}>Password</Text>
        <TextInput style={[styles.input,{borderColor: this.props.vertical.color}]}
          onChangeText = {(text) => this.setState({password: text})}
          placeholder = "Password" 
          secureTextEntry = {true} />

        <TouchableHighlight style={[styles.button, {backgroundColor: this.props.vertical.color}]}
          onPress = {this.onLogInPress.bind(this)}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableHighlight>

        {errorCtrl}

        <ActivityIndicator
          animating = {this.state.showProgress}
          size = "large"
          state = {styles.loader} />
      </View>
    );
  }

  onLogInPress(){
    this.setState({showProgress: true});
    console.log('Attempting to log in with username: ' + this.state.username + ' and password: ' + this.state.password);

    var authService = require('./AuthService');
    authService.login({
      username: this.state.username,
      password: this.state.password
    }, (results) => {
      this.setState(Object.assign({
          showProgress: false
      }, results));

      if (results.success && this.props.onLogin){
        this.props.onLogin();
      }
    });
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  heading: {
     fontSize: 21,
     marginTop: 10
  },
  button: {
     height: 50,
     // backgroundColor: '#48bbec',
     width: 100,
     marginTop: 20,
     justifyContent: 'center'
  },
  buttonText: {
     fontSize: 22,
     color: '#fff',
     alignSelf: 'center'
  },
  loader: {
     
  },
  logo: {
    width: 150,
    height: 150
  },
  input: {
     height: 50,
     width: 250,
     marginTop: 10,
     padding: 4,
     fontSize: 18,
     borderWidth: 1,
     //borderColor: '#48bbec'
  },
  error: {
    color: 'red'
  }
});

module.exports = Login;
