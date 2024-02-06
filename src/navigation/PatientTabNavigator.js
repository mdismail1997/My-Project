import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Account, AccountScreen } from '../screens/Account/Account';
import { SearchScreen } from '../screens/Search/Search';
import { Befrereq } from '../screens/Beforerequest/Beforereq';
import { History } from '../screens/History/History';
import { Chat } from '../screens/ChatConsultation/Chat';
import { Home } from '../screens/Home/Home';
import { Filter } from '../screens/Filter/Filter';
import { Acceptreq } from '../screens/Acceptreq/Acceptreq';
import { PatientHome } from '../screens/Patient/Home/PatientHome';
import { PatientDetails } from '../screens/Patient/PatientDetails/PatientDetails';
import { Appointment } from '../screens/Patient/Appointment/Appointment';
import { App } from '../App';
import { PatientSearch } from '../screens/Patient/PatientSearch/PatientSearch';
import InspectionCost from '../screens/Patient/BookAppintment/BookAppoin';
import { PatientHistory } from '../screens/Patient/PatientHistory/PatientHistory';
import { PatientAccount } from '../screens/Patient/PatientAccount/PatientAccount';
import { VoiceCallEnd } from '../screens/Patient/VoiceCallEnd/VoiceCallEnd';

const Tab = createBottomTabNavigator();

export const MyTabs = () => {
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
          fontSize: 10,
          fontFamily: 'Poppins-Regular',
        },
        // tabBarItemStyle: {
        //   marginVertical: 10,
        // },
      }}
    >
      <Tab.Screen
        name="Search"
        component={PatientSearch}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={30} solid />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={Appointment}
        tabBarStyle={{ fontSize: 10 }}
        tabBarLabelStyle={{ fontSize: 10 }}
        options={{
          tabBarLabel: 'Appointment',
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
        component={PatientHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={30} solid />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={PatientHistory}
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
        component={PatientAccount}
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
