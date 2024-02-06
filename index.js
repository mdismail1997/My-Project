/**
 * @format
 */

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {AppRegistry, LogBox, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';

ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreAllLogs();
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the index.js background!', remoteMessage);
});
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
