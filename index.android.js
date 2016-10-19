'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  View
} from 'react-native';

const VerticalsList = require('./Components/Verticals/List')

var TSI2 = React.createClass({
  render: function() {
      return (
        <VerticalsList></VerticalsList>
    )}
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