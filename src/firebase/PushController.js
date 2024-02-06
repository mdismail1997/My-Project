import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {Platform,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate, removeAllAndReplace} from '../firebase/notificationNavigate';
import bookingStep2 from '../screens/afterLogin/bookingStep2'
import { useNavigation } from '@react-navigation/native';

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN: ', token);
        AsyncStorage.setItem('fcm_token', token.token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION: ', notification);
        //navigate('getRide');
        if (notification.data.title === 'Ride booked successfully') {
          console.log(
            '++++++++++++++++++++++11111111',
            notification.userInteraction,
          );
          removeAllAndReplace('waitingScreen', {fromNotification: true});
        }
        if (notification.data.title === 'Ride Canceled') {
          console.log('++++++++++++++++++++++2222222222',notification.userInteraction);
          
          Alert.alert(
           "Sorry",
           notification.data.body,
            [{ text: "OK", onPress: () =>{ 
             removeAllAndReplace('bookingStep2')
          
            }}]
          
           
        );
        // removeAllAndReplace('BookingStep2');
         
        }

       
        // console.log('++++++++++++++++++++++', notification.userInteraction);

        if (notification?.data) {
          console.log(' noti22222222222', notification.data);
          return;
        }
        //notification.userInteraction = true;

        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data,
        );

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      onAction: function (notification) {
        //console.log("ACTION:", notification.action);
        console.log('NOTIFICATION onActioooooooooooooN:', notification);

        // process the action
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,

      requestPermissions: true,
    });
    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'Channel', // (required)
      },
      created => console.log(`createChannel returned '${created}`),
    );
  };
  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /* Android only properties*/
      ...this.buildAndroidNotification(id, title, message, data, options),
      /* iOS and Android properties */
      ...this.buildIOSNotification(id, title, message, data, options),
      /* iOS and Android properties*/
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false,
    });
    if (Platform.OS === 'ios' && title === 'Ride booked successfully') {
      removeAllAndReplace('waitingScreen', {fromNotification: true});
    }

   
  };
  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };
  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };
  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationById = notificationId => {
    console.log('local notification id', notificationId);
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };
}

export const localNotificationService = new LocalNotificationService();