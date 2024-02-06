import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  Heading,
  Icon,
  Image,
  Input,
  ScrollView,
  Stack,
  Text,
  View,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
  User,
} from '../models';
import { Formik, FormikConfig, FormikErrors } from 'formik';
import { ZodError, ZodIssueCode } from 'zod';
import Modal from 'react-native-modal';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { DividerWithText } from '../components/DividerWithText';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigation } from '../navigation/DrawerNavigation';
import { ForgotPassword } from '../components/ForgotPassword';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { login } from '../api/auth';
import { getDataFromStorage, setUserToken } from '../storage';
import { appTheme } from '../colorScheme';
import { assetImages } from '../utils/assets';
import { EQUIPRO_FCM_TOKEN } from '../utils/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList, RootStackParamList } from '../types';

interface SignInProps extends User {}

const SignInPropsNames: Record<keyof SignInProps, keyof SignInProps> = {
  publicID: 'publicID',
  password: 'password',
  fullName: 'fullName',
  mobileNo: 'mobileNo',
  avatarURL: 'avatarURL',
  isTermAccepted: 'isTermAccepted',
};
const SignInPropsLabels: Record<keyof SignInProps, string> = {
  publicID: 'User ID',
  password: 'Password',
  fullName: 'Full name',
  mobileNo: 'Mobile no',
  avatarURL: '',
  isTermAccepted: '',
};

const validateHandler: FormikConfig<SignInProps>['validate'] = (
  values: SignInProps
) => {
  let formikErrors: FormikErrors<SignInProps> = {};
  try {
    User.parse(values);
  } catch (e) {
    const { errors } = e as ZodError;
    errors.forEach((subError) => {
      const path = subError.path.join('.');
      let { message } = subError;
      if (
        path === SignInPropsNames.publicID &&
        subError.code === ZodIssueCode.invalid_string
      ) {
        message = 'Invalid email address.';
      }
      if (
        path === SignInPropsNames.password &&
        subError.code === ZodIssueCode.invalid_string
      ) {
        message =
          'Password should have at least one special character, one upper case character, one number & minimum 8 characters.';
      }
      formikErrors = { ...formikErrors, [path]: message };
    });
  }
  return formikErrors;
};

export const LogInScreen: React.FC<SignInProps> = (props) => {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList & RootDrawerParamList>
    >();
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { t } = useTranslation();

  const [show, setShow] = useState(true);
  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onSubmitHandler: FormikConfig<SignInProps>['onSubmit'] = async (
    values
  ) => {
    try {
      const output = User.parse(values);
      const fcm_token = await getDataFromStorage(EQUIPRO_FCM_TOKEN);
      const data = {
        email: output.publicID,
        password: output.password,
        fcm_token,
      };
      const res = await login(data);
      if (res.status === 200) {
        await setUserToken(output.publicID, res.data.data.token);
        navigation.replace('Dashboard');
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      if (err.response) {
        setShowAlert({
          isShowing: true,
          message: err.response.data.msg,
          status: 'error',
        });
      }
    }
  };

  const toggleModal = () => {
    setIsModalVisible((prevData) => !prevData);
  };

  const handleModalClose = () => {
    setShowAlert((prevData) => ({ ...prevData, isShowing: false }));
  };

  return isLoggedIn ? (
    <DrawerNavigation />
  ) : (
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
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        style={styles.modalStyle}
        onBackdropPress={toggleModal}
      >
        <View
          backgroundColor={appTheme[globalState.colorScheme].colors.background}
          p={2}
        >
          <ForgotPassword publicID="" onClose={toggleModal} />
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <VStack height="full" mx={4} space={5} justifyContent={'center'}>
          <Center>
            <Image
              source={assetImages[`logo-${globalState.colorScheme}`]}
              alt="EquiPro"
              size="xl"
              resizeMode="contain"
            />
          </Center>
          <Container>
            <Heading size={globalState.language === 'en' ? 'lg' : 'md'}>
              {t('Welcome')}
            </Heading>
            <Divider width={130} mt={1} height={1} />
          </Container>
          <Text>{t('login_intro')}</Text>
          <Center>
            <Formik
              initialValues={props}
              onSubmit={onSubmitHandler}
              validate={validateHandler}
            >
              {function FormComponent({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
                isSubmitting,
              }) {
                return (
                  <VStack space={2} width="full">
                    <Center>
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.publicID && errors.publicID !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type="text"
                            defaultValue={values.publicID}
                            placeholder={t(SignInPropsLabels.publicID)}
                            onChangeText={handleChange(
                              SignInPropsNames.publicID
                            )}
                            onBlur={handleBlur(SignInPropsNames.publicID)}
                            variant="rounded"
                            InputLeftElement={
                              <Icon
                                as={<AntDesignIcons name="mail" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                          />
                          {touched.publicID === true &&
                            errors.publicID !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.publicID}
                              </FormControl.ErrorMessage>
                            )}
                        </Stack>
                      </FormControl>
                    </Center>
                    <Center>
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.password && errors.password !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type={show ? 'password' : 'text'}
                            defaultValue={values.password}
                            placeholder={t(SignInPropsLabels.password)}
                            onChangeText={handleChange(
                              SignInPropsNames.password
                            )}
                            onBlur={handleBlur(SignInPropsNames.password)}
                            variant="rounded"
                            InputLeftElement={
                              <Icon
                                as={<AntDesignIcons name="lock" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                            InputRightElement={
                              <Icon
                                as={
                                  <FeatherIcons
                                    name={show ? 'eye' : 'eye-off'}
                                  />
                                }
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() => setShow((prevData) => !prevData)}
                              />
                            }
                          />
                          <FormControl.HelperText ml={2}>
                            {t('Must be atleast 8 characters.')}
                          </FormControl.HelperText>
                          {touched.password === true &&
                            errors.password !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.password}
                              </FormControl.ErrorMessage>
                            )}
                        </Stack>
                      </FormControl>
                    </Center>
                    <Center>
                      <Button
                        colorScheme="blue"
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        isLoadingText={t('LOGGING IN')}
                        borderRadius={30}
                        size="full"
                        height={10}
                        style={{ margin: 10 }}
                      >
                        {t('LOGIN')}
                      </Button>
                    </Center>
                  </VStack>
                );
              }}
            </Formik>
          </Center>
          <Center>
            <Button colorScheme="blue" variant="unstyled" onPress={toggleModal}>
              <Text>{t('Forgot password')}?</Text>
            </Button>
          </Center>
          <Center>
            <DividerWithText message={t('OR')} />
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              borderRadius={30}
              leftIcon={<Icon as={FeatherIcons} name="facebook" size="4" />}
            >
              Facebook
            </Button>
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              variant="unstyled"
              onPress={() => {
                navigation.navigate('SignUp');
              }}
            >
              <Text>{t("Don't have an account? Sign up")}</Text>
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
  modalStyle: {
    flex: 1,
  },
});
