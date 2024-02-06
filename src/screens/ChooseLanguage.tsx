import React from 'react';
import { View, ScrollView, Pressable, Box, Stack, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { appTheme } from '../colorScheme';
import { setDataIntoStorage } from '../storage';
import { EQUIPRO_SELECTED_LANGUAGE } from '../utils/constants';
import { setAppLanguage } from '../redux';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';

const languageList = [
  {
    id: 'en',
    name: 'English',
    value: 'en',
  },
  {
    id: 'de',
    name: 'German',
    value: 'de',
  },
];

export const ChooseLanguage = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleChooseTheme = async (
    selectedLanguage: InitialAppStateType['appLanguage']
  ) => {
    i18n.changeLanguage(selectedLanguage);
    dispatch(setAppLanguage(selectedLanguage));
    await setDataIntoStorage(EQUIPRO_SELECTED_LANGUAGE, selectedLanguage);
    navigation.goBack();
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack margin="4" space="2">
          {languageList.map((el, index) => (
            <Pressable
              key={index}
              onPress={() =>
                handleChooseTheme(
                  el.value as InitialAppStateType['appLanguage']
                )
              }
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
                    <Text
                      textTransform="uppercase"
                      color={appTheme[globalState.colorScheme].colors.text}
                    >
                      {t(el.name)}
                    </Text>
                    {globalState.language === el.value && (
                      <EntypoIcons
                        name="check"
                        color={appTheme[globalState.colorScheme].colors.text}
                        size={26}
                      />
                    )}
                  </Stack>
                </Box>
              )}
            </Pressable>
          ))}
        </Stack>
      </ScrollView>
    </View>
  );
};
