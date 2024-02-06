import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  Icon,
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
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {
  CombineReducersType,
  generateFormikErrors,
  ChangePasswordSchema,
  ColorScheme,
  InitialAppStateType,
} from '../models';
import { Formik, FormikConfig } from 'formik';
import { appTheme } from '../colorScheme';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { changePassword } from '../api/auth';
import { StackActions, useNavigation } from '@react-navigation/native';
import { deleteUserToken } from '../storage';

interface ChangePasswordProps extends ChangePasswordSchema {}

const ChangePasswordNames: Record<
  keyof ChangePasswordProps,
  keyof ChangePasswordProps
> = {
  currentPassword: 'currentPassword',
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
};
const ChangePasswordLabels: Record<keyof ChangePasswordProps, string> = {
  currentPassword: 'Current password',
  newPassword: 'New password',
  confirmPassword: 'Confirm password',
};

const validateHandler: FormikConfig<ChangePasswordProps>['validate'] = (
  values
) => {
  return generateFormikErrors(ChangePasswordSchema, values);
};

export const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [show, setShow] = useState({
    currentPassword: true,
    newPassword: true,
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

  const onSubmitHandler: FormikConfig<ChangePasswordProps>['onSubmit'] = async (
    values
  ) => {
    const output = ChangePasswordSchema.parse(values);
    console.log(output);
    if (output.newPassword === output.confirmPassword) {
      try {
        const response = await changePassword({ password: output.newPassword });
        console.log('change password response', response);
        if (response.status === 200) {
          await deleteUserToken();
          navigation.dispatch(StackActions.replace('LogIn'));
        }
      } catch (error: any) {
        if (error.response) {
          setShowAlert({
            isShowing: true,
            message: error.response.data.msg,
            status: 'error',
          });
        }
      }
    } else {
      setShowAlert({
        isShowing: true,
        message: 'Confirm password not matched.',
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
        <VStack height="full" mx={4} space={5} justifyContent={'center'}>
          <Container>
            <Text fontSize="2xl">{t('Change password')}</Text>
            <Divider width={150} mt={1} height={1} />
          </Container>
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
                          touched.currentPassword &&
                          errors.currentPassword !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type={show.currentPassword ? 'password' : 'text'}
                            defaultValue={values.currentPassword}
                            placeholder={t(
                              ChangePasswordLabels.currentPassword
                            )}
                            onChangeText={handleChange(
                              ChangePasswordNames.currentPassword
                            )}
                            onBlur={handleBlur(
                              ChangePasswordNames.currentPassword
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
                                      show.currentPassword ? 'eye' : 'eye-off'
                                    }
                                  />
                                }
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() =>
                                  setShow((prevData) => ({
                                    ...prevData,
                                    currentPassword: !prevData.currentPassword,
                                  }))
                                }
                              />
                            }
                          />
                          {touched.currentPassword === true &&
                            errors.currentPassword !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.currentPassword}
                              </FormControl.ErrorMessage>
                            )}
                        </Stack>
                      </FormControl>
                    </Center>
                    <Center>
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.newPassword &&
                          errors.newPassword !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type={show.newPassword ? 'password' : 'text'}
                            defaultValue={values.newPassword}
                            placeholder={t(ChangePasswordLabels.newPassword)}
                            onChangeText={handleChange(
                              ChangePasswordNames.newPassword
                            )}
                            onBlur={handleBlur(ChangePasswordNames.newPassword)}
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
                                    name={show.newPassword ? 'eye' : 'eye-off'}
                                  />
                                }
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() =>
                                  setShow((prevData) => ({
                                    ...prevData,
                                    newPassword: !prevData.newPassword,
                                  }))
                                }
                              />
                            }
                          />
                          <FormControl.HelperText ml={2}>
                            {t('Must be atleast 8 characters.')}
                          </FormControl.HelperText>
                          {touched.newPassword === true &&
                            errors.newPassword !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.newPassword}
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
                            placeholder={t(
                              ChangePasswordLabels.confirmPassword
                            )}
                            onChangeText={handleChange(
                              ChangePasswordNames.confirmPassword
                            )}
                            onBlur={handleBlur(
                              ChangePasswordNames.confirmPassword
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
                      <Button
                        colorScheme="blue"
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        isLoadingText="UPDATING"
                        borderRadius={30}
                        size="full"
                        height={10}
                        style={{ margin: 10 }}
                      >
                        {t('UPDATE')}
                      </Button>
                    </Center>
                  </VStack>
                );
              }}
            </Formik>
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
