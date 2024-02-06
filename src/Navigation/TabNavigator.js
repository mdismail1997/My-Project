import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OIcon from 'react-native-vector-icons/dist/Octicons';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { UverHome } from '../Screen/Home/Home';

import MyAccount from '../Screen/MyAccount/MyAccount';
import LocationRadiusScreen from '../Screen/LocationRadiusScreen';
import RecognitionScreen from '../Screen/RecognitionScreen';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Screen/ProfileScreen';
import CreateJobs from '../Screen/CreateJobs/CreateJob';
import Dashboard from '../Screen/Dashboard/Dashboard';
import { Friendsscreen } from '../Screen/Friendsscreen/Friendsscreen';
import CategoryListing from '../Screen/CategoryListing/CategoryListing';
import JobApplication from '../Screen/JobApplication/JobApplication';
import AppliedDetails from '../Screen/JobApplication/AppliedDetails';
import ReceivedDetails from '../Screen/JobApplication/ReceivedDetails';
import AcceptedDetails from '../Screen/JobApplication/AcceptedDetails';
import DisapprovedDetails from '../Screen/JobApplication/DisapprovedDetails';

import Applied from '../Screen/JobApplied/Applied';
import Approved from '../Screen/JobApplied/Approved';
import Denied from '../Screen/JobApplied/Denied';
import JobApplied from '../Screen/JobApplied/JobApplied';
import CardAdd from '../Screen/Stripe/CardAdd';
import BankAdd from '../Screen/Stripe/BankAdd';

import JobWorked from '../Screen/JobWorked/JobWorked';
import allJobDetails from '../Screen/JobWorked/allJobDetails';
import privatejobDetails from '../Screen/JobWorked/privatejobDetails';

import JobCreated from '../Screen/JobCreated/JobCreated';
import allCreatedJobDetails from '../Screen/JobCreated/allCreatedJobDetails';

import FriendProfile from '../Screen/Invitescreen/FriendProfile';
import FriendList from '../Screen/Friendsscreen/FriendList';
import FriendInvite from '../Screen/Friendsscreen/FriendInvite';
import ProfileView from '../Screen/Friendsscreen/ProfileView';
import LocationScreen from '../Screen/Location/Location';
import { Joblisting } from '../Screen/Location/Joblisting';


import cardPayment from '../Screen/Stripe/cardPayment';
import saveCardPayment from '../Screen/Stripe/saveCardPayment';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const LocationStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LocationRadius"
        component={LocationRadiusScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={UverHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Joblisting"
        component={Joblisting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recognition"
        component={RecognitionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryListing"
        component={CategoryListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LocationRadius"
        component={LocationRadiusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppliedDetails"
        component={AppliedDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceivedDetails"
        component={ReceivedDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AcceptedDetails"
        component={AcceptedDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobApplication"
        component={JobApplication}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DisapprovedDetails"
        component={DisapprovedDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="JobWorked"
        component={JobWorked}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="allJobDetails"
        component={allJobDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="privatejobDetails"
        component={privatejobDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="JobCreated"
        component={JobCreated}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="allCreatedJobDetails"
        component={allCreatedJobDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CardAdd"
        component={CardAdd}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="cardPayment"
        component={cardPayment}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="saveCardPayment"
        component={saveCardPayment}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BankAdd"
        component={BankAdd}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="JobApplied"
        component={JobApplied}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Applied"
        component={Applied}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Approved"
        component={Approved}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Denied"
        component={Denied}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const FriendStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FriendList"
        component={FriendList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FriendInvite"
        component={FriendInvite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileView"
        component={ProfileView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const MyBottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#2173A8',
        tabBarInactiveTintColor: '#333333',
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Poppins-Regular',
        },
        tabBarItemStyle: {
          marginVertical: 10,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={30} solid />
          ),
        }}
      />
      <Tab.Screen
        name="Request"
        component={Friendsscreen}
        options={{
          tabBarLabel: 'Chat',
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
        name="Search"
        component={CreateJobs}
        options={{
          tabBarLabel: 'Post Job',
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
        name="FriendList"
        component={FriendStack}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={MyAccount}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <OIcon name="shield-lock" color={color} size={30} solid />

          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Feather name="user" color={color} size={30} solid />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
