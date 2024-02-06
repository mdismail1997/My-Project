import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import routes from './routes';
import MyBottomTabs from './BottomNav';
import ChangePassword from '../Screen/AfterLogin/changePassword';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      defaultScreenOptions={{
        drawerStyle: {},
      }}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name={routes.Bottomtab} component={MyBottomTabs} />  
      <Drawer.Screen name={routes.ChangePassword} component={ChangePassword} />

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
