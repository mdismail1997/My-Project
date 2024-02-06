import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Stack,
  Switch,
  Box,
  Avatar,
  Pressable,
} from 'native-base';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { colorMap } from '../utils/constants';
import { appTheme } from '../colorScheme';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SettingStackParams } from '../types';

export const SettingScreen = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const navigation = useNavigation<DrawerNavigationProp<SettingStackParams>>();
  const { t } = useTranslation();

  const [switchState, setSwitchState] = useState({ pushNotification: false });

  const toggleSwitch = (key: keyof typeof switchState) => {
    setSwitchState((prevData) => ({
      ...prevData,
      [key]: !prevData[key],
    }));
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack margin="4" space="2">
          <Box
            rounded="lg"
            borderWidth="1"
            padding="3"
            borderColor="coolGray.300"
            _dark={{
              borderColor: 'coolGray.600',
            }}
          >
            <Pressable onPress={() => toggleSwitch('pushNotification')}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text>{t('Push notification')}</Text>
                <Switch
                  size="md"
                  isChecked={switchState.pushNotification}
                  onToggle={() => toggleSwitch('pushNotification')}
                />
              </Stack>
            </Pressable>
          </Box>
          <Pressable
            onPress={() => {
              navigation.navigate('ChooseTheme');
            }}
          >
            {({ isPressed }) => (
              <Box
                rounded="lg"
                borderWidth="1"
                padding="3"
                borderColor="coolGray.300"
                _dark={{
                  borderColor: 'coolGray.600',
                }}
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.96 : 1,
                    },
                  ],
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text>{t('Choose theme')}</Text>
                  <Avatar
                    size="sm"
                    bg={colorMap[globalState.colorScheme]}
                    borderWidth="1"
                    borderColor="coolGray.300"
                    _dark={{
                      borderColor: 'coolGray.600',
                    }}
                  />
                </Stack>
              </Box>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('ChooseLanguage');
            }}
          >
            {({ isPressed }) => (
              <Box
                rounded="lg"
                borderWidth="1"
                padding="3"
                borderColor="coolGray.300"
                _dark={{
                  borderColor: 'coolGray.600',
                }}
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.96 : 1,
                    },
                  ],
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text>{t('Choose language')}</Text>
                  <Avatar
                    size="sm"
                    bg={appTheme[globalState.colorScheme].colors.background}
                    borderWidth="1"
                    borderColor="coolGray.300"
                    _dark={{
                      borderColor: 'coolGray.600',
                    }}
                    _text={{
                      color: appTheme[globalState.colorScheme].colors.text,
                    }}
                  >
                    {globalState.language.toUpperCase()}
                  </Avatar>
                </Stack>
              </Box>
            )}
          </Pressable>
        </Stack>
      </ScrollView>
    </View>
  );
};
