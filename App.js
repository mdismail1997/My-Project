import React, {useEffect} from 'react';
import {Text, StyleSheet, View, StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Hud from './src/utils/hud';
import {store} from './src/reduxToolkit/Store';
import {NativeBaseProvider} from 'native-base';
import Navigation from './src/Navigation';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Hud ref={rid => Hud.setHud(rid)} />
        <StatusBar
          backgroundColor={Platform.select({
            ios: 'white',
            android: '#020c26',
          })}
          barStyle={Platform.select({
            ios: 'dark-content',
            android: 'light-content',
          })}
        />
        <Navigation />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
