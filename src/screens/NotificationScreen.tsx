import React from 'react';
import { ScrollView, Stack, View } from 'native-base';
import { useSelector } from 'react-redux';
import { NotificationCard } from '../components/NotificationCard';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { appTheme } from '../colorScheme';

const notificationData = [
  {
    en: {
      title: 'New training content added.',
      description: 'Check out our new Training in training section.',
      time: Date.now(),
    },
    de: {
      title: 'Neue Trainingsinhalte hinzugefügt.',
      description:
        'Sehen Sie sich unsere neue Schulung im Schulungsbereich an.',
      time: Date.now(),
    },
  },
];

export const NotificationScreen = () => {
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
        <Stack m={4} space={2}>
          {notificationData.map((el, i) => (
            <NotificationCard
              key={i}
              title={el[globalState.language].title}
              time={el[globalState.language].time}
              description={el[globalState.language].description}
            />
          ))}
        </Stack>
      </ScrollView>
    </View>
  );
};
