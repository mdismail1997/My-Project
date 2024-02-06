import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import {
  Box,
  Button,
  Center,
  ScrollView,
  Stack,
  Text,
  View,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { useSelector } from 'react-redux';
import { appTheme } from '../colorScheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RootDrawerParamList } from '../types';

const SubscriptionData = {
  en: [
    'Digital riding lessons, tailored to your needs.',
    'Good dressage exercises: From young horses to Grand Prix level.',
    'Learn to ride the lessons correctly and understand their value for your training.',
    'Learn to use your training sessions in a more targeted manner and to distinguish between the important and the unimportant.',
    'Including important additional information & much more',
  ],
  de: [
    'Digitaler Reitunterricht, auf Deine Bedürfnisse zugeschnitten.',
    'Gutes Dressurreiten: Vom jungen Pferd bis zum Grand Prix Niveau.',
    'Lerne die Lektionen richtig zu reiten und Wert zu verstehen.',
    'Lerne Deine Trainingseinheiten gezielter zu nutzen und wichtiges von unwichtigem zu unterscheiden.',
    'Inklusive wichtiger Zusatzinfos & vieles mehr.',
  ],
};

export const SubscriptionScreen = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList & RootDrawerParamList>
    >();

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <Stack space={4} m={4}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Discover EquiPro
            </Text>
            <Text fontSize="xl">You Coach for better riding</Text>
          </Box>
          <Stack space={2}>
            {SubscriptionData[globalState.language].map((el, index) => (
              <Stack direction="row" key={index} space="3">
                <Text>&#10003;</Text>
                <Text flex={1}>{el}</Text>
              </Stack>
            ))}
          </Stack>
          {/* <Stack space={2}>
            <Center>
              <Text>Try 5 days for free!</Text>
            </Center>
            <Center>
              <Text sub>
                After the 5-day free trial, your 12 month membership will
                auto-renew a charge of 19 CHF/ Month unless cancelled.
              </Text>
            </Center>
          </Stack> */}
          <Center>
            <Button
              colorScheme="blue"
              borderRadius={30}
              size="full"
              height={10}
              style={{ margin: 10 }}
              onPress={() => {
                Linking.openURL(
                 'https://nodeserver.mydevfactory.com/projects/tulika/Soumen/equipro/equipro-web/#/Subscription'
                );
              }}
            >
              BUY PRO
            </Button>
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              variant="link"
              onPress={() => {
                navigation.goBack();
              }}
            >
              CONTINUE WITHOUT PRO
            </Button>
          </Center>
        </Stack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
