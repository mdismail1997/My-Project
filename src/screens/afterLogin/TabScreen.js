import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, Image} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconSimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import colors from '../../utils/colors';
import {calcH, calcW} from '../../utils/comon';
import bookingStep1 from './bookingStep1';
import cancelHistory from './cancelHistory';
import couponScreen from './couponScreen';
import accountScreen from './accountScreen';
import TipScreen from './TipScreen';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarInactiveBackgroundColor: colors.white,
        tabBarActiveBackgroundColor: colors.white,
        tabBarActiveTintColor: '#00A3FE',
        tabBarStyle: {
          paddingBottom: 0,
          paddingTop: 0,
          height: calcH(0.1),
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={bookingStep1}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <IconMaterialCommunityIcons
                size={30}
                name={'home'}
                color={color}
              />

              <Text
                style={{
                  color: focused ? '#00A3FE' : '#7A7C80',
                  fontSize: 12,
                }}>
                Home
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Coupon"
        component={couponScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <IconMaterialCommunityIcons
                size={30}
                name={'wallet'}
                color={color}
              />
              <Text
                style={{
                  color: focused ? '#00A3FE' : '#7A7C80',
                  fontSize: 12,
                }}>
                Coupon
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />

      {/* <Tab.Screen
        name="Tips"
        component={TipScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <IconAntDesign size={30} name={'creditcard'} color={color} />
              <Text
                style={{
                  color: focused ? '#00A3FE' : '#7A7C80',
                  fontSize: 12,
                }}>
                Tips
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      /> */}

      <Tab.Screen
        name="cancelHistory"
        component={cancelHistory}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <IconMaterialCommunityIcons
                size={30}
                name={'file-cancel-outline'}
                color={color}
              />

              <Text
                style={{
                  color: focused ? '#00A3FE' : '#7A7C80',
                  fontSize: 12,
                }}>
                Cancel
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Account"
        component={accountScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <IconAntDesign size={26} name={'user'} color={color} />
              <Text
                style={{
                  color: focused ? '#00A3FE' : '#7A7C80',
                  fontSize: 12,
                }}>
                Account
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabScreen;
