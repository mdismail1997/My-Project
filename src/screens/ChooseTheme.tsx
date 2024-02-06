import React from 'react';
import { View, ScrollView, Pressable, Box, Stack, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import { appTheme } from '../colorScheme';
import { setDataIntoStorage } from '../storage';
import { THEME_PERSISTENCE_KEY } from '../utils/constants';
import { setAppTheme } from '../redux';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';

export const ChooseTheme = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleChooseTheme = async (selectedTheme: ColorScheme) => {
    await setDataIntoStorage(THEME_PERSISTENCE_KEY, selectedTheme);
    dispatch(setAppTheme(selectedTheme));
    navigation.goBack();
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack margin="4" space="2">
          {Object.keys(appTheme).map((el, index) => (
            <Pressable
              key={index}
              onPress={() => handleChooseTheme(el as ColorScheme)}
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
                  backgroundColor={
                    appTheme[el as ColorScheme].colors.background
                  }
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      textTransform="capitalize"
                      color={appTheme[el as ColorScheme].colors.text}
                    >
                      {t(el)}
                    </Text>
                    {globalState.colorScheme === el && (
                      <EntypoIcons
                        name="check"
                        color={appTheme[el as ColorScheme].colors.text}
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
