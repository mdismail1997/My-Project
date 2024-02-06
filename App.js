import {
  Text,
  View,
  SafeAreaView,
  AppState,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackNavigation from './App/Navigation/StackNavigation/StackNavigation';

import SoundPlayer from 'react-native-sound-player';

import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import Hud from './App/Screens/Common/Hud';
import {RFValue} from 'react-native-responsive-fontsize';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './App/Services/Notification/PushController';
import {fcmService} from './App/Services/Notification/FcmService';
import {NotificationProvider} from './App/Services/Notification/NotificationContext';
import {getApicall, postApiCall} from './App/Services/Network';

import NetworkError from './App/Services/NetworkError';
import {ProfileProvider} from './App/Services/ProfileProvider';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const {width, height} = Dimensions.get('window');

import {navigationRef, navigate} from './App/Services/NotifyNavigator';

const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [netStatus, setNet] = useState(true);
  const [unread, setUnread] = useState('N');

  const [notificationData, setNotificationData] = useState([]);
  const [calling, setCalling] = useState(false);
  const [callerName, setCallerName] = useState('');

  const handleDynamicLink = async link => {
    // Handle dynamic link inside your own application
    if (link != null) {
      console.log('====link========>', link);
      const AccessToken = await AsyncStorage.getItem('token');
      const User = await AsyncStorage.getItem('userType');
      if (AccessToken != null) {
        if (User == 1) {
          let emailData = link.url.split('?').pop();
          let data = emailData.split('=');
          console.log('emailData:', data);
          if (data[0] == 'celebrityEmail') {
            navigate('MyDrawer', {
              screen: 'BottomTabNavigation',
              params: {
                screen: 'CelebrityProfileData',
                params: {celebrityEmail: data[1]},
              },
            });
          } else if (data[0] == 'liveCelebrity') {
            navigate('MyDrawer', {
              screen: 'BottomTabNavigation',
              params: {
                screen: 'Live',
                params: {searchData: data[1]},
              },
            });
          }
        } else {
          navigate('MyDrawer', {
            screen: 'BottomTabNavigation',
            params: {
              screen: 'Home',
            },
          });
        }
      } else {
        navigate('Login');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLink(link);
      });
  }, []);

  useEffect(() => {
    ConfigureFirebase();
    //Checking live status of internet connection
    NetInfo.addEventListener(state => {
      //console.log('Netinfo status==>', state.isConnected);
      setNet(state.isConnected);
      //console.log('NetStatus===>', netStatus);
    });

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const ConfigureFirebase = async () => {
    const androidCredentials = {
      apiKey: 'AIzaSyAn-pL4EebKH1jwP0VLJ3aHHTJ1ySNao3w',
      authDomain: 'qspace-265bd.firebaseapp.com',
      projectId: 'qspace-265bd',
      databaseURL: 'https://qspace-265bd-default-rtdb.firebaseio.com',
      storageBucket: 'qspace-265bd.appspot.com',
      messagingSenderId: '498707436295',
      appId: '1:498707436295:android:181a191bdfa2a3219d6ba2',
      measurementId: '',
    };

    // Your secondary Firebase project credentials for iOS...
    const iosCredentials = {
      clientId:
        '498707436295-io4dnh8ftcgv4vp95u2lhlfqsrv779mv.apps.googleusercontent.com',
      appId: '1:498707436295:ios:abba63889288bb1b9d6ba2',
      apiKey: 'AIzaSyAQecTXNdgFDSN23hd5JhrUPiAbEJPEeOs',
      databaseURL: 'https://qspace-265bd-default-rtdb.firebaseio.com',
      storageBucket: 'qspace-265bd.appspot.com',
      messagingSenderId: '498707436295',
      projectId: 'qspace-265bd',
    };

    // Select the relevant credentials
    const credentials = Platform.select({
      android: androidCredentials,
      ios: iosCredentials,
    });

    if (!firebase.apps.length) {
      firebase.initializeApp(credentials);
      console.log(
        '==firebase.initializeApp(credentials)===>',
        firebase.initializeApp(credentials),
      );
    }

    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('App onRegister in app.js');
    }

    function onNotification(notify) {
      console.log('App onNotification====================>', notify);
      setUnread('Y');
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
      setUnread('Y');
      //alert('Open Notification'+notify.body )
    }

    requestUserPermission();

    // when the application is opened from a quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('Initial Notification caused to open');
        if (remoteMessage) {
        }
      });

    messaging().onMessage(async remoteMessage => {
      console.log('onMessage in App.js=====>', remoteMessage);
      if (remoteMessage) {
        if (remoteMessage.notification.title == 'Calling') {
          setCalling(true);
          console.log('Calling Data==>', remoteMessage.data);
          try {
            // play the file tone.mp3
            SoundPlayer.playSoundFile('android', 'mp3');
            // or play from url
            // SoundPlayer.playUrl('https://example.com/music.mp3')

            SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
              console.log('finished playing', success);
              SoundPlayer.stop();
            });
          } catch (e) {
            console.log(`cannot play the sound file`, e);
          }
          setNotificationData(remoteMessage.data);
          setCallerName(remoteMessage.data.username);
          setUnread('Y');
        }
      }
    });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log(
    //     'Message handled in the background! in App.js',
    //     remoteMessage,
    //   );
    // });
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.warn('have tok=====', fcmToken);
          } else {
            console.warn('have tok=====', 'Not registered');
          }
        })
        .catch(error => {
          console.warn('have tok=====Error occured===>', error);
        });
    }
  };

  const updateNotficationStatus = async value => {
    setUnread(value);
  };

  const handleAppStateChange = nextAppState => {
    if (
      // appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // TODO SET USERS ONLINE STATUS TO TRUE
      //console.log('===>', netStatus);

      if (netStatus) {
      }
    } else {
      // TODO SET USERS ONLINE STATUS TO FALSE
      const statusInactiveData = {
        status: '0',
      };
      handleStatus(statusInactiveData);
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    //console.log('AppState===>', appState.current);
  };

  const handleStatus = async status => {
    let AccessToken = await AsyncStorage.getItem('token');
    if (AccessToken != null) {
      await postApiCall('sendonlinestatus', status, {})
        .then(response => {
          //console.log('response==>', response.data);
          if (response.status == 200) {
            console.log('Status has been set Offline');
          } else {
            console.log('Status has not been set Offline');
          }
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded

            console.log(
              'error in response in Online/Offline==>',
              error.response.data,
            );
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error in request==>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('error in Setting==>', error.message);
          }
        });
    }
  };

  const callFunc = async type => {
    console.log('Type===>', type);
    console.log('notification Data==>', notificationData);
    Hud.showHud();
    const sendData = {
      channel_id: notificationData.channel_id,
      email: notificationData.email_2,
      type: type,
    };

    console.log('SendData==>', sendData);

    await postApiCall('accept-reject-call-request', sendData, {})
      .then(async response => {
        console.log('response==>', response.data.data);
        SoundPlayer.stop();
        Hud.hideHud();
        setCalling(false);
        if (type === 1) {
          navigate('VideoCall', {
            data: notificationData,
            chatId: notificationData.channel_id,
            callerType: 'receiver',
          });
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          console.log(
            'error in response in Online/Offline==>',
            error.response.data,
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error in Setting==>', error.message);
        }
      });
  };

  return (
    <ProfileProvider>
      <NotificationProvider
        value={{
          usernotificationstatus: unread,
          updateNotficationStatus: updateNotficationStatus,
          notificationData: notificationData,
          setNotificationData: setNotificationData,
          calling: calling,
          setCalling: setCalling,
        }}>
        <NavigationContainer ref={navigationRef}>
          <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            {!netStatus ? <NetworkError /> : null}

            {calling ? (
              <SafeAreaView style={styles.callContainer}>
                <View>
                  <Text
                    style={{
                      color: '#151143',
                      fontWeight: '500',
                      fontSize: RFValue(15),
                    }}>
                    {callerName}
                  </Text>
                  <Text
                    style={{
                      color: '#8E7B85',
                      fontWeight: '400',
                      fontSize: RFValue(12),
                    }}>
                    Calling...
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '30%',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={{...styles.button}}
                    onPress={() => {
                      callFunc(1);
                    }}>
                    <Image
                      source={require('./App/Assets/Icon/call_accept.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => callFunc(0)}
                    style={{...styles.button}}>
                    <Image
                      source={require('./App/Assets/Icon/call_reject.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            ) : null}

            <StackNavigation />
            <Toast />
            <Hud ref={rid => Hud.setHud(rid)} />
          </SafeAreaView>
        </NavigationContainer>
      </NotificationProvider>
    </ProfileProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  callContainer: {
    //position: 'absolute',
    height: 60,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderRadius: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',

    // paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  button: {
    height: 35,
    width: 35,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toastRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  toastText: {
    width: '70%',
    padding: 2,
  },
});
