/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';

import messaging from '@react-native-firebase/messaging';

import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

// Override Text scaling
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

// Override Text scaling in input fields
if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

// const Main = () => (
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

// AppRegistry.registerComponent(appName, () => Main);
