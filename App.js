import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Linking, Platform, Text} from 'react-native';
import Toast from 'react-native-toast-message';
import splashScreen from './src/screens/auth/splashScreen';
import signIn from './src/screens/auth/signIn';
import otp from './src/screens/resetPassword/otp';
import mainNavigation from './src/navigation/mainNavigation';
import forgetPassowrd from './src/screens/resetPassword/forgetPassowrd';
import setPassword from './src/screens/resetPassword/setPassword';
import signUp from './src/screens/auth/signUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userVerification from './src/screens/auth/userVerification';
import {NotificationProvider} from './src/screens/account/NotificationContext';
import changePassword from './src/screens/account/changePassword';
import resetPassword from './src/screens/account/resetPassword';
import tollScreenUpdate from './src/screens/account/tollScreenUpdate';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './src/firebase/PushController';
import {fcmService} from './src/firebase/FcmService';
import AccountDetails from './src/screens/account/accountDetails';
import Hud from './src/utils/hud';
import {navigationRef, navigate} from './src/firebase/notificationNavigate';
import Account from './src/screens/account/account';
import {linking} from './src/navigation/linkingConfig';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {NativeBaseProvider} from 'native-base';
import Notification from './src/screens/account/notification';

const Stack = createNativeStackNavigator();

const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

function App() {
  // const [status, setStatus] = useState('N');
  // const [nextstatus, setNextStatus] = useState('NN');
  // const [nextbook, setNextbook] = useState('wait');
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ReactNativeForegroundService.remove_all_tasks();
    ConfigureFirebase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' || initialUrl === null) {
          const savedState = await AsyncStorage?.getItem(
            NAVIGATION_PERSISTENCE_KEY,
          );

          const state = savedState ? JSON.parse(savedState) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  const ConfigureFirebase = async () => {
    // console.log(firebase.apps.length, 'firebase')
    const androidCredentials = {
      apiKey: 'AIzaSyDPhIcPn0oQ1YWEnjujykNAzZUMY9zzmkg',
      authDomain: 'kabou-driver.firebaseapp.com',
      projectId: 'kabou-driver',
      storageBucket: 'kabou-driver.appspot.com',
      messagingSenderId: '654075399835',
      appId: '1:654075399835:android:e8adc410be26cbec07803e',
      measurementId: 'G-SSVCFN7K9X',
    };

    // Your secondary Firebase project credentials for iOS...
    const iosCredentials = {
      clientId:
        '654075399835-f64v05tjd30b5qs5mlbkehlj2k9iutnf.apps.googleusercontent.com',
      appId: '1:654075399835:ios:0d2320db969ab95807803e',
      apiKey: 'AIzaSyACAVwCLtXt4-uX4GhSDqsvE1ViVceHov4',
      databaseURL: 'https://kabou-rider-default-rtdb.firebaseio.com',
      storageBucket: 'kabou-driver.appspot.com',
      messagingSenderId: '654075399835',
      projectId: 'kabou-driver',
    };



    // Select the relevant credentials
    const credentials = Platform.select({
      android: androidCredentials,
      ios: iosCredentials,
    });

    if (!firebase.apps.length) {
      await firebase.initializeApp(credentials);
    }

    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('App onRegister', token);
    }

    function onNotification(notify) {
      console.log('App onNotification', notify.title);

      // if (notify.title === 'Ride Canceled') {
      //   // Alert.alert('Ride request generated',
      //   setNextStatus('YY');

      //   // {text: 'Yes', onPress: () => navigation.navigate('getRide')},

      //   //clicking out side of alert will not cancel
      // } else {
      //   // navigation.navigate('homeScreen');

      //   setStatus('Y');
      //   setNextbook('wait');
      // }
      // setStatus('Y');
      //console.log("+++++++");
      // showMessage({
      //   message: remoteMessage.notification.title,
      //   description: remoteMessage.notification.body,
      //   type: 'default',
      //   backgroundColor: '#000',
      //   //onPress: navigation.navigate('getRide'),
      //   duration: 2000,
      // });
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {
      console.log('App on open notification', notify.title);
      if (notify.userInteraction) {
        navigate('getRide');
      }
    }

    //isReadyRef.current = false;
    requestUserPermission();
  };
  const requestUserPermission = async () => {
    //if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);

      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.warn('have tok=====', fcmToken);
            AsyncStorage.setItem('fcmToken', fcmToken);
          } else {
            console.warn('have tok=====', 'Not registered');
          }
        })
        .catch(error => {
          console.warn('have tok=====', 'Error occured');
        });
    }
    //}
  };
  // const updateNotificationStatus = value => {
  //   console.log('+++++++++value', value);

  //   setStatus(value);
  // };
  // const updateNotificationStatuscancel = valuecancel => {
  //   console.log('+++++++++value', valuecancel);

  //   setNextStatus(valuecancel);
  // };
  // const updateNotificationStatusnext = valuenext => {
  //   console.log('+++++++++value', valuenext);

  //   setNextbook(valuenext);
  // };

  if (!isReady) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <NotificationProvider
        value={
          {
            // usernotificationstatus: status,
            // //usernotificationstatus: nextstatus,
            // updateNotificationStatus: updateNotificationStatus,
            // usernotificationstatuscancel: nextstatus,
            // updateNotificationStatuscancel: updateNotificationStatuscancel,
            // usernotificationstatusnext: nextbook,
            // updateNotificationStatusnext: updateNotificationStatusnext,
          }
        }>
        <NavigationContainer
          initialState={initialState}
          onStateChange={state =>
            AsyncStorage?.setItem(
              NAVIGATION_PERSISTENCE_KEY,
              JSON.stringify(state),
            )
          }
          linking={linking}
          ref={navigationRef}
          fallback={<Text>Loading…</Text>}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="splashScreen" component={splashScreen} />
            <Stack.Screen name="signIn" component={signIn} />
            <Stack.Screen name="forgetPassword" component={forgetPassowrd} />
            <Stack.Screen name="otp" component={otp} />
            <Stack.Screen name="setPassword" component={setPassword} />
            <Stack.Screen name="signUp" component={signUp} />
            <Stack.Screen
              name="userVerification"
              component={userVerification}
            />
            <Stack.Screen name="notifications" component={Notification} />
            <Stack.Screen name="mainNavigation" component={mainNavigation} />
            <Stack.Screen name="account" component={Account} />
            <Stack.Screen name="accountDetails" component={AccountDetails} />
            <Stack.Screen name="changePassword" component={changePassword} />
            <Stack.Screen name="resetPassword" component={resetPassword} />
            <Stack.Screen
              name="tollScreenUpdate"
              component={tollScreenUpdate}
            />
          </Stack.Navigator>
          <Toast />
          <Hud ref={rid => Hud.setHud(rid)} />
          {/* <FlashMessage
          position="top"
          autoHide={false}
          // onPress={() => {
          //   notificationNavigate.navigate('getRide');
          // }}
        /> */}
        </NavigationContainer>
      </NotificationProvider>
    </NativeBaseProvider>
  );
}

export default App;
