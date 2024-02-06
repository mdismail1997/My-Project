import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Center,
  HStack,
  Image,
  ScrollView,
  Spacer,
  Text,
  View,
  VStack,
} from 'native-base';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { assetImages } from '../utils/assets';
import { useTheme } from '@react-navigation/native';
import { appTheme } from '../colorScheme';

const EquiProfessionData = [
  'EquiPro helps you train lessons from the beginning to the high school lessons. Even without a trainer on site!',
  ' Benefit from tried-and-tested lesson sequences - no more aimless riding on the train!',
  'Gain extensive knowledge from the collected works of horsemanship.',
  'EquiPro shows you how you can complete your daily training from the point of view of keeping your horse healthy.',
  'Depending on the level of training of your horse, you can listen to the appropriate audio file for the solution phase while riding, as if your trainer were there.',
  "All lessons and milestones of the training are available as audio files for your training. Just like the right tools if something doesn't work.",
  'Find out everything about systematic training of your horse.',
];

export const EquiProfession = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { colors } = useTheme();

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <VStack space="6" mx={2}>
          <Center>
            <Image
              source={assetImages[`logo-${globalState.colorScheme}`]}
              alt="EquiPro"
              size="lg"
              resizeMode="contain"
            />
          </Center>
          <VStack space={2}>
            {EquiProfessionData.map((el, i) => (
              <HStack space={2} key={i}>
                <MaterialCommunityIcons
                  name="bookmark-box-multiple-outline"
                  size={26}
                  color={colors.text}
                />
                <Text flex={1}>{el}</Text>
              </HStack>
            ))}
          </VStack>
          <Center>
            <HStack marginX="5" space="5">
              <Button colorScheme="blue" borderRadius={30} flex={1}>
                PREVIEW
              </Button>
              <Button colorScheme="blue" borderRadius={30} flex={1}>
                CONTINUE
              </Button>
            </HStack>
          </Center>
          <Spacer />
        </VStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
