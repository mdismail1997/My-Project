/**
 * @format
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './src/App';
import { name as appName } from './app.json';
import trackPlayerServiceHandler from './service';
import { setBackgroundNotificationHandler } from './src/notification/firebase';

setBackgroundNotificationHandler();

// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => trackPlayerServiceHandler);

AppRegistry.registerComponent(appName, () => App);
