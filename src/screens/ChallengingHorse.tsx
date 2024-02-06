import React from 'react';
import { ScrollView, Text, View } from 'native-base';
import { useSelector } from 'react-redux';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { appTheme } from '../colorScheme';

export const ChallengingHorse = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>ChallengingHorse</Text>
      </ScrollView>
    </View>
  );
};
