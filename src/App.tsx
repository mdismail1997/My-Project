/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { store } from './redux/store';
import { Main } from './Main';
// import { CommonToast } from '../src/components/CommonToast';
import 'react-native-gesture-handler';
import { IntlProvider } from 'react-intl';
import { useCloudNotification } from './notification/firebase';
/* URL polyfill */
import 'react-native-url-polyfill/auto';
import { Alert, BackHandler, LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const App = () => {
  useCloudNotification();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Provider store={store}>
      <IntlProvider locale="en">
        <Main />
      </IntlProvider>

      {/* <CommonToast ref={(rid) => CommonToast.setToast(rid)} /> */}
    </Provider>
  );
};
