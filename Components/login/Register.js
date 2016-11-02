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

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showProgress: false,
      username: '',
      phone: '',
      password: '',
      passwordConfirmation: ''
    }
  }

  render() {
    var errorCtrl = <View />;

    if (!this.state.success && this.state.unknownError){
      errorCtrl = <Text style={styles.error}>
        Unexpected error
       </Text>; 
    }

    return(
      <View style={styles.container}>

        <Text style={styles.heading}>Username</Text>
        <TextInput style={[styles.input,{borderColor: this.props.vertical.color}]}
          onChangeText = {(text) => this.setState({username: text})}
          placeholder = "Mario" />

        <Text style={styles.heading}>Phone number</Text>
        <TextInput style={[styles.input,{borderColor: this.props.vertical.color}]}
          onChangeText = {(text) => this.setState({phone: text})}
          placeholder = "123456789" />

        <Text style={styles.heading}>Password</Text>
        <TextInput style={[styles.input,{borderColor: this.props.vertical.color}]}
          onChangeText = {(text) => this.setState({password: text})}
          placeholder = "Password" 
          secureTextEntry = {true} />

        <Text style={styles.heading}>Confirm password</Text>
        <TextInput style={[styles.input,{borderColor: this.props.vertical.color}]}
          onChangeText = {(text) => this.setState({passwordConfirmation: text})}
          placeholder = "Password" 
          secureTextEntry = {true} />

        <TouchableHighlight style={[styles.button, {backgroundColor: this.props.vertical.color}]}
          onPress = {this.onRegisterPress.bind(this)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>

        {errorCtrl}

        <TouchableHighlight style={styles.loginButton}
          onPress = {this.props.onLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableHighlight>

        <ActivityIndicator
          animating = {this.state.showProgress}
          size = "large"
          state = {styles.loader} />
      </View>
    );
  }

    onRegisterPress(){
    if (this.state.username == '' || this.state.phone == '' || this.state.password == '' || this.state.passwordConfirmation == '') {
      errorCtrl = <Text style={styles.error}>
        Please fill all the fields
       </Text>; 
    } else if (this.state.passwordConfirmation != this.state.password){
       errorCtrl = <Text style={styles.error}>
        Passwords don't match
       </Text>; 
    } else {
    this.setState({showProgress: true});
    console.log('Attempting to register username: ' + this.state.username + ' and password: ' + this.state.password);

    var authService = require('./AuthService');
    authService.register({
      username: this.state.username,
      phone: this.state.phone,
      password: this.state.password
    }, (results) => {
      this.setState(Object.assign({
          showProgress: false
      }, results));

      if (results.success && this.props.onRegister){
        this.props.onRegister();
      }
    });
  }
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
  loginButton: {
     height: 40,
     backgroundColor: '#48bbec',
     width: 130,
     marginTop: 30,
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

module.exports = Register;
