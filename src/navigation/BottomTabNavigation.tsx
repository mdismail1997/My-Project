import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Image } from 'native-base';
import { assetIcons } from '../utils/assets';
import type { RootTabParamList } from '../types';
import { HamburgerButton } from './components/HamburgerButton';
import { HeaderRight } from './components/HeaderRight';
import { HomeScreen } from '../screens/HomeScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { appTheme } from '../colorScheme';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigation() {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { t } = useTranslation();

  const [tabIcon, setTabIcon] = useState({
    home: assetIcons[`home_${globalState.colorScheme}`],
    training: assetIcons[`training_${globalState.colorScheme}`],
    library: assetIcons[`library_${globalState.colorScheme}`],
    profile: assetIcons[`profile_${globalState.colorScheme}`],
  });

  useEffect(() => {
    setTabIcon({
      home: assetIcons[`home_${globalState.colorScheme}`],
      training: assetIcons[`training_${globalState.colorScheme}`],
      library: assetIcons[`library_${globalState.colorScheme}`],
      profile: assetIcons[`profile_${globalState.colorScheme}`],
    });
  }, [globalState.colorScheme]);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
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
        tabBarStyle: {
          backgroundColor: appTheme[globalState.colorScheme].colors.border,
        },
        tabBarActiveTintColor: appTheme[globalState.colorScheme].colors.text,
        tabBarInactiveTintColor: '#8d8d8d',
        tabBarHideOnKeyboard: true,
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('Home'),
          title: t('Home'),
          tabBarIcon: ({ size, focused }) => (
            <Image
              source={focused ? tabIcon.home : assetIcons.home}
              alt="home_icon"
              size={size + 10}
              resizeMode="contain"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          tabBarLabel: t('Training'),
          title: t('Training'),
          tabBarIcon: ({ size, focused }) => (
            <Image
              source={focused ? tabIcon.training : assetIcons.training}
              alt="training_icon"
              size={size + 20}
              resizeMode="contain"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: t('Library'),
          title: t('Library'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bookshelf" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen as React.FC<{}>}
        options={{
          tabBarLabel: t('Profile'),
          title: t('Profile'),
          tabBarIcon: ({ size, focused }) => (
            <Image
              source={focused ? tabIcon.profile : assetIcons.profile}
              alt="profile_icon"
              size={size + 10}
              resizeMode="contain"
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
