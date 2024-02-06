import React from 'react';

// import { createStackNavigator } from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import RegistrationScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LanguageScreen from '../screens/LanguageScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OTPScreen';
import ResetPassword from '../screens/ResetPassword/index.js';

// const RootStack = createStackNavigator();
const RootStack = createNativeStackNavigator();

const RootStackScreen = ({navigation}) => (
  <RootStack.Navigator
    initialRouteName="SplashScreen"
    screenOptions={{headerShown: false}}>
    <RootStack.Screen
      name="LanguageScreen"
      component={LanguageScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="SplashScreen"
      component={SplashScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen name="LoginScreen" component={LoginScreen} />
    <RootStack.Screen
      name="RegistrationScreen"
      component={RegistrationScreen}
    />
    <RootStack.Screen name="OTPScreen" component={OtpScreen} />
    <RootStack.Screen name="ResetPassword" component={ResetPassword} />
  </RootStack.Navigator>
);

export default RootStackScreen;
