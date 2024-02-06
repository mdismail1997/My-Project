import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, TouchableHighlight} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent,HeaderComponent  } from '../../components'
import ScrollView from 'react-native-gesture-handler'
// import { createDrawerNavigator } from '@react-navigation/drawer';


//const Drawer = createDrawerNavigator();

function SideMenu({ route, navigation }) {    
   
  return (
     <Text>susmita</Text>
  //   <Drawer.Navigator initialRouteName="DashboardScreen">
  //   <Drawer.Screen
  //     name="DashboardScreen"
  //     component={DashboardScreen}
  //     options={{ drawerLabel: 'DashboardScreen' }}
  //   />
   
  //   <Drawer.Screen
  //     name="AccountScreen"
  
  //     component={AccountScreen}
  //     options={{ drawerLabel: 'AccountScreen' }}
  //   />
  // </Drawer.Navigator>
  );
}


export default SideMenu
