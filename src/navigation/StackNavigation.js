import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  DashboardScreen,
  AccountScreen,
  BucketScreen,
  CreateGroupScreen,
  ForgetScreen,
  OtpScreen,
  SideMenu,
  RoomListScreen,
  SearchRoomieScreen,
  RoomDetailsScreen,
  LocationFinderScreen,
  TripListScreen,
  TripReviewScreen,
  ReviewDetailsScreen,
  TripGroupScreen,
  TripReviewSecondScreen,
  PartnerListScreen,
  RegScreen,
  LogScreen,
  HoScreen,
} from '../screen';
import DrawerNavigation from '../navigation/DrawerNavigation';

import resetPassword from '../screen/resetPassword';
import Chat from '../screen/Chat/Chat';
import FriendRequest from '../screen/FriendRequest/FriendRequest';
import SearchFriendList from '../screen/SearchFriendList/SearchFriendList';
import SearchTrip from '../screen/SearchTrip/SearchTrip';
import VirtualTour from '../screen/VirtualTour/VirtualTour';

const Stack = createStackNavigator();

function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false, animation: 'none'}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="BucketScreen" component={BucketScreen} />
        <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} />
        <Stack.Screen name="ForgetScreen" component={ForgetScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="resetPassword" component={resetPassword} />
        <Stack.Screen name="SideMenu" component={SideMenu} />
        <Stack.Screen name="RoomListScreen" component={RoomListScreen} />
        <Stack.Screen
          name="SearchRoomieScreen"
          component={SearchRoomieScreen}
        />
        <Stack.Screen name="RoomDetailsScreen" component={RoomDetailsScreen} />
        <Stack.Screen
          name="LocationFinderScreen"
          component={LocationFinderScreen}
        />
        <Stack.Screen name="TripListScreen" component={TripListScreen} />
        <Stack.Screen name="TripReviewScreen" component={TripReviewScreen} />
        <Stack.Screen
          name="ReviewDetailsScreen"
          component={ReviewDetailsScreen}
        />
        <Stack.Screen name="TripGroupScreen" component={TripGroupScreen} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />

        <Stack.Screen
          name="TripReviewSecondScreen"
          component={TripReviewSecondScreen}
        />
        <Stack.Screen name="PartnerListScreen" component={PartnerListScreen} />

        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="FriendRequest" component={FriendRequest} />
        <Stack.Screen name="SearchFriendList" component={SearchFriendList} />
        <Stack.Screen name="SearchTrip" component={SearchTrip} />
        <Stack.Screen name="VirtualTour" component={VirtualTour} />

        <Stack.Screen name="RegScreen" component={RegScreen} />
        <Stack.Screen name="LogScreen" component={LogScreen} />
        <Stack.Screen name="HoScreen" component={HoScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigation;
