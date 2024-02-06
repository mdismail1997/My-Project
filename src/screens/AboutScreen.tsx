import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Image, ScrollView, Skeleton, Stack, Text, View } from 'native-base';
import { useSelector } from 'react-redux';
import RenderHTML from 'react-native-render-html';
import { t } from 'i18next';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { getCmsAboutUsPage } from '../api/auth';
import { getImageURL } from '../utils/utility';
import { tagsStyles, baseStyles, systemFonts } from '../utils/globalStyles';
import { AboutCard } from '../components/AboutCard';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { appTheme } from '../colorScheme';
import { ImageViewerModal } from 'react-native-advance-components';

export const AboutScreen = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { width } = useWindowDimensions();

  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });
  const [aboutUsMultiLanguageData, setAboutUsMultiLanguageData] =
    useState<Record<string, Record<string, any>>>();
  const [aboutUsData, setAboutUsData] =
    useState<Record<string, Record<string, any>>>();
  const [isDescriptionCollapse, setIsDescriptionCollapse] = useState<
    Record<string, boolean>
  >({ main1: true, main2: true, main3: true });

  const getAboutUsContent = async () => {
    try {
      const response = await getCmsAboutUsPage();
      setAboutUsMultiLanguageData(response.data.data);
    } catch (error: any) {
      setShowAlert({
        isShowing: true,
        message: error.response.data.msg,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getAboutUsContent();
  }, []);

  useEffect(() => {
    setAboutUsData(aboutUsMultiLanguageData?.[globalState.language]);
  }, [aboutUsMultiLanguageData, globalState.language]);

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
      {aboutUsData ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Stack m="4" space="2">
            <Stack>
              <ImageViewerModal>
                <Image
                  source={{
                    uri: getImageURL(aboutUsData.header.image),
                  }}
                  alt={aboutUsData.header.image}
                  width="full"
                  height="32"
                />
              </ImageViewerModal>
              <Text fontSize="xs">{aboutUsData.header.subtitle}</Text>
              <Text fontSize="lg">{aboutUsData.header.title}</Text>
              <Text>{aboutUsData.header.shortDescription}</Text>
            </Stack>
            <Stack>
              <Text fontSize="lg">{aboutUsData.main1.title}</Text>
              <ImageViewerModal>
                <Image
                  source={{
                    uri: getImageURL(aboutUsData.main1.image),
                  }}
                  resizeMode="cover"
                  alt={aboutUsData.main1.image}
                  width="full"
                  height="32"
                />
              </ImageViewerModal>
              <Text textAlign="justify">
                {aboutUsData.main1.description.slice(
                  0,
                  isDescriptionCollapse?.['main1'] ? 150 : undefined
                )}
                {isDescriptionCollapse?.['main1'] && (
                  <Text
                    bold
                    onPress={() =>
                      setIsDescriptionCollapse((prevData) => ({
                        ...prevData,
                        main1: false,
                      }))
                    }
                  >
                    ... {t('Read more')}
                  </Text>
                )}
                {!isDescriptionCollapse?.['main1'] && (
                  <Text
                    bold
                    onPress={() =>
                      setIsDescriptionCollapse((prevData) => ({
                        ...prevData,
                        main1: true,
                      }))
                    }
                  >
                    ... {t('Read less')}
                  </Text>
                )}
              </Text>
            </Stack>
            <Stack>
              <Text fontSize="lg">{aboutUsData.footer2.title}</Text>
              <Image
                source={{
                  uri: getImageURL(aboutUsData.footer2.image),
                }}
                resizeMode="cover"
                rounded="full"
                alt={aboutUsData.footer2.image}
                width="32"
                height="32"
              />
              <RenderHTML
                contentWidth={width}
                source={{
                  html: aboutUsData.footer2.description,
                }}
                tagsStyles={tagsStyles(
                  appTheme[globalState.colorScheme].colors.text
                )}
                baseStyle={baseStyles}
                systemFonts={systemFonts}
              />
            </Stack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View mr="2">
                <AboutCard
                  title={aboutUsData.icons.icon1.title}
                  description={aboutUsData.icons.icon1.description}
                  imageURL={getImageURL(aboutUsData.icons.icon1.image)}
                />
              </View>
              <View mr="2">
                <AboutCard
                  title={aboutUsData.icons.icon2.title}
                  description={aboutUsData.icons.icon2.description}
                  imageURL={getImageURL(aboutUsData.icons.icon2.image)}
                />
              </View>
              <View>
                <AboutCard
                  title={aboutUsData.icons.icon3.title}
                  description={aboutUsData.icons.icon3.description}
                  imageURL={getImageURL(aboutUsData.icons.icon3.image)}
                />
              </View>
            </ScrollView>
            <Stack>
              <Text fontSize="lg">{aboutUsData.footer1.title}</Text>
              <RenderHTML
                contentWidth={width}
                source={{
                  html: aboutUsData.footer1.description,
                }}
                tagsStyles={tagsStyles(
                  appTheme[globalState.colorScheme].colors.text
                )}
                baseStyle={baseStyles}
                systemFonts={systemFonts}
              />
              <ImageViewerModal>
                <Image
                  source={{
                    uri: getImageURL(aboutUsData.footer1.image),
                  }}
                  resizeMode="cover"
                  alt={aboutUsData.footer1.image}
                  width="full"
                  height="32"
                />
              </ImageViewerModal>
            </Stack>
            <Stack>
              <Text fontSize="lg">{aboutUsData.main2.title}</Text>
              <Text>
                {aboutUsData.main2.description.slice(
                  0,
                  isDescriptionCollapse?.['main2'] ? 150 : undefined
                )}
                {isDescriptionCollapse?.['main2'] && (
                  <Text
                    bold
                    onPress={() =>
                      setIsDescriptionCollapse((prevData) => ({
                        ...prevData,
                        main2: false,
                      }))
                    }
                  >
                    ... {t('Read more')}
                  </Text>
                )}
                {!isDescriptionCollapse?.['main2'] && (
                  <Text
                    bold
                    onPress={() =>
                      setIsDescriptionCollapse((prevData) => ({
                        ...prevData,
                        main2: true,
                      }))
                    }
                  >
                    ... {t('Read less')}
                  </Text>
                )}
              </Text>
            </Stack>
            <Stack>
              <Text fontSize="lg">{aboutUsData.main3.title}</Text>
              <Text>
                {aboutUsData.main3.description.slice(
                  0,
                  isDescriptionCollapse?.['main3'] ? 150 : undefined
                )}
                {isDescriptionCollapse?.['main3'] && (
                  <Text
                    bold
                    onPress={() =>
                      setIsDescriptionCollapse((prevData) => ({
                        ...prevData,
                        main3: false,
                      }))
                    }
                  >
                    ... {t('Read more')}
                  </Text>
                )}
                {!isDescriptionCollapse?.['main3'] && (
                  <Text
                    bold
                    onPress={() =>
                      setIsDescriptionCollapse((prevData) => ({
                        ...prevData,
                        main3: true,
                      }))
                    }
                  >
                    ... {t('Read less')}
                  </Text>
                )}
              </Text>
            </Stack>
          </Stack>
        </ScrollView>
      ) : (
        <Stack m="4" space="4">
          <Skeleton h="40" rounded="md" />
          <Skeleton.Text px="4" />
        </Stack>
      )}
    </View>
  );
};
