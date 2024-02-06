import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Center, ScrollView, Spinner, Stack, Text, View } from 'native-base';
import { useSelector } from 'react-redux';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { appTheme } from '../colorScheme';
import { getFavoriteTraining, getTrainingSessions } from '../api/auth';
import { FabCard } from '../components/FabCard';
import { getAssetURLFromPath } from '../utils/utility';

export const FavouriteList = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { width } = useWindowDimensions();

  const [fevList, setFevList] = useState<Record<string, any>[]>();

  const getFavouriteList = async () => {
    try {
      const allTrainingRes: Record<string, any> = await getTrainingSessions();
      const response: Record<string, any> = await getFavoriteTraining();
      const myFavList = allTrainingRes.data.data.filter((el: any) =>
        response.data.data?.includes(el._id)
      );
      setFevList(myFavList);
      console.log('============>', response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFavouriteList();
  }, []);

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack m="2">
          {!fevList ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : fevList.length < 1 ? (
            <Center>
              <Text>No data found.</Text>
            </Center>
          ) : (
            fevList.map((el, index) => (
              <View key={index} mr={index % 2 === 0 ? 1 : undefined} mb={1}>
                <FabCard
                  id={el._id}
                  title={el.lang[globalState.language].title}
                  shortDescription={
                    el.lang[globalState.language].shortDescription
                  }
                  description={el.lang[globalState.language].description}
                  imageURL={getAssetURLFromPath(el.trainingImage.path)}
                  width={width - 25}
                />
              </View>
            ))
          )}
        </Stack>
      </ScrollView>
    </View>
  );
};
