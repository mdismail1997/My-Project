import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Splash extends Component {
  componentDidMount = async () => {
    const { navigation } = this.props;
    const AccessToken = await AsyncStorage.getItem('traderToken');
    const language = await AsyncStorage.getItem('language')

    console.warn('fv', language);
    if (AccessToken == null) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'beforelogin' }],
        });
      }, 3000);
    } else {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'drawer' }],
        });
        // navigation.push('drawer');
      }, 3000);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../Assets/logo.png')}
          style={{ height: 200, width: 200, resizeMode: 'contain' }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A5A5F',
  },
});
