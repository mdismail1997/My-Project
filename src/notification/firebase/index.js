import { useEffect } from 'react';
import firebase, { ReactNativeFirebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { sendLocalNotification } from '../notifee';
import { DOCTOR_APP_FCM_TOKEN, Topic } from '../../constants/appConstant';
import { getDataFromStorage, setDataIntoStorage } from '../../storage';

const androidCredentials = {
  projectId: 'doctorapp-91d0c',
  messagingSenderId: '1085925652580',
  appId: '1:1085925652580:android:ff895bbb9779d117db4771',
  apiKey: 'AIzaSyDbgUCtIiUtx15Rtop7x71Y3MMR1-sZJ9M',
  storageBucket: 'doctorapp-91d0c.appspot.com',
  databaseURL: '',
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  projectId: 'doctorapp-91d0c',
  messagingSenderId: '1085925652580',
  appId: '1:1085925652580:ios:28c1d78cd576f5eb4fb2ab',
  apiKey: 'AIzaSyDbgUCtIiUtx15Rtop7x71Y3MMR1-sZJ9M',
  clientId:
    '1085925652580-fi99qhf7ao9v6jcoj0c6tm4b89rfm8ao.apps.googleusercontent.com',
};

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    await setDataIntoStorage(DOCTOR_APP_FCM_TOKEN, fcmToken);
    console.log('Your Firebase Token is:', fcmToken);
  } else {
    console.warn('Failed', 'No token received');
  }
};

const requestPermission = async () => {
  try {
    const status = await messaging().requestPermission();
    console.log('Notification permission status', status);
    const fcmToken = await getDataFromStorage(DOCTOR_APP_FCM_TOKEN);
    // User has authorised
    if (
      status === firebase.messaging.AuthorizationStatus.AUTHORIZED &&
      !fcmToken
    ) {
      await getFcmToken();
    }
    console.log('Your Firebase Token is:', fcmToken);
  } catch (error) {
    // User has rejected permissions
    console.log(error);
  }
};

const checkPermission = async () => {
  const authStatus = await messaging().hasPermission();
  console.log(`=====Notification permission status: ${authStatus}=====`);
  const fcmToken = await getDataFromStorage(DOCTOR_APP_FCM_TOKEN);
  if (
    authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED &&
    !fcmToken
  ) {
    await getFcmToken();
  } else {
    await requestPermission();
  }
};

const initFirebase = async () => {
  let status = false;
  try {
    console.log('============Initialize firebase==========');
    // Select the relevant credentials
    const credentials = Platform.select({
      android: androidCredentials,
      ios: iosCredentials,
    });

    if (!firebase.apps.length && credentials) {
      await firebase.initializeApp(credentials);
    }
    // if (credentials) {
    //   await firebase.initializeApp(credentials);
    // }
    await checkPermission();
    status = true;
  } catch (error) {
    console.error(error);
  }
  return status;
};

const subscribeTopic = async (topic) => {
  try {
    await messaging().subscribeToTopic(topic);
    console.log('🥳 Topic subscribed 🥳');
  } catch (error) {
    console.log('Topic subscription failed');
  }
};

const messageListener = async () => {
  console.log('============Message listener event started==========');
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.warn('A new FCM message arrived!', JSON.stringify(remoteMessage));
    await sendLocalNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
    });
  });

  const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
    (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
    }
  );

  // Check whether an initial notification is available
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log(
      'Notification caused app to open from quit state:',
      remoteMessage.notification
    );
  }

  return { unsubscribe, onNotificationOpenedApp };
};

export const setBackgroundNotificationHandler = async () =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

export const useCloudNotification = () => {
  useEffect(() => {
    const initNotification = async () => {
      const status = await initFirebase();
      if (status) {
        await messageListener();
        await subscribeTopic(Topic);
      }
    };
    initNotification();
  }, []);
};
