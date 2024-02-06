import React, { useEffect } from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  View,
  Avatar,
  Heading,
  Text,
  Stack,
  Divider,
  ScrollView,
  Pressable,
  Spacer,
} from 'native-base';
import FeatherIcon from 'react-native-vector-icons/Feather';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux';
import type { RootStackParamList, RootTabParamList } from '../../types';
import { getUser } from '../../api/auth';
import { deleteUserToken } from '../../storage';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../../models';
import { useTranslation } from 'react-i18next';
import { getImageURL } from '../../utils/utility';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const globalState = useSelector<
    CombineReducersType,
    {
      colorScheme: ColorScheme;
      language: InitialAppStateType['appLanguage'];
      userData: InitialUserDetailsType['userData'];
    }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
    userData: state.userDetails.userData,
  }));
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & RootTabParamList>>();
  const { t } = useTranslation();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await getUser();
        console.log(response.data);
        dispatch(
          setUserData({
            ...globalState.userData,
            ...response.data.data,
            photo: response.data.data.photo
              ? getImageURL(response.data.data.photo)
              : undefined,
          })
        );
      } catch (error) {}
    };
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DrawerContentScrollView {...props}>
          <Stack space={2} m="1">
            <View>
              <Pressable
                onPress={() => {
                  navigation.navigate('Profile');
                }}
              >
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <Avatar
                    source={{
                      uri: globalState.userData?.photo,
                    }}
                    size={50}
                  >
                    {globalState.userData?.fullName?.charAt(0)}
                  </Avatar>
                  <View
                    style={{
                      width: 210,
                      marginLeft: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <Heading isTruncated>
                      {globalState.userData?.fullName}
                    </Heading>
                    <Text isTruncated>{globalState.userData?.email}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
            <Spacer />
            <Divider />
            <DrawerItemList {...props} />
            <Divider />
            <DrawerItem
              icon={({ color, size }) => (
                <FeatherIcon name="log-out" color={color} size={size} />
              )}
              label={t('Logout')}
              onPress={async () => {
                await deleteUserToken();
                navigation.dispatch(StackActions.replace('LogIn'));
              }}
            />
          </Stack>
        </DrawerContentScrollView>
      </ScrollView>
    </View>
  );
};
