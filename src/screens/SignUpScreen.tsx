import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Center,
  Checkbox,
  FormControl,
  Icon,
  Input,
  ScrollView,
  Stack,
  Text,
  View,
  VStack,
  WarningOutlineIcon,
  Link,
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
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { globalStyle } from '../utils/globalStyles';
import { signUp } from '../api/auth';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { appTheme } from '../colorScheme';
interface SignUpProps extends User {
  confirmPassword: string;
}

const SignUpPropsNames: Record<keyof SignUpProps, keyof SignUpProps> = {
  publicID: 'publicID',
  password: 'password',
  confirmPassword: 'confirmPassword',
  fullName: 'fullName',
  mobileNo: 'mobileNo',
  avatarURL: 'avatarURL',
  isTermAccepted: 'isTermAccepted',
};
const SignUpPropsLabels: Record<keyof SignUpProps, string> = {
  publicID: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm password',
  fullName: 'Full name',
  mobileNo: 'Mobile no',
  avatarURL: '',
  isTermAccepted: '',
};

const validateHandler: FormikConfig<SignUpProps>['validate'] = (
  values: SignUpProps
) => {
  let formikErrors: FormikErrors<SignUpProps> = {};
  if (values.confirmPassword !== values.password) {
    formikErrors = {
      ...formikErrors,
      [SignUpPropsNames.confirmPassword]: 'Password not match',
    };
  }
  try {
    User.parse(values);
  } catch (e) {
    const { errors } = e as ZodError;
    errors.forEach((subError) => {
      const path = subError.path.join('.');
      let { message } = subError;
      if (
        path === SignUpPropsNames.publicID &&
        subError.code === ZodIssueCode.invalid_string
      ) {
        message = 'Invalid email address.';
      }
      if (
        path === SignUpPropsNames.password &&
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

export const SignUpScreen: React.FC<SignUpProps> = (props) => {
  const navigation = useNavigation();
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { t } = useTranslation();

  const [show, setShow] = useState({
    password: true,
    confirmPassword: true,
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

  const onSubmitHandler: FormikConfig<SignUpProps>['onSubmit'] = async (
    values
  ) => {
    try {
      if (values.isTermAccepted) {
        const output = User.parse(values);
        const data = {
          ...output,
          confirmPassword: values.confirmPassword,
        };
        const res = await signUp(data);
        if (res.status === 200) {
          navigation.navigate('IntroSlider');
        }
      } else {
        setShowAlert({
          isShowing: true,
          message: 'Please accept terms and conditions.',
          status: 'error',
        });
      }
    } catch (err: any) {
      if (err.response) {
        // The client was given an error response (5xx, 4xx)
        setShowAlert({
          isShowing: true,
          message: err.response.data.msg,
          status: 'error',
        });
      } else if (err.request) {
        // The client never received a response, and the request was never left
        setShowAlert({
          isShowing: true,
          message: 'Something went wrong.',
          status: 'error',
        });
      } else {
        // Anything else
        setShowAlert({
          isShowing: true,
          message: 'Sign up failed. Try again.',
          status: 'error',
        });
      }
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
        <VStack height="full" mx={4} space={5} justifyContent={'center'}>
          <Center>
            <Text fontSize="4xl">
              <Text style={globalStyle.customFont}>{t('Sign up')}</Text>
            </Text>
          </Center>
          <Center>
            <Formik
              initialValues={{ ...props, isTermAccepted: false }}
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
                setFieldValue,
              }) {
                return (
                  <VStack space={4} width="full">
                    <Center>
                      <FormControl
                        isInvalid={
                          touched.fullName && errors.fullName !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type="text"
                            defaultValue={values.fullName}
                            placeholder={t(SignUpPropsLabels.fullName)}
                            onChangeText={handleChange(
                              SignUpPropsNames.fullName
                            )}
                            onBlur={handleBlur(SignUpPropsNames.fullName)}
                            variant="rounded"
                            InputLeftElement={
                              <Icon
                                as={<AntDesignIcons name="user" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                          />
                          {touched.fullName === true &&
                            errors.fullName !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.fullName}
                              </FormControl.ErrorMessage>
                            )}
                        </Stack>
                      </FormControl>
                    </Center>
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
                            placeholder={t(SignUpPropsLabels.publicID)}
                            onChangeText={handleChange(
                              SignUpPropsNames.publicID
                            )}
                            onBlur={handleBlur(SignUpPropsNames.publicID)}
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
                        isInvalid={
                          touched.mobileNo && errors.mobileNo !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type="text"
                            defaultValue={values.mobileNo}
                            placeholder={t(SignUpPropsLabels.mobileNo)}
                            onChangeText={handleChange(
                              SignUpPropsNames.mobileNo
                            )}
                            onBlur={handleBlur(SignUpPropsNames.mobileNo)}
                            variant="rounded"
                            InputLeftElement={
                              <Icon
                                as={<AntDesignIcons name="phone" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                          />
                          {touched.mobileNo === true &&
                            errors.mobileNo !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.mobileNo}
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
                            type={show.password ? 'password' : 'text'}
                            defaultValue={values.password}
                            placeholder={t(SignUpPropsLabels.password)}
                            onChangeText={handleChange(
                              SignUpPropsNames.password
                            )}
                            onBlur={handleBlur(SignUpPropsNames.password)}
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
                                    name={show.password ? 'eye' : 'eye-off'}
                                  />
                                }
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() =>
                                  setShow((prevData) => ({
                                    ...prevData,
                                    password: !prevData.password,
                                  }))
                                }
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
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.confirmPassword &&
                          errors.confirmPassword !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type={show.confirmPassword ? 'password' : 'text'}
                            defaultValue={values.confirmPassword}
                            placeholder={t(SignUpPropsLabels.confirmPassword)}
                            onChangeText={handleChange(
                              SignUpPropsNames.confirmPassword
                            )}
                            onBlur={handleBlur(
                              SignUpPropsNames.confirmPassword
                            )}
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
                                    name={
                                      show.confirmPassword ? 'eye' : 'eye-off'
                                    }
                                  />
                                }
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() =>
                                  setShow((prevData) => ({
                                    ...prevData,
                                    confirmPassword: !prevData.confirmPassword,
                                  }))
                                }
                              />
                            }
                          />
                          {touched.confirmPassword === true &&
                            errors.confirmPassword !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.confirmPassword}
                              </FormControl.ErrorMessage>
                            )}
                        </Stack>
                      </FormControl>
                    </Center>
                    <Center>
                      <Checkbox
                        shadow={2}
                        value="accepted"
                        accessibilityLabel="terms and conditions"
                        isChecked={values.isTermAccepted}
                        colorScheme="blue"
                        onChange={(isSelected) => {
                          setFieldValue(
                            SignUpPropsNames.isTermAccepted,
                            isSelected
                          );
                        }}
                      >
                        <Link href="https://nodeserver.mydevfactory.com/projects/tulika/Soumen/equipro/equipro-web/#/TramConditions">
                          {t('Terms & Conditions')}
                        </Link>
                      </Checkbox>
                    </Center>
                    <Center>
                      <Button
                        colorScheme="blue"
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        isLoadingText={t('SIGNING UP')}
                        borderRadius={30}
                        size="full"
                        height={10}
                        style={{ margin: 10 }}
                      >
                        {t('Sign up')}
                      </Button>
                    </Center>
                  </VStack>
                );
              }}
            </Formik>
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              variant="unstyled"
              onPress={() => {
                navigation.navigate('LogIn');
              }}
            >
              <Text>{t('Already have an account? Sign In')}</Text>
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
});
