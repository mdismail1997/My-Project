import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  AspectRatio,
  Center,
  Image,
  ScrollView,
  Skeleton,
  Text,
  View,
  VStack,
} from 'native-base';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { SubscriptionCard } from '../components/SubscriptionCard';
import {
  RadioButton,
  RadioButtonItem,
  RadioButtonProps,
} from '../components/RadioButton';
import { RootStackParamList } from '../types';
import { ImageViewerModal } from 'react-native-advance-components';
import { AudioTab } from '../components/AudioTab';
import { PodcastTab } from '../components/PodcastTab';
import { VideoTab } from '../components/VideoTab';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { appTheme } from '../colorScheme';
import { getTrainingSessionByID } from '../api/auth';
import { getAssetURLFromPath } from '../utils/utility';

type FileType = 'podcast' | 'audio' | 'video' | 'doc';

const generateTabs = (type?: string) => {
  const updatedType = type?.toLowerCase();
  switch (updatedType) {
    case 'audio':
      return (
        <RadioButtonItem
          style={styles.radioBtnItem}
          value="audio"
          render={() => (
            <Center>
              <Text>AUDIO FILE</Text>
            </Center>
          )}
        />
      );
    case 'podcast':
      return (
        <RadioButtonItem
          style={styles.radioBtnItem}
          value="audio"
          render={() => (
            <Center>
              <Text>AUDIO FILE</Text>
            </Center>
          )}
        />
      );
    case 'video':
      return (
        <RadioButtonItem
          style={styles.radioBtnItem}
          value="video"
          render={() => (
            <Center>
              <Text>VIDEO FILE</Text>
            </Center>
          )}
        />
      );

    default:
      return <></>;
  }
};

export const DetailsScreen = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { params } = useRoute<RouteProp<RootStackParamList, 'DetailsScreen'>>();

  const [selectContent, setSelectContent] = useState<FileType>('podcast');
  const [isReInitialize, setIsReInitialize] = useState(true);
  const [trainingDetails, setTrainingDetails] = useState<typeof params>({
    id: '',
    name: undefined,
    imageURL: undefined,
    description: undefined,
    fileType: undefined,
    file: undefined,
  });
  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });

  useEffect(() => {
    setTrainingDetails(params);
  }, [params]);

  // ########## Handling deep linking url #############
  const fetchTrainingByID = useCallback(
    async (id: string) => {
      try {
        const response = await getTrainingSessionByID(id);
        setTrainingDetails({
          id: response.data.data._id,
          description:
            response.data.data.lang[globalState.language].description,
          file: response.data.data.lang[globalState.language].file,
          fileType: response.data.data.type,
          imageURL: getAssetURLFromPath(response.data.data.trainingImage.path),
          name: response.data.data.lang[globalState.language].title,
        });
      } catch (error: any) {
        setShowAlert({
          isShowing: true,
          message: error.response.data.msg,
          status: 'error',
        });
      }
    },
    [globalState.language]
  );

  useEffect(() => {
    if (params.name === undefined && params.description === undefined) {
      fetchTrainingByID(params.id);
      if (params?.tab) {
        setSelectContent(params.tab as FileType);
        setIsReInitialize(false);
      }
    }
  }, [
    fetchTrainingByID,
    params.description,
    params.id,
    params.name,
    params?.tab,
  ]);

  // ########## End of handling deep linking url #############

  const handleChange: RadioButtonProps['onChange'] = (value) => {
    setSelectContent(value as FileType);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4} m="4">
          <AspectRatio w="100%" ratio={7 / 4}>
            {trainingDetails.imageURL ? (
              <ImageViewerModal>
                <Image
                  width="100%"
                  height="100%"
                  alt="horse"
                  source={{ uri: trainingDetails.imageURL }}
                />
              </ImageViewerModal>
            ) : (
              <Skeleton height="100%" />
            )}
          </AspectRatio>
          {['Audio', 'Video', 'Podcast'].includes(
            trainingDetails.fileType ?? ''
          ) && (
            <Center>
              <RadioButton
                value={selectContent}
                onChange={handleChange}
                itemAlign="row"
              >
                <RadioButtonItem
                  style={styles.radioBtnItem}
                  value="podcast"
                  render={() => (
                    <Center>
                      <Text>PODCAST</Text>
                    </Center>
                  )}
                />
                {generateTabs(trainingDetails.fileType)}
              </RadioButton>
            </Center>
          )}
          <SubscriptionCard />
          {selectContent === 'podcast' && (
            <PodcastTab
              title={trainingDetails.name ?? ''}
              description={trainingDetails.description ?? ''}
            />
          )}
          {selectContent === 'audio' && (
            <AudioTab
              id={trainingDetails.id}
              file={trainingDetails.file}
              audioArtWork={trainingDetails.imageURL}
              reInitialize={isReInitialize}
            />
          )}
          {selectContent === 'video' && (
            <VideoTab id={trainingDetails.id} file={trainingDetails.file} />
          )}
        </VStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  radioBtnItem: {
    borderRadius: 30,
    width: 150,
  },
});
