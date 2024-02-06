import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ScrollView, Skeleton, Stack, View } from 'native-base';
import { useSelector } from 'react-redux';
import RenderHTML from 'react-native-render-html';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { baseStyles, systemFonts, tagsStyles } from '../utils/globalStyles';
import { getCmsPage } from '../api/auth';
import { appTheme } from '../colorScheme';

export const PrivacyPolicy = () => {
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
  const [privacyPolicyData, setPrivacyPolicyData] = useState();

  const getPrivacyPolicy = async () => {
    try {
      const response = await getCmsPage('privacy-policy');
      setPrivacyPolicyData(response.data.data.pageContent.lang);
    } catch (error: any) {
      setShowAlert({
        isShowing: true,
        message: error.response.data.msg,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getPrivacyPolicy();
  }, []);

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
      {privacyPolicyData ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Stack m="4">
            <RenderHTML
              contentWidth={width}
              source={{
                html: privacyPolicyData?.[globalState.language],
              }}
              tagsStyles={tagsStyles(
                appTheme[globalState.colorScheme].colors.text
              )}
              baseStyle={baseStyles}
              systemFonts={systemFonts}
            />
          </Stack>
        </ScrollView>
      ) : (
        <Stack m="4" space="4">
          <Skeleton.Text px="4" />
          <Skeleton.Text px="4" />
        </Stack>
      )}
    </View>
  );
};
