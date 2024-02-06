import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Avatar} from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddProductScreen from '../screens/AddScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import strings from '../components/lng/LocalizedStrings';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReviewScreen from '../screens/ReviewScreen';
import Notifications from '../screens/Notifications/Notifications';
import EditProduct from '../screens/AddProductScreen/EditProduct';
import COLORS from '../../conts/colors.js';
import {
  calcH,
  calcW,
  fSize,
  STORAGE_KEY,
} from '../../utils/constants/common.js';
import {Platform, View} from 'react-native';
import OrderList from '../screens/OrderList/index.js';
import OrderDetails from '../screens/OrderDetails/index.js';
import storage from '../../utils/constants/storage.js';
import HeaderIcon from '../components/HeaderIcon.js';
//import EditProfile from '../screens/EditProfile/index.js';
import UploadDocuments from '../screens/UploadDocuments/index.js';
import PaymentDetails from '../screens/PaymentDetails/index.js';
import MyProductList from '../screens/MyProductList/index.js';
import RatingScreen from '../screens/RatingScreen/index.js';
import AddProductScreen2 from '../screens/AddScreen2/index.js';
import VendorDetails from '../screens/VendorDetails.js/index.js';
import SearchScreen from '../screens/SearchScreen.js/index.js';
import {useNavigation} from '@react-navigation/native';
import EditTag from '../screens/EditTag/index.js';

const HomeStack = createNativeStackNavigator();
const DetailsStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const headerMenu = () => {
  const navigation = useNavigation();
  return (
    <Icon.Button
      name="ios-menu"
      size={calcH(0.033)}
      backgroundColor={COLORS.header_color}
      style={{padding: 0, borderWidth: 0, color: '#FFF'}}
      onPress={() => navigation.openDrawer()}
    />
  );
};

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: calcH(0.1),
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 0,
        shadowColor: COLORS.blue,
      },
      tabBarActiveTintColor: COLORS.header_color,
      tabBarInactiveTintColor: COLORS.inactiveTintColor,
      tabBarLabelStyle: {
        fontSize: fSize(13),
        fontFamily: 'Poppins-Regular',
      },
      tabBarItemStyle: {
        marginVertical: Platform.OS === 'ios' ? -calcH(0.01) : calcH(0.008),
      },
      tabBarIconStyle: {
        marginTop: Platform.OS === 'ios' ? calcH(0.015) : 0,
      },
    }}>
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        title: `${strings.HOME}`,
        tabBarLabel: `${strings.HOME}`,
        tabBarIcon: ({color, focused}) => {
          return (
            <View
              style={{
                height: calcH(0.04),
                width: calcW(0.1),
                alignItems: 'center',
              }}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="home-outline"
                color={focused ? COLORS.focusIconColor : color}
                size={calcH(0.04)}
                solid
              />
            </View>
          );
        },
      }}
    />
    {/* <Tab.Screen
      name="Message"
      component={NotificationStackScreen}
      options={{
        tabBarLabel: `${strings.MESSAGE}`,
        tabBarIcon: ({color, focused}) => (
          <Fontisto
            name="email"
            color={focused ? COLORS.focusIconColor : color}
            size={calcH(0.04)}
          />
        ),
      }}
    /> */}
    <Tab.Screen
      name="Account"
      component={AccountStackScreen}
      options={{
        tabBarLabel: `${strings.ACCOUNT}`,
        tabBarIcon: ({color, focused}) => {
          return (
            <View
              style={{
                height: calcH(0.04),
                width: calcW(0.1),
                alignItems: 'center',
              }}>
              <Ionicons
                name="person-outline"
                color={focused ? COLORS.focusIconColor : color}
                size={calcH(0.04)}
                solid
              />
            </View>
          );
        },
      }}
    />
    <Tab.Screen
      name="To Do List"
      component={OrderStackScreen}
      options={{
        tabBarLabel: `${strings.TO_DO_LIST}`,
        tabBarIcon: ({color, focused}) => {
          return (
            <View
              style={{
                height: calcH(0.04),
                width: calcW(0.1),
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                color={focused ? COLORS.focusIconColor : color}
                size={calcH(0.04)}
                solid
              />
            </View>
          );
        },
      }}
    />
    {/* <Tab.Screen
      name="MyProductList"
      component={MyProductList}
      options={{
        tabBarLabel: `${strings.TO_DO_LIST}`,
        tabBarIcon: ({color, focused}) => (
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            color={focused ? COLORS.focusIconColor : color}
            size={calcH(0.04)}
            solid
          />
        ),
      }}
    /> */}
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.header_color,
      },
      headerTintColor: '#fff',
    }}>
    <HomeStack.Screen
      name="home"
      component={HomeScreen}
      options={{
        title: `${strings.HOME}`,
        headerTitleAlign: 'left',
        headerLeft: () => headerMenu(),
        headerRight: () => <HeaderIcon />,
      }}
    />

    <HomeStack.Screen
      name="addProduct"
      component={AddProductScreen}
      options={{
        title: `${strings.ADD_PRODUCT}`,
        animation: 'none',
        headerRight: () => <HeaderIcon />,
      }}
    />
    <HomeStack.Screen
      name="addProduct2"
      component={AddProductScreen2}
      options={{
        title: `${strings.ADD_CONFIGURABLE_PRODUCT}`,
        animation: 'none',
        headerRight: () => <HeaderIcon />,
      }}
    />

    <HomeStack.Screen
      name="editProduct"
      component={EditProduct}
      options={{
        title: `${strings.EDIT_PRODUCT}`,
        animation: 'none',
        headerRight: () => <HeaderIcon />,
      }}
    />
    <HomeStack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{
        title: `${strings.SEARCH_Screen}`,
        animation: 'none',
        headerRight: () => <HeaderIcon />,
      }}
    />

    <DetailsStack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{
        title: `${strings.CHANGE_PASSWORD}`,
        headerRight: () => <HeaderIcon />,
      }}
    />

    <DetailsStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: `${strings.PROFILE}`,
        headerRight: () => <HeaderIcon />,
      }}
    />
    {/* <DetailsStack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        title: `${strings.EDIT_PROFILE}`,
        headerRight: () => <HeaderIcon />,
      }}
    /> */}
    <DetailsStack.Screen
      name="PaymentDetails"
      component={PaymentDetails}
      options={{
        title: `${strings.PAYMENT_DETAILS}`,
        headerRight: () => <HeaderIcon />,
      }}
    />
    <DetailsStack.Screen
      name="MyProductList"
      component={MyProductList}
      options={{
        title: `${strings.PAYMENT_DETAILS}`,
        headerRight: () => <HeaderIcon />,
        headerTitle: `${strings.PRODUCT_LIST}`,
        headerLargeTitleShadowVisible: true,
        tabBarLabel: `${strings.PRODUCT_LIST}`,
        tabBarIcon: ({color, focused}) => (
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            color={focused ? COLORS.focusIconColor : color}
            size={calcH(0.04)}
            solid
          />
        ),
      }}
    />
    <DetailsStack.Screen
      name="UploadDocuments"
      component={UploadDocuments}
      options={{
        title: `${strings.UPLOAD_DOCUMENTS}`,
        headerRight: () => <HeaderIcon />,
      }}
    />
    <DetailsStack.Screen
      name="EditTag"
      component={EditTag}
      options={{
        title: `${strings.EDIT_DESCRIPTION}`,
        headerRight: () => <HeaderIcon />,
      }}
    />
    <DetailsStack.Screen
      name="OrderList"
      component={OrderList}
      options={{
        title: `${strings.ORDER_LIST}`,
        headerLeft: () => headerMenu(),
        headerRight: () => <HeaderIcon />,
      }}
    />
    <DetailsStack.Screen
      name="OrderDetails"
      component={OrderDetails}
      options={{
        title: `${strings.ORDER_DETAILS}`,
        // headerLeft: () => (
        //   <Icon.Button
        //     name="ios-menu"
        //     size={calcH(0.033)}
        //     backgroundColor={COLORS.header_color}
        //     style={{}}
        //     onPress={() => navigation.openDrawer()}
        //   />
        // ),
        headerRight: () => <HeaderIcon />,
      }}
    />
    <DetailsStack.Screen
      name="RatingScreen"
      component={RatingScreen}
      options={{
        title: `${strings.REVIEWS}`,
        // headerLeft: () => (
        //   <Icon.Button
        //     name="ios-menu"
        //     size={calcH(0.033)}
        //     backgroundColor={COLORS.header_color}
        //     style={{}}
        //     onPress={() => navigation.openDrawer()}
        //   />
        // ),
        headerRight: () => <HeaderIcon />,
      }}
    />
    {/* <DetailsStack.Screen
      name="Notifications1"
      component={Notifications}
      options={{
        title: `${strings.NOTIFICATION}`,
        // headerLeft: () => (
        //   <Icon.Button
        //     name="ios-menu"
        //     size={calcH(0.033)}
        //     backgroundColor={COLORS.header_color}
        //     style={{}}
        //     onPress={() => navigation.openDrawer()}
        //   />
        // ),
        headerRight: () => <HeaderIcon />,
      }}
    /> */}
    <DetailsStack.Screen
      name="VendorDetails"
      component={VendorDetails}
      options={{
        title: `${strings.VENDOR_DETAILS}`,
        headerRight: () => <HeaderIcon />,
      }}
    />
  </HomeStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.header_color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        //fontWeight: 'bold',
      },
    }}>
    <DetailsStack.Screen
      name="To Do List 1"
      component={ReviewScreen}
      options={{
        title: 'Review',
        headerLeft: () => headerMenu(),
        headerRight: () => <HeaderIcon />,
      }}
    />
  </DetailsStack.Navigator>
);

const AccountStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.header_color,
      },
      headerTintColor: '#fff',

      headerTitleStyle: {
        //fontWeight: 'bold',
      },
    }}>
    <DetailsStack.Screen
      name="ExploreScreen"
      component={ProfileScreen}
      options={{
        title: `${strings.ACCOUNT}`,
        headerLeft: () => headerMenu(),
        headerRight: () => <HeaderIcon />,
      }}
    />
  </DetailsStack.Navigator>
);

const OrderStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.header_color,
      },
      headerTintColor: '#fff',

      headerTitleStyle: {
        //fontWeight: 'bold',
      },
    }}>
    <DetailsStack.Screen
      name="OrderListStack"
      component={OrderList}
      options={{
        title: `${strings.ORDER_LIST}`,
        headerLeft: () => headerMenu(),
        headerRight: () => <HeaderIcon />,
      }}
    />
  </DetailsStack.Navigator>
);

const NotificationStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.header_color,
      },
      //headerTintColor: '#fff',
      headerTitleStyle: {
        //fontWeight: 'bold',
      },
    }}>
    <DetailsStack.Screen
      name="ExploreScreen"
      component={Notifications}
      options={{
        title: 'Notifications',
        headerLeft: () => headerMenu(),
        headerRight: () => <HeaderIcon />,
      }}
    />
  </DetailsStack.Navigator>
);
