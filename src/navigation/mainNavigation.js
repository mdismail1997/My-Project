import React from 'react';
import {View, Text} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  signIn,
  signUp,
  splashScreen,
  termsCondition,
  userVerification,
} from '../screens/auth/';

import {forgetPassword, otp, setPassword} from '../screens/resetPassword/';

import bookingStep2 from '../screens/afterLogin/bookingStep2';
import bookingStep3 from '../screens/afterLogin/bookingStep3';
import payment from '../screens/afterLogin/payment';
import driverView from '../screens/afterLogin/driverView';
import waitingScreen from '../screens/afterLogin/waitingScreen';
import familyRide from '../screens/afterLogin/familyRide';
import notification from '../screens/afterLogin/notification';
import aboutScreen from '../screens/afterLogin/aboutScreen';
import helpSupport from '../screens/afterLogin/helpSupport';
import drawerNavigation from '../navigation/drawerNavigation';
import editProfile from '../screens/afterLogin/editProfile';
import TabScreen from '../screens/afterLogin/TabScreen';
import rideHistory from '../screens/afterLogin/rideHistory';

import reviewFeedback from '../screens/afterLogin/reviewFeedback';
import cancellation from '../screens/afterLogin/cancellation';
import changePassword from '../screens/afterLogin/changePassword';
import resetPassword from '../screens/afterLogin/resetPassword';
import PaymentDetails from '../screens/afterLogin/paymentDetails';
import invoice from '../screens/afterLogin/invoice';
import AccountScreen from '../screens/afterLogin/accountScreen';
import {CouponDetails} from '../screens/afterLogin/CouponDetails';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="splashScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="splashScreen" component={splashScreen} />
      <Stack.Screen name="signIn" component={signIn} />
      <Stack.Screen name="signUp" component={signUp} />
      <Stack.Screen name="userVerification" component={userVerification} />
      <Stack.Screen name="forgetPassword" component={forgetPassword} />
      <Stack.Screen name="otp" component={otp} />
      <Stack.Screen name="setPassword" component={setPassword} />
      <Stack.Screen name="changePassword" component={changePassword} />
      <Stack.Screen name="resetPassword" component={resetPassword} />
      <Stack.Screen name="bookingStep2" component={bookingStep2} />
      <Stack.Screen name="bookingStep3" component={bookingStep3} />
      <Stack.Screen name="payment" component={payment} />
      <Stack.Screen name="driverView" component={driverView} />
      <Stack.Screen name="waitingScreen" component={waitingScreen} />
      <Stack.Screen name="familyRide" component={familyRide} />
      <Stack.Screen name="notification" component={notification} />
      <Stack.Screen name="aboutScreen" component={aboutScreen} />
      <Stack.Screen name="helpSupport" component={helpSupport} />
      <Stack.Screen name="drawerNavigation" component={drawerNavigation} />
      <Stack.Screen name="editProfile" component={editProfile} />
      <Stack.Screen name="rideHistory" component={rideHistory} />
      <Stack.Screen name="TabScreen" component={TabScreen} />
      <Stack.Screen name="termsCondition" component={termsCondition} />
      <Stack.Screen name="reviewFeedback" component={reviewFeedback} />
      <Stack.Screen name="cancellation" component={cancellation} />
      <Stack.Screen name="paymentDetails" component={PaymentDetails} />
      <Stack.Screen name="invoice" component={invoice} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen
        name="coupon-details"
        options={{headerShown: true, headerTitle: 'Coupon details'}}
        component={CouponDetails}
      />
    </Stack.Navigator>
  );
}
