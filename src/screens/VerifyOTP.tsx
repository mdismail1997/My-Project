import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, Center, Button, VStack, View } from 'native-base';
import { useSelector } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import {
  useNavigation,
  useTheme,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { globalStyle } from '../utils/globalStyles';
import { verifyOtp } from '../api/auth';
import { RootStackParamList } from '../types';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { appTheme } from '../colorScheme';

const CELL_COUNT = 4;

export const VerifyOTP = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'VerifyOTP'>>();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });

  const handleOTPSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log(value);

      const data = {
        OTP: value,
        email: params.email,
      };
      const res = await verifyOtp(data);

      if (res.status === 200) {
        setIsSubmitting(false);
        navigation.navigate('UpdatePassword', {
          email: params.email,
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setShowAlert({
        isShowing: true,
        message: err.response.data.msg,
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
        contentContainerStyle={styles.scrollViewStyle}
      >
        <VStack space={4} mx={4}>
          <Center>
            <Text style={globalStyle.customFont} fontSize="4xl">
              Enter Your OTP
            </Text>
          </Center>
          <Center>
            <Text>We have sent a OTP on your email</Text>
          </Center>
          <Center>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[
                    styles.cell,
                    { borderColor: colors.text },
                    isFocused && { borderColor: colors.notification },
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              onPress={handleOTPSubmit}
              borderRadius={30}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              isLoadingText="SUBMITTING"
              size="full"
              height={10}
              style={{ margin: 10 }}
            >
              SUBMIT
            </Button>
          </Center>
        </VStack>
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
  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: 60,
    height: 70,
    borderRadius: 5,
    lineHeight: 70,
    fontSize: 48,
    borderWidth: 2,
    textAlign: 'center',
    margin: 10,
  },
});
