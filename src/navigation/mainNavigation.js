import React, {Component, useEffect, useState} from 'react';

import account from '../screens/account/account';
import documentUpload from '../screens/account/documentUpload';

import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerComponent from '../Components/DrawerComponent';
import homeScreen from '../screens/account/home';
import acceptRide from '../screens/account/acceptRide';
import afterVerify from '../screens/account/afterVerify';

import getRide from '../screens/account/getRide';
import cancelRide from '../screens/account/cancelRide';
import cancelHistory from '../screens/account/cancelHistory';
import tollScreen from '../screens/account/tollScreen';
import rideHistory from '../screens/account/rideHistory';
import tollScreenUpdate from '../screens/account/tollScreenUpdate';
import termsandcondition from '../screens/account/terms&condition';
import helpandSupport from '../screens/account/helpandSupport';
import paymentDetails from '../screens/account/paymentDetails';
import PaymentDetails from '../screens/account/paymentDetails';
import {Payout} from '../screens/account/Payout';
import DocumentUpload from '../screens/account/documentUpload';
import AboutScreen from '../screens/account/AboutScreen';
import Notification from '../screens/account/notification';

const Drawer = createDrawerNavigator();

export default function mainNavigation() {
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={props => <DrawerComponent {...props} />}>
        <Drawer.Screen name="homeScreen" component={homeScreen} />
        <Drawer.Screen name="getRide" component={getRide} />
        <Drawer.Screen name="acceptRide" component={acceptRide} />
        <Drawer.Screen name="afterVerify" component={afterVerify} />
        <Drawer.Screen name="cancelRide" component={cancelRide} />
        
        <Drawer.Screen name="cancelHistory" component={cancelHistory} />
        <Drawer.Screen name="tollScreen" component={tollScreen} />
        <Drawer.Screen name="rideHistory" component={rideHistory} />
        <Drawer.Screen name="termsandCondition" component={termsandcondition} />
        <Drawer.Screen name="AboutScreen" component={AboutScreen} />
        <Drawer.Screen name="helpandSupport" component={helpandSupport} />

        <Drawer.Screen name="paymentDetails" component={PaymentDetails} />
        <Drawer.Screen name="payOut" component={Payout} />
        <Drawer.Screen
          options={{headerShown: true, title: 'Documentation'}}
          name="documentUpload"
          component={DocumentUpload}
        />
      </Drawer.Navigator>
    </>
  );
}
