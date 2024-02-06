import React from 'react';

//import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../../Screens/Home/Home';
import NotificationSettingScreen from '../../Screens/NotificationSettingScreen/NotificationSettingScreen';
import ListOfQuestion from '../../Screens/ListOfQuestion/ListOfQuestion';
import ListOfQuestionCelebrity from '../../Screens/ListOfQuestion/ListOfQuestionCelebrity';
//import IndividualChat from '../../Screens/IndividualChat/IndividualChat';
import Notification from '../../Screens/Notification/Notification';
import Live from '../../Screens/Live/Live';
import CelebrityProfile from '../../Screens/CelebrityProfile/CelebrityProfile';
import CelebrityProfileData from '../../Screens/CelebrityProfile/CelebrityProfileData';
import Transactions from '../../Screens/Transactions/Transactions';
import AllRequest from '../../Screens/AllRequest/AllRequest';
import CancelRequest from '../../Screens/CancelRequest/CancelRequest';

import Balance from '../../Screens/Balance/Balance';
import AddAccount from '../../Screens/AddAccount/AddAccount';

//import LiveCelebrity from '../../Screens/Live/LiveCelebrity';

import Chat from '../../Screens/Chat/Chat';
import ChatCelebrity from '../../Screens/Chat/ChatCelebrity';
import ScheduleChat from '../../Screens/ScheduleChat/ScheduleChat';
import ScheduleVideo from '../../Screens/ScheduleVideo/ScheduleVideo';
import Wallet from '../../Screens/Wallet/Wallet';
import AddMoney from '../../Screens/AddMoney/AddMoney';
import PaymentSuccess1 from '../../Screens/Payment/PaymentSuccess1';
import LiveQuestion from '../../Screens/Live/LiveQuestion';
import ScheduleLive from '../../Screens/Live/ScheduleLive';

import BottomTab from './BottomTab';

const BottomTabs = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={{headerShown: false}}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
      tabBar={props => <BottomTab {...props} />}>
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Live"
        component={Live}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="LiveQuestion"
        component={LiveQuestion}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Transactions"
        component={Transactions}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="CelebrityProfile"
        component={CelebrityProfile}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="CelebrityProfileData"
        component={CelebrityProfileData}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="NotificationSettingScreen"
        component={NotificationSettingScreen}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Notification"
        component={Notification}
      />
      <BottomTabs.Screen
        name="ListOfQuestion"
        component={ListOfQuestion}
        options={{headerShown: false}}
      />
      <BottomTabs.Screen
        name="ListOfQuestionCelebrity"
        component={ListOfQuestionCelebrity}
        options={{headerShown: false}}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="AllRequest"
        component={AllRequest}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="CancelRequest"
        component={CancelRequest}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Chat"
        component={Chat}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="ChatCelebrity"
        component={ChatCelebrity}
      />
      {/* <BottomTabs.Screen
        options={{headerShown: false}}
        name="IndividualChat"
        component={IndividualChat}
      /> */}
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="ScheduleChat"
        component={ScheduleChat}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="ScheduleVideo"
        component={ScheduleVideo}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="ScheduleLive"
        component={ScheduleLive}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Wallet"
        component={Wallet}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="AddMoney"
        component={AddMoney}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="Balance"
        component={Balance}
      />
      <BottomTabs.Screen
        options={{headerShown: false}}
        name="AddAccount"
        component={AddAccount}
      />

      <BottomTabs.Screen
        options={{headerShown: false}}
        name="PaymentSuccess1"
        component={PaymentSuccess1}
      />
    </BottomTabs.Navigator>
  );
};

export default BottomTabNavigation;

//const styles = StyleSheet.create({});
