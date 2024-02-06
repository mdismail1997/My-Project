/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Main } from './Main';
import { useCloudNotification } from './notification/firebase';

const App = () => {
  useCloudNotification();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
