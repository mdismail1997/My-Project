import { useEffect } from 'react';
import firebase, { ReactNativeFirebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { sendLocalNotification } from './../notifee';
import { EQUIPRO_FCM_TOKEN, Topic } from '../../utils/constants';
import { getDataFromStorage, setDataIntoStorage } from '../../storage';

const androidCredentials: ReactNativeFirebase.FirebaseAppOptions = {
  projectId: 'equipro-coach',
  messagingSenderId: '260773907378',
  appId: '1:260773907378:android:5c3dd3453098ab794fb2ab',
  apiKey: 'AIzaSyDKfHGzMdTdVtYZ7aGISfrznp1IFtbo8HU',
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials: ReactNativeFirebase.FirebaseAppOptions = {
  messagingSenderId: '260773907378',
  appId: '1:260773907378:ios:28c1d78cd576f5eb4fb2ab',
  projectId: 'equipro-coach',
  apiKey: 'AIzaSyCxYtfVzNJSVddhvKJpq2GzP-2mVS5qck4',
  clientId:
    '260773907378-n24ohsdnq5qqko42iiuadpr9elugkr5h.apps.googleusercontent.com',
};

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    await setDataIntoStorage(EQUIPRO_FCM_TOKEN, fcmToken);
    console.log('Your Firebase Token is:', fcmToken);
  } else {
    console.warn('Failed', 'No token received');
  }
};

const requestPermission = async () => {
  try {
    const status = await messaging().requestPermission();
    console.log('Notification permission status', status);
    const fcmToken = await getDataFromStorage(EQUIPRO_FCM_TOKEN);
    // User has authorised
    if (
      status === firebase.messaging.AuthorizationStatus.AUTHORIZED &&
      !fcmToken
    ) {
      await getFcmToken();
    }
  } catch (error) {
    // User has rejected permissions
    console.log(error);
  }
};

const checkPermission = async () => {
  const authStatus = await messaging().hasPermission();
  console.log(`=====Notification permission status: ${authStatus}=====`);
  const fcmToken = await getDataFromStorage(EQUIPRO_FCM_TOKEN);
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
  console.log('============Initialize firebase==========');
  // Select the relevant credentials
  const credentials = Platform.select({
    android: androidCredentials,
    ios: iosCredentials,
  });

  if (!firebase.apps.length && credentials) {
    await firebase.initializeApp(credentials);
  }
  await checkPermission();
};

const subscribeTopic = async (topic: string) => {
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
      await initFirebase();
      await messageListener();
      await subscribeTopic(Topic);
    };
    initNotification();
  }, []);
};
