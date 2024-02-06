import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import BottomTabNavigation from '../BottomNavigation/BottomTabNavigation';

import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawer {...props} />}
      detachInactiveScreens={false}>
      <Drawer.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
      />
    </Drawer.Navigator>
  );
};

export default MyDrawer;

//const styles = StyleSheet.create({});
