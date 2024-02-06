import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity,Alert, StatusBar, SafeAreaView ,TextInput, TouchableHighlight,Dimensions} from 'react-native';
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent,HeaderComponent  } from '../components'
import ScrollView from 'react-native-gesture-handler'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { DashboardScreen, AccountScreen, }  from '../screen';
import Customdrawer from '../navigation/CustomDrawer';
//import KDrawer from '../navigation/KDrawer';
import { Images } from '../assets/image';
const width = Dimensions.get("screen").width;
const Drawer = createDrawerNavigator();

function DrawerNavigation({ route, navigation },props) {  
  
   
  return ( 
    
    <Drawer.Navigator 
      initialRouteName="DashboardScreen"
      screenOptions={{ headerShown: false, drawerStyle: { width: width - 50 } }}
      drawerContent={(props)=> <Customdrawer {...props}/>}
    >
        
    
    <Drawer.Screen
      name="DashboardScreen"
      component={DashboardScreen}    
    />
   
    {/* <Drawer.Screen
      name="My Account"
      component={AccountScreen}   
    />
    
    <Drawer.Screen
     name='Logout'
     component={Customdrawer}
    /> */}
    
    </Drawer.Navigator>
    
  );
}


export default DrawerNavigation

