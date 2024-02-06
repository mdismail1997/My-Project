import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import mainNavigation from './src/navigation/mainNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeBaseProvider} from 'native-base';

//React native push notification imports
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './src/firebase/PushController';
import {fcmService} from './src/firebase/FcmService';
import Hud from './src/utils/hud';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {navigate, navigationRef} from './src/firebase/notificationNavigate';
import {linking} from './src/navigation/linkingConfig';

const Stack = createNativeStackNavigator();

const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

function App({navigation}) {
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ConfigureFirebase();
  }, [ConfigureFirebase]);

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

  const ConfigureFirebase = useCallback(async () => {
    // console.log(firebase.apps.length, 'firebase')
    const androidCredentials = {
      apiKey: 'AIzaSyBxJSeUNRX1xe6aU9uNWXdF0r8AWQplunI',
      authDomain: 'kabou-rider.firebaseapp.com',
      projectId: 'kabou-rider',
      storageBucket: 'kabou-rider.appspot.com',
      messagingSenderId: '214755125299',
      appId: '1:214755125299:android:6e23e310140a120c11db46',
      measurementId: 'G-SSVCFN7K9X',
    };

    // Your secondary Firebase project credentials for iOS...
    const iosCredentials = {
      clientId:
        '214755125299-h46im95dbgv4o72av6evjohro1makdkq.apps.googleusercontent.com',
      appId: '1:214755125299:web:49e3117cd1d8654411db46',
      apiKey: 'AIzaSyBpNhZt5398r8e7Q5MkPWtHnMfogqV65UI',
      databaseURL: 'https://kabou-rider-default-rtdb.firebaseio.com',
      storageBucket: 'kabou-rider.appspot.com',
      messagingSenderId: '214755125299',
      projectId: 'kabou-rider',
    };

    // Select the relevant credentials
    const credentials = Platform.select({
      android: androidCredentials,
      ios: iosCredentials,
    });

    if (!firebase.apps.length) {
      firebase.initializeApp(credentials);
    }

    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('App onRegister', token);
      AsyncStorage.setItem('fcmToken', token);
    }

    function onNotification(notify) {
      console.log('App onNotification', notify);

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
      console.log('App on open notification', notify);
      if (notify.userInteraction) {
        navigate('waitingScreen', {fromNotification: true});
      }
      //alert('Open Notification'+notify.body )
    }
    // function onOpenNotification(notify) {
    //   console.log('App on open notification', notify);
    //   if (notify.userInteraction) {
    //     navigate('BookingStep2', {fromNotification: true});
    //   }
    //   //alert('Open Notification'+notify.body )
    // }

    //isReadyRef.current = false;
    requestUserPermission();
  }, []);

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

  if (!isReady) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <StatusBar
        backgroundColor={Platform.select({
          ios: 'white',
          android: Platform.Version >= 23 ? 'black' : 'white',
        })}
        barStyle={Platform.select({
          ios: 'dark-content',
          android: Platform.Version >= 23 ? 'light-content' : 'dark-content',
        })}
      />
      <SafeAreaProvider>
        <NavigationContainer
          initialState={initialState}
          onStateChange={state =>
            AsyncStorage?.setItem(
              NAVIGATION_PERSISTENCE_KEY,
              JSON.stringify(state),
            )
          }
          linking={linking}
          ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="mainNavigation" component={mainNavigation} />
          </Stack.Navigator>
          <Hud ref={rid => Hud.setHud(rid)} />
        </NavigationContainer>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}

export default App;
