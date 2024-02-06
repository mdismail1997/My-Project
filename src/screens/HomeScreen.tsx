import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  RefreshControl,
} from 'react-native';
import {
  ScrollView,
  HStack,
  View,
  VStack,
  Text,
  Box,
  Spacer,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CardRow } from '../components/CardRow';
import { trainingColorScheme } from '../utils/constants';
import { Chip } from '../components/Chip';
import { ImageCard } from '../components/ImageCard';
import { BackgroundKnowledgeCard } from '../components/BackgroundKnowledgeCard';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';
import { globalStyle } from '../utils/globalStyles';
import { appTheme } from '../colorScheme';
import { getTrainingSessions } from '../api/auth';
import { getAssetURLFromPath } from '../utils/utility';
import { CardSkeleton, SkeletonScrollView } from '../components/skeleton';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchUserDetails } from '../redux';

const chipData = ['Volte', 'A dressage', 'Detachment', 'A1', 'Replacement'];

export function HomeScreen() {
  const globalState = useSelector<
    CombineReducersType,
    {
      colorScheme: ColorScheme;
      language: InitialAppStateType['appLanguage'];
      favoiteTrainings: InitialUserDetailsType['userData']['favoriteTrainings'];
      playlist: Record<
        string,
        [
          {
            [key: string]: unknown;
          }
        ]
      >;
    }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
    favoiteTrainings: state.userDetails.userData.favoriteTrainings,
    playlist: state.userDetails.userData.playlist,
  }));
  const { t } = useTranslation();
  const dispatch =
    useDispatch<ThunkDispatch<InitialUserDetailsType, unknown, AnyAction>>();

  const [dimentation, setDimentation] = useState(Dimensions.get('window'));
  const [refreshing, setRefreshing] = useState(false);
  const [libraryData, setLibraryData] = useState<Record<string, unknown>[]>([]);
  const [selectedValue, setSelectedValue] = useState(chipData[0]);
  const [mappedData, setMappedData] = useState<Record<string, any>>();
  const [homeScreenData, setHomeScreenData] = useState({
    lastHeard: [],
    goodToKnow: [],
  });

  useEffect(() => {
    const emitterSubscription = Dimensions.addEventListener(
      'change',
      ({ window }) => {
        setDimentation(window);
      }
    );

    return () => {
      emitterSubscription.remove();
    };
  }, []);

  const fetchHomeScreenData = async () => {
    try {
      const response = await getTrainingSessions();
      const output = response.data.data.reduce(
        (acc: any, cur: any) => ({ ...acc, [cur._id]: cur }),
        {}
      );
      setMappedData(output);
      setHomeScreenData((prevData) => ({
        ...prevData,
        lastHeard: response.data.data.reverse(),
        goodToKnow: response.data.data
          ?.filter((el: { section: string }) => el.section === '5')
          .reverse(),
      }));
    } catch (error) {}
  };

  useEffect(() => {
    fetchHomeScreenData();
  }, []);

  useEffect(() => {
    const output = Object.keys(globalState.playlist ?? {})?.flatMap(
      (el) => globalState.playlist[el]
    );
    setLibraryData(output);
  }, [globalState.playlist]);

  const fetchFevTrainings = useCallback(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    fetchFevTrainings();
  }, [fetchFevTrainings]);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchFevTrainings();
    setHomeScreenData({
      lastHeard: [],
      goodToKnow: [],
    });
    await fetchHomeScreenData();
    setRefreshing(false);
  };

  const handlePress = (event: GestureResponderEvent, value: string) => {
    setSelectedValue(value);
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor="grey"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <VStack m={1} space={4}>
          <Spacer />
          <Text style={globalStyle.headingStyle}>{t('Library')}</Text>
          <HStack flexWrap={'wrap'}>
            {mappedData &&
              libraryData.map((el, i) => (
                <View key={i} mr={i % 2 === 0 ? 1 : undefined} mb={1}>
                  <CardRow
                    id={mappedData?.[el.id as string]['_id']}
                    imageURL={getAssetURLFromPath(
                      mappedData?.[el.id as string]['trainingImage']['path']
                    )}
                    title={
                      mappedData?.[el.id as string]['lang'][
                        globalState.language
                      ]['title']
                    }
                    description={
                      mappedData?.[el.id as string]['lang'][
                        globalState.language
                      ]['description']
                    }
                    shortDescription={
                      mappedData?.[el.id as string]['lang'][
                        globalState.language
                      ]['shortDescription']
                    }
                    width={dimentation.width / 2 - 7}
                  />
                </View>
              ))}
          </HStack>
          <Text style={globalStyle.headingStyle}>{t('Choose')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {chipData.map((el, i) => (
              <Chip
                key={i}
                title={el}
                value={el}
                onPress={handlePress}
                selected={selectedValue}
              />
            ))}
          </ScrollView>
          <Text style={globalStyle.headingStyle}>{t('Lectures for you')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {homeScreenData.lastHeard.length !== 0 ? (
              homeScreenData.lastHeard.map((el, i) => (
                <View
                  key={i}
                  mr={i !== homeScreenData.lastHeard.length - 1 ? 2 : undefined}
                >
                  <ImageCard
                    id={el['_id']}
                    title={el['lang'][globalState.language]['title']}
                    shortDescription={
                      el['lang'][globalState.language]['shortDescription']
                    }
                    imageURL={getAssetURLFromPath(el['trainingImage']['path'])}
                    description={
                      el['lang'][globalState.language]['description']
                    }
                    alt={el['trainingImage']['fileName']}
                    fileType={el['type']}
                    file={el['lang'][globalState.language]['file']}
                    bgColor={trainingColorScheme[el['section']]}
                    isFavorite={globalState.favoiteTrainings?.includes(
                      el['_id']
                    )}
                  />
                </View>
              ))
            ) : (
              <SkeletonScrollView count={2}>
                <CardSkeleton />
              </SkeletonScrollView>
            )}
          </ScrollView>
          <Text style={globalStyle.headingStyle}>
            {t('Some interesting for you')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {homeScreenData.lastHeard.length !== 0 ? (
              [...homeScreenData.lastHeard].reverse().map((el, i) => (
                <View
                  key={i}
                  mr={i !== homeScreenData.lastHeard.length - 1 ? 2 : undefined}
                >
                  <ImageCard
                    id={el['_id']}
                    title={el['lang'][globalState.language]['title']}
                    shortDescription={
                      el['lang'][globalState.language]['shortDescription']
                    }
                    imageURL={getAssetURLFromPath(el['trainingImage']['path'])}
                    description={
                      el['lang'][globalState.language]['description']
                    }
                    alt={el['trainingImage']['fileName']}
                    fileType={el['type']}
                    file={el['lang'][globalState.language]['file']}
                    bgColor={trainingColorScheme[el['section']]}
                    isFavorite={globalState.favoiteTrainings?.includes(
                      el['_id']
                    )}
                  />
                </View>
              ))
            ) : (
              <SkeletonScrollView count={2}>
                <CardSkeleton />
              </SkeletonScrollView>
            )}
          </ScrollView>
          <Box>
            <Text style={globalStyle.headingStyle}>{t('Last heard')}</Text>
            <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.{' '}
            </Text>
          </Box>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {homeScreenData.lastHeard.length !== 0 ? (
              homeScreenData.lastHeard.map((el, i) => (
                <View
                  key={i}
                  mr={i !== homeScreenData.lastHeard.length - 1 ? 2 : undefined}
                >
                  <ImageCard
                    id={el['_id']}
                    title={el['lang'][globalState.language]['title']}
                    shortDescription={
                      el['lang'][globalState.language]['shortDescription']
                    }
                    imageURL={getAssetURLFromPath(el['trainingImage']['path'])}
                    description={
                      el['lang'][globalState.language]['description']
                    }
                    alt={el['trainingImage']['fileName']}
                    fileType={el['type']}
                    file={el['lang'][globalState.language]['file']}
                    bgColor={trainingColorScheme[el['section']]}
                    isFavorite={globalState.favoiteTrainings?.includes(
                      el['_id']
                    )}
                  />
                </View>
              ))
            ) : (
              <SkeletonScrollView count={2}>
                <CardSkeleton />
              </SkeletonScrollView>
            )}
          </ScrollView>
          <Text style={globalStyle.headingStyle}>{t('Good to know')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {homeScreenData.lastHeard.length !== 0 ? (
              homeScreenData.goodToKnow.map((el, i) => (
                <View key={i} mr={i !== libraryData.length - 1 ? 2 : undefined}>
                  <ImageCard
                    id={el['_id']}
                    title={el['lang'][globalState.language]['title']}
                    shortDescription={
                      el['lang'][globalState.language]['shortDescription']
                    }
                    imageURL={getAssetURLFromPath(el['trainingImage']['path'])}
                    description={
                      el['lang'][globalState.language]['description']
                    }
                    isFavorite={globalState.favoiteTrainings?.includes(
                      el['_id']
                    )}
                  />
                </View>
              ))
            ) : (
              <SkeletonScrollView count={2}>
                <CardSkeleton />
              </SkeletonScrollView>
            )}
          </ScrollView>
          <Text style={globalStyle.headingStyle}>
            {t('Background knowledge')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {homeScreenData.lastHeard.length !== 0 &&
              homeScreenData.lastHeard
                .filter((el: { section: string }) => el?.section === '4')
                .map((el, i) => (
                  <View
                    key={i}
                    mr={i !== libraryData.length - 1 ? 2 : undefined}
                  >
                    <BackgroundKnowledgeCard
                      id={el['_id']}
                      title={el['lang'][globalState.language]['title']}
                      imageURL={getAssetURLFromPath(
                        el['trainingImage']['path']
                      )}
                      description={
                        el['lang'][globalState.language]['shortDescription']
                      }
                    />
                  </View>
                ))}
          </ScrollView>
          <Spacer />
        </VStack>
      </ScrollView>
    </View>
  );
}
