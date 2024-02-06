//import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import Login from '../../Screens/Login/Login';
import Registration from '../../Screens/Registration/Registration';
import ForgotPassword from '../../Screens/ForgotPassword/ForgotPassword';
import ForgotPasswordOtp from '../../Screens/ForgotPassword/ForgotPasswordOtp';
import ResetPassword from '../../Screens/ResetPassword/ResetPassword';

import Splash from '../../Screens/Splash/Splash';
import Profile from '../../Screens/Profile/Profile';
import PleaseWait from '../../Screens/PleaseWait/PleaseWait';
import ChangePassword from '../../Screens/ChangePassword/ChangePassword';
import Otp from '../../Screens/Otp/Otp';
import Faq from '../../Screens/FAQ/Faq';
import TermAndCondition from '../../Screens/TermAndCondition/TermAndCondition';
import PrivacyPolicy from '../../Screens/PrivacyPolicy/PrivacyPolicy';

import MyDrawer from '../DrawerNavigation/MyDrawer';

import IndividualChat from '../../Screens/IndividualChat/IndividualChat';

import LiveCelebrity from '../../Screens/Live/LiveCelebrity';
import VideoCall from '../../Screens/VideoCall/VideoCall';
import OnLive from '../../Screens/Live/OnLive';
import CelebrityOnLive from '../../Screens/Live/CelebrityOnLive';
import CelebrityProfilePage from '../../Screens/CelebrityProfile/CelebrityProfilePage';

import Payment from '../../Screens/Payment/Payment';
import PayPalPayment from '../../Screens/Payment/PayPalPayment';
import StripePayment from '../../Screens/Payment/StripePayment';
import PaymentSuccess from '../../Screens/Payment/PaymentSuccess';
import PayPalPayment2 from '../../Screens/Payment/PayPalPayment2';

//import {navigationRef} from '../../Services/NotifyNavigator';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    // <NavigationContainer ref={navigationRef}>
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="PleaseWait" component={PleaseWait} />
      <Stack.Screen name="Otp" component={Otp} />

      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />

      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />

      <Stack.Screen name="MyDrawer" component={MyDrawer} />
      <Stack.Screen
        name="CelebrityProfilePage"
        component={CelebrityProfilePage}
      />

      <Stack.Screen name="IndividualChat" component={IndividualChat} />

      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="PayPalPayment" component={PayPalPayment} />
      <Stack.Screen name="StripePayment" component={StripePayment} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="PayPalPayment2" component={PayPalPayment2} />

      <Stack.Screen name="FAQ" component={Faq} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermAndCondition" component={TermAndCondition} />
      <Stack.Screen name="LiveCelebrity" component={LiveCelebrity} />
      <Stack.Screen name="VideoCall" component={VideoCall} />
      <Stack.Screen name="OnLive" component={OnLive} />
      <Stack.Screen name="CelebrityOnLive" component={CelebrityOnLive} />
    </Stack.Navigator>

    // </NavigationContainer>
  );
};

export default StackNavigation;

//const styles = StyleSheet.create({});
