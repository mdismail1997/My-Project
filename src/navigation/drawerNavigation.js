import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {STYLES, calcH, calcW} from '../../utils/constants/common';
import {Screen, InputComponent, HeaderComponent} from '../../components';
import ScrollView from 'react-native-gesture-handler';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  bookingStep1,
  notification,
  aboutScreen,
  helpSupport,
  couponScreen,
} from '../screens/afterLogin/';

const Drawer = createDrawerNavigator();

function DrawerNavigation({route, navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="bookingStep1"
      drawerStyle={{width: '75%'}}>
      <Drawer.Screen
        name="bookingStep1"
        component={bookingStep1}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="notification"
        component={notification}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="aboutScreen"
        component={aboutScreen}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="couponScreen"
        component={couponScreen}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="helpSupport"
        component={helpSupport}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
