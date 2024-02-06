import React, { Component } from 'react';
import { Platform, I18nManager, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home/Home';
import Cart from '../Screens/Cart/Cart';
import Account from '../Screens/Account/Account';
import ChangePassword from '../Screens/Password/ChangePassword';
import strings from '../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../Component/lng/changeLng';
import Device from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="DashBoard">
    <Stack.Screen name="DashBoard" component={Home} />
    <Stack.Screen name="changepassword" component={ChangePassword} />
  </Stack.Navigator>
);
const Tab = createBottomTabNavigator();

export default class TabNavigator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTablet: false
    }
  }
  componentDidMount = () => {
    this.selectedLng()
    const isTablet = Device.isTablet();
    console.warn('isTablet', isTablet)
    if (isTablet == true) {
      this.setState({
        isTablet: true
      })
    }
  }

  selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    console.warn("selected Language data==>=================>>", lngData)
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 100 : this.state.isTablet == true ? 90 : height / 10,
            width: width
          },
          tabBarActiveTintColor: '#5A5A5F',
          tabBarInactiveTintColor: '#A7A7A7',
          tabBarLabelStyle: {
            fontSize: this.state.isTablet == true ? 14 : 13,
            // fontFamily: 'Poppins-Regular'
            paddingHorizontal: 5,
          },
          tabBarItemStyle: {
            marginVertical: Platform.OS === 'ios' ? 0 : 10,
          },
          tabBarIconStyle: {
            marginBottom: 0,
            alignSelf: 'center',
            width: this.state.isTablet == true ? width / 10 : width,
            paddingHorizontal: 0
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: strings.HOME,
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" color={color} size={this.state.isTablet == true ? 35 : 25} solid />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            tabBarLabel: strings.CART,
            tabBarIcon: ({ color }) => (
              <AntDesign name="shoppingcart" color={color} size={this.state.isTablet == true ? 40 : 30} solid />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: strings.ACCOUNT,
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" color={color} size={this.state.isTablet == true ? 40 : 30} solid />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
