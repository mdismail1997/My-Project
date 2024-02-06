import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, View, VStack, Text, Divider } from 'native-base';
import { useSelector } from 'react-redux';
import { ImageCard } from '../components/ImageCard';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';
import { globalStyle } from '../utils/globalStyles';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { getTrainingSessions, getTrainingTitle } from '../api/auth';
import { CardSkeleton, SkeletonScrollView } from '../components/skeleton';
import { getAssetURLFromPath } from '../utils/utility';
import { appTheme } from '../colorScheme';
import { trainingColorScheme } from '../utils/constants';

export function TrainingScreen() {
  const globalState = useSelector<
    CombineReducersType,
    {
      colorScheme: ColorScheme;
      language: InitialAppStateType['appLanguage'];
      favoiteTrainings: InitialUserDetailsType['userData']['favoriteTrainings'];
    }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
    favoiteTrainings: state.userDetails.userData.favoriteTrainings,
  }));

  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });
  const [trainingTitle, setTrainingTitle] = useState();
  const [trainingData1O, setTrainingData1O] = useState<Record<string, any>[]>(
    []
  );
  const [trainingData1A, setTrainingData1A] = useState<Record<string, any>[]>(
    []
  );
  const [trainingData1B, setTrainingData1B] = useState<Record<string, any>[]>(
    []
  );
  const [trainingData2, setTrainingData2] = useState<Record<string, any>[]>([]);
  const [trainingData3, setTrainingData3] = useState<Record<string, any>[]>([]);
  const [trainingData4, setTrainingData4] = useState<Record<string, any>[]>([]);
  const [trainingData5, setTrainingData5] = useState<Record<string, any>[]>([]);
  const [trainingData6, setTrainingData6] = useState<Record<string, any>[]>([]);
  const [trainingData7, setTrainingData7] = useState<Record<string, any>[]>([]);
  const [trainingData8, setTrainingData8] = useState<Record<string, any>[]>([]);

  const getTrainingsData = async () => {
    try {
      const response = await getTrainingSessions();
      const trainingExtra = await getTrainingTitle();
      setTrainingTitle(trainingExtra.data.data);
      const outputData = response.data?.data.reduce(
        (acc: Record<string, any>, cur: Record<string, any>) => ({
          ...acc,
          [cur.section]: [...(acc[cur.section] ?? []), cur],
        }),
        {}
      );
      console.log(outputData);
      setTrainingData1O(outputData['1O']);
      setTrainingData1A(outputData['1A']);
      setTrainingData1B(outputData['1B']);
      setTrainingData2(outputData['2']);
      setTrainingData3(outputData['3']);
      setTrainingData4(outputData['4']);
      setTrainingData5(outputData['5']);
      setTrainingData6(outputData['6']);
      setTrainingData7(outputData['7']);
      setTrainingData8(outputData['8']);
    } catch (error: any) {
      setShowAlert({
        isShowing: true,
        message: error.response.data.msg,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getTrainingsData();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setTrainingTitle(undefined);
      setTrainingData1O([]);
      setTrainingData1A([]);
      setTrainingData1B([]);
      setTrainingData2([]);
      setTrainingData3([]);
      setTrainingData4([]);
      setTrainingData5([]);
      setTrainingData6([]);
      setTrainingData7([]);
      setTrainingData8([]);
      await getTrainingsData();
      setRefreshing(false);
    } catch (error: any) {
      setShowAlert({
        isShowing: true,
        message: error.response.data.msg,
        status: 'error',
      });
    }
  };

  const handleModalClose = () => {
    setShowAlert((prevData) => ({ ...prevData, isShowing: false }));
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <DropdownAlert
        isVisible={showAlert.isShowing}
        status={showAlert.status}
        message={showAlert.message}
        autoClose
        onClose={handleModalClose}
      />
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
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section1OTitle']}{' '}
            {trainingTitle?.[globalState.language]['section1OCode']}
          </Text>
          {trainingData1O.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['1O']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData1O.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData1O.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section1ATitle']}{' '}
            {trainingTitle?.[globalState.language]['section1ACode']}
          </Text>
          {trainingData1A.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['1A']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData1A.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData1A.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section1BTitle']}{' '}
            {trainingTitle?.[globalState.language]['section1BCode']}
          </Text>
          {trainingData1B.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['1B']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData1B.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData1B.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section2Title']}{' '}
            {trainingTitle?.[globalState.language]['section2Code']}
          </Text>
          {trainingData2.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['2']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData2.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData2.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section3Title']}{' '}
            {trainingTitle?.[globalState.language]['section3Code']}
          </Text>
          {trainingData3.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['3']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData3.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData3.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section4Title']}{' '}
            {trainingTitle?.[globalState.language]['section4Code']}
          </Text>
          {trainingData4.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['4']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData4.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData4.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section5Title']}{' '}
            {trainingTitle?.[globalState.language]['section5Code']}
          </Text>
          {trainingData5.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['5']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData5.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData5.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section6Title']}{' '}
            {trainingTitle?.[globalState.language]['section6Code']}
          </Text>
          {trainingData6.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['6']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData6.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData6.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section7Title']}{' '}
            {trainingTitle?.[globalState.language]['section7Code']}
          </Text>
          {trainingData7.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['7']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData7.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData7.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
          <Text style={globalStyle.headingStyle}>
            {trainingTitle?.[globalState.language]['section8Title']}{' '}
            {trainingTitle?.[globalState.language]['section8Code']}
          </Text>
          {trainingData8.length > 0 ? (
            <>
              <Divider backgroundColor={trainingColorScheme['8']} height="1" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainingData8.map((el, i) => (
                  <View
                    key={i}
                    mr={i !== trainingData8.length - 1 ? 2 : undefined}
                  >
                    <ImageCard
                      id={el._id}
                      title={el.lang[globalState.language].title}
                      shortDescription={
                        el.lang[globalState.language].shortDescription
                      }
                      description={el.lang[globalState.language].description}
                      imageURL={getAssetURLFromPath(el.trainingImage.path)}
                      alt={el.trainingImage.fileName}
                      fileType={el.type}
                      file={el.lang[globalState.language].file}
                      bgColor={trainingColorScheme[el.section]}
                      isFavorite={globalState.favoiteTrainings.includes(el._id)}
                      locked={
                        el.lang[globalState.language].offerType !== 'free'
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <SkeletonScrollView count={2}>
              <CardSkeleton />
            </SkeletonScrollView>
          )}
        </VStack>
      </ScrollView>
    </View>
  );
}
