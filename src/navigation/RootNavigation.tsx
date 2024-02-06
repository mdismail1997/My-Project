import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../types';
import { DrawerNavigation } from './DrawerNavigation';
import { LogInScreen } from '../screens/LogInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SelectLanguage } from '../screens/SelectLanguage';
import { VerifyOTP } from '../screens/VerifyOTP';
import { UpdatePassword } from '../screens/UpdatePassword';
import { IntroSlider } from '../screens/IntroSlider';
import { EquiProfession } from '../screens/EquiProfession';
import { DetailsScreen } from '../screens/DetailsScreen';
import { AddQueryScreen } from '../screens/AddQueryScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { QueryDetails } from '../screens/QueryDetails';
import { ChooseTheme } from '../screens/ChooseTheme';
import { ChooseLanguage } from '../screens/ChooseLanguage';
import { Cart } from '../screens/Cart';
import { Checkout } from '../screens/Checkout';
import { ProductDetails } from '../screens/ProductDetails';
import { appTheme } from '../colorScheme';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';

interface RootNavigatorProps {
  isLogin: boolean;
}

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC<RootNavigatorProps> = ({ isLogin }) => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: appTheme[globalState.colorScheme].colors.border,
        },
        headerTintColor: appTheme[globalState.colorScheme].colors.text,
      }}
      initialRouteName={isLogin ? 'Dashboard' : 'SelectLanguage'}
    >
      <Stack.Screen
        name="SelectLanguage"
        component={SelectLanguage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogIn"
        component={LogInScreen as React.FC<{}>}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen as React.FC<{}>}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyOTP"
        component={VerifyOTP}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdatePassword"
        component={UpdatePassword as React.FC<{}>}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IntroSlider"
        component={IntroSlider}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DrawerNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EquiProfession"
        component={EquiProfession}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="AddQuery"
        component={AddQueryScreen as React.FC<{}>}
        options={{ title: t('Add query') }}
      />
      <Stack.Screen
        name="QueryDetails"
        options={{ title: t('Query details') }}
        component={QueryDetails}
      />
      <Stack.Screen
        name="ChooseTheme"
        options={{ title: t('Choose theme') }}
        component={ChooseTheme}
      />
      <Stack.Screen
        name="ChooseLanguage"
        options={{ title: t('Choose language') }}
        component={ChooseLanguage}
      />
      <Stack.Screen
        name="ProductDetails"
        options={({ route }) => ({ title: t(route.params.name) })}
        component={ProductDetails}
      />
      <Stack.Screen
        name="Cart"
        options={{ title: t('Cart') }}
        component={Cart}
      />
      <Stack.Screen
        name="Checkout"
        options={{ title: t('Checkout') }}
        component={Checkout}
      />
    </Stack.Navigator>
  );
};
