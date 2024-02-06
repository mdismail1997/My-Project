/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import { setBackgroundNotificationHandler } from './src/notification/firebase';

setBackgroundNotificationHandler();

AppRegistry.registerComponent(appName, () => App);
