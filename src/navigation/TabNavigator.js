import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Account } from '../screens/Account/Account';
import { SearchScreen } from '../screens/Search/Search';
import { Befrereq } from '../screens/Beforerequest/Beforereq';
import { History } from '../screens/History/History';

import { Home } from '../screens/Home/Home';

const Tab = createBottomTabNavigator();

export const MyBottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        // tabBarStyle: {
        //   height: 70,
        // },
        tabBarActiveTintColor: '#2173A8',
        tabBarInactiveTintColor: '#000',
        tabBarInactiveBackgroundColor: '#fff',
        tabBarActiveBackgroundColor: '#fff',
        tabBarLabelStyle: {
          fontSize: 14,
        },
        // tabBarItemStyle: {
        //   marginVertical: 10,
        // },
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={30} solid />
          ),
        }}
      />

      <Tab.Screen
        name="Request"
        component={Befrereq}
        options={{
          tabBarLabel: 'Request',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="text-box-outline"
              color={color}
              size={30}
              solid
            />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={30} solid />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <Feather name="user" color={color} size={30} solid />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
