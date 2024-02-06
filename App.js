import * as React from 'react';
import { useEffect, useState, useCallback, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { SignupScreen } from './src/Screen/SignupScreen/Signup';
import { LoginScreen } from './src/Screen/LoginScreen/LoginScreen';
import { Step } from './src/Screen/Step/Step';
import { Slider } from './src/Screen/Slider/Slider';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { localNotificationService } from './src/firebase/PushController';
import { fcmService } from './src/firebase/FcmService';
import { UverHome } from './src/Screen/Home/Home';
import OtpVerifyScreen from './src/Screen/OtpVerifyScreen';
import EmailVerifyScreen from './src/Screen/EmailVerifyScreen';
import { MyBottomTabs } from './src/Navigation/TabNavigator';
import { Notification } from './src/Screen/NotificationScreen/Notification';
import { useSelector } from 'react-redux';
import BiometricScreen from './src/Screen/BiometricScreen';
import { getIsBioEnable, getUserLogin } from './src/utils/DataStore';
import { Friendsscreen } from './src/Screen/Friendsscreen/Friendsscreen';
import { Invitescreen } from './src/Screen/Invitescreen/Invitescreen';
import { RatingScreen } from './src/Screen/RatingScreen/RatingScreen';
import { ChangePassword } from './src/Screen/ChangePassword/ChangePassword';
// import { Createpassword } from './src/Screen/Createpassword /Createpassword';
import JobDetailsScreen from './src/Screen/JobDetailsScreen';

import ChatScreen from './src/Screen/ChatScreen/ChatScreen';
import JobViewScreen from './src/Screen/JobViewScreen/JobViewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileProvider } from './src/Services/ProfileProvider';
import ExpertiseDetails from './src/Screen/ExpertiseDetails/ExpertiseDetails';
import ProfileScreen from './src/Screen/ProfileScreen';
import CategoryListing from './src/Screen/CategoryListing/CategoryListing';
import RecenJobListing from './src/Screen/CategoryListing/RecenJobListing';
import AppliedDetails from './src/Screen/JobApplication/AppliedDetails';
import socketService from './src/utils/socketService';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Slider"
        component={Slider}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Step"
        component={Step}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogIn"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpVerifyScreen"
        component={OtpVerifyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailVerifyScreen"
        component={EmailVerifyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BiometricScreen"
        component={BiometricScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={MyBottomTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

function StackWithBiometrics() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BiometricScreen"
        component={BiometricScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={MyBottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Invitescreen"
        component={Invitescreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Friendsscreen"
        component={Friendsscreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RatingScreen"
        component={RatingScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Createpassword"
        component={Createpassword}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MyBottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Invitescreen"
        component={Invitescreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Friendsscreen"
        component={Friendsscreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RatingScreen"
        component={RatingScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Createpassword"
        component={Createpassword}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetailsScreen"
        component={JobDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobViewScreen"
        component={JobViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpertiseDetails"
        component={ExpertiseDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RecentJobListing"
        component={RecenJobListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  const Auth = useSelector(state => state.Auth);
  const [isLogin, setIsLogin] = useState(false);
  //const {isLogin1} = useContext(ProfileContext);
  const [isBioEnable, setIsBioEnable] = useState(false);
  const [socket, setSocket] = useState('')


  useEffect(() => {
    ConfigureFirebase();

    return()=>{
      disconnect_socket()
    }
  }, [ConfigureFirebase]);

  const ConfigureFirebase = useCallback(async () => {
    // console.log(firebase.apps.length, 'firebase')
    const androidCredentials = {
      apiKey: 'AIzaSyAEDG4LKoL7AbcelQz2ab6tDWOZORn0hAA',
      authDomain: 'uverlist-1555022012941.firebaseapp.com',
      databaseURL: 'https://uverlist-1555022012941.firebaseio.com',
      projectId: 'uverlist-1555022012941',
      storageBucket: 'uverlist-1555022012941.appspot.com',
      messagingSenderId: '1014674398298',
      appId: '1:1014674398298:android:ec2a67ebd47ca217448c63',
      measurementId: 'G-ZGLV5SC7C0',
    };

    // Your secondary Firebase project credentials for iOS...
    const iosCredentials = {
      clientId: '',
      appId: '',
      apiKey: '',
      databaseURL: '',
      storageBucket: '',
      messagingSenderId: '',
      projectId: '',
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

      //alert('Open Notification'+notify.body )
    }

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
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            AsyncStorage.setItem('fcmToken', fcmToken);
            // console.warn('have tok=====', fcmToken);
          } else {
            console.log('have tok=====', 'Not registered');
          }
        })
        .catch(error => {
          console.log('have tok=====', 'Error occured');
        });
    }
    //}
  };
  useEffect(() => {
    getBioStatus();
    getLogin();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  useEffect(() => {
    getLogin();
    getBioStatus();
  }, [Auth]);

  const getBioStatus = async () => {
    let status = await getIsBioEnable();
    setIsBioEnable(status);
  };
  const getLogin = async () => {
    let data = await getUserLogin();

    setIsLogin(data);
  };
  let stack = null;
  if (isBioEnable === 'true') {
    stack = StackWithBiometrics();
  } else {
    stack = MyStack();
  }


const  initializeSocket = async () => {

    var usertoken = await retrieveData('USER_TOKEN');
   // let UToken = JSON.parse(usertoken);
    console.warn('TOKENNNNNNNNNNNNN', usertoken);
    try {


        if (usertoken != null && usertoken != '' && usertoken != 'null'){
       const socket1 = io(SOCKET_URL, {
            //  transports: ['websocket'],
            query: { token: usertoken },
            connected: true
        })
    

        console.log("initializing socket========", socket1)

        setSocket(socket1);

            socket1.on('connect', (data) => {
                console.log("==========SOCKET CONNECTED==========");
                console.log("============", socket1.connected)
            })

        socket1.on('error', (data) => {
            console.log("SOCKET ERROR", data)
        })
    }

    } catch (error) {
        console.log("Error in socket! not initialized", error);
    }

}
const disconnect_socket=async()=>{
    var usertoken = await retrieveData('USER_TOKEN');
    // let UToken = JSON.parse(usertoken);
     console.warn('TOKENNNNNNNNNNNNN', usertoken);
     try {


        if (usertoken != null && usertoken != '' && usertoken != 'null'){
        const socket1 = io(SOCKET_URL, {
            //  transports: ['websocket'],
            query: { token: usertoken },
            connected: true
        })
        console.log("initializing socket========", socket1)
        
        if (socket1 != null) {
            console.warn('OKKKKK');
            socket1.on('connected', (data) => {
              console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);
    
              if (socket1.connected) {
                //socket1.disconnect();
                //this.socket.emit('disconnectSocket', userId);
                socket1.disconnect()
                console.warn('connect status', socket1.connected);
                socket1.disconnect()
              }
            });
          }
    }

    } catch (error) {
        console.log("Error in socket! not initialized", error);
    }
}
  return (
    <ProfileProvider
      value={{
        isLogin: isLogin,
        setIsLogin: setIsLogin,
        socket: socket,
        setSocket: setSocket,
        initializeSocket: initializeSocket,
        disconnect_socket : disconnect_socket,
      }}>
      <NavigationContainer>{isLogin ? stack : AuthStack()}</NavigationContainer>
    </ProfileProvider>
  );
}
