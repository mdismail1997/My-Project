import { Center, HStack } from 'native-base';
import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import { appTheme } from '../colorScheme';
import { ColorScheme, CombineReducersType } from '../models';
import { assetImages } from '../utils/assets';

export function LoadingScreen() {
  const colorScheme = useSelector<CombineReducersType, ColorScheme>(
    (state) => state.appDetails.colorScheme
  );
  return (
    <HStack
      height="full"
      space={2}
      justifyContent="center"
      alignItems="center"
      backgroundColor={appTheme[colorScheme].colors.background}
    >
      <Center>
        <Image source={assetImages.Loading} />
      </Center>
    </HStack>
  );
}
