import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Slider from '../Screen/Slider/Slider';
import routes from './routes';
import SignIn from '../Screen/Auth/SignIn';
import SignUp from '../Screen/Auth/SignUp';
import Home from '../Screen/AfterLogin/Home';
import DrawerNavigator from './DrawerNav';
import {ProductDetails} from '../Screen/AfterLogin/Product/ProductDetails';
import ChangePassword from '../Screen/AfterLogin/changePassword';
import ForgetPassword from '../Screen/Auth/ForgetPassword';
import SizeDetails from '../Screen/AfterLogin/Product/SizeDetails';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName={routes.Slide}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={routes.Slide} component={Slider} />
        <Stack.Screen name={routes.SignIn} component={SignIn} />
        <Stack.Screen name={routes.SignUp} component={SignUp} />
        <Stack.Screen name={routes.ForgetPassword} component={ForgetPassword} />
        <Stack.Screen name={routes.ProductDetails} component={ProductDetails} />
        <Stack.Screen name={routes.SizeDetails} component={SizeDetails} />
        <Stack.Screen name={routes.Drawertab} component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
