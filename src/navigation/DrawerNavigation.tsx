import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerContent } from './components/DrawerContent';
import { HamburgerButton } from './components/HamburgerButton';
import { HeaderRight } from './components/HeaderRight';
// import { HeaderRightCart } from './components/HeaderRightCart';
import { BottomTabNavigation } from './BottomTabNavigation';
import { AboutScreen } from '../screens/AboutScreen';
import { TermsAndConditions } from '../screens/TermsAndConditions';
import { PrivacyPolicy } from '../screens/PrivacyPolicy';
import { RootDrawerParamList } from '../types';
import { ChangePassword } from '../screens/ChangePassword';
import { QueryScreen } from '../screens/QueryScreen';
import { SettingScreen } from '../screens/SettingScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { FavouriteList } from '../screens/FavouriteList';
import { appTheme } from '../colorScheme';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
// import { Shop } from '../screens/Shop';
// import { HeaderRightCart } from './components/HeaderRightCart';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export function DrawerNavigation() {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      useLegacyImplementation
      screenOptions={{
        headerLeft: () => (
          <HamburgerButton
            color={appTheme[globalState.colorScheme].colors.text}
          />
        ),
        headerRight: () => <HeaderRight notificationCount={1} />,
        headerStyle: {
          backgroundColor: appTheme[globalState.colorScheme].colors.border,
        },
        headerTintColor: appTheme[globalState.colorScheme].colors.text,
        headerTitleContainerStyle: { width: width - 170 },
      }}
      initialRouteName="DrawerHome"
    >
      <Drawer.Screen
        name="DrawerHome"
        component={BottomTabNavigation}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home-outline" color={color} size={size} />
          ),
          title: t('Home'),
        }}
      />
      {/* <Drawer.Screen
        name="Shop"
        component={Shop}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-outline" color={color} size={size} />
          ),
          title: t('Shop'),
          headerRight: () => <HeaderRightCart />,
        }}
      />  */}
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePassword as React.FC<{}>}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="key-outline" color={color} size={size} />
          ),
          title: t('Change password'),
        }}
      />
      <Drawer.Screen
        name="Membership"
        component={SubscriptionScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="account-multiple-outline"
              color={color}
              size={size}
            />
          ),
          title: t('Membership'),
        }}
      />
      <Drawer.Screen
        name="PostAQuery"
        component={QueryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="note-edit-outline" color={color} size={size} />
          ),
          title: t('Post a query'),
        }}
      />
      <Drawer.Screen
        name="MyFavourite"
        component={FavouriteList}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="star-half-full" color={color} size={size} />
          ),
          title: t('My favourite'),
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="cog-outline" color={color} size={size} />
          ),
          title: t('Setting'),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="file-outline" color={color} size={size} />
          ),
          title: t('About'),
        }}
      />
      <Drawer.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="file-sign" color={color} size={size} />
          ),
          title: t('Terms and conditions'),
        }}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="shield-alert-outline"
              color={color}
              size={size}
            />
          ),
          title: t('Privacy policy'),
        }}
      />
      <Drawer.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="bell-badge-outline"
              color={color}
              size={size}
            />
          ),
          title: t('Notification'),
        }}
      />
    </Drawer.Navigator>
  );
}
