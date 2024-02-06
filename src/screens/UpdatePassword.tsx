import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
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
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ColorScheme,
  CombineReducersType,
  generateFormikErrors,
  InitialAppStateType,
  UpdatePasswordSchema,
} from '../models';
import { Formik, FormikConfig } from 'formik';
import { resetPassword } from '../api/auth';
import { RootStackParamList } from '../types';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';
import { appTheme } from '../colorScheme';

interface UpdatePasswordProps extends UpdatePasswordSchema {}

const UpdatePasswordNames: Record<
  keyof UpdatePasswordProps,
  keyof UpdatePasswordProps
> = {
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
};
const UpdatePasswordLabels: Record<keyof UpdatePasswordProps, string> = {
  newPassword: 'New password',
  confirmPassword: 'Confirm password',
};

const validateHandler: FormikConfig<UpdatePasswordProps>['validate'] = (
  values
) => {
  return generateFormikErrors(UpdatePasswordSchema, values);
};

export const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const navigation = useNavigation();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'UpdatePassword'>>();

  const [show, setShow] = useState({
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

  const onSubmitHandler: FormikConfig<UpdatePasswordProps>['onSubmit'] = async (
    values
  ) => {
    try {
      const output = UpdatePasswordSchema.parse(values);
      console.log(output);

      const data = {
        email: params.email,
        newPassword: output.newPassword,
      };
      const res = await resetPassword(data);
      if (res.status === 200) {
        Alert.alert(res.data.msg);
        navigation.navigate('LogIn');
      }
    } catch (err: any) {
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
        <VStack height="full" mx={4} space={5} justifyContent={'center'}>
          <Container>
            <Text fontSize="2xl">Update Password to</Text>
            <Divider width={150} mt={1} height={1} />
          </Container>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus,
            laudantium?
          </Text>
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
                          touched.newPassword &&
                          errors.newPassword !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type={show.newPassword ? 'password' : 'text'}
                            defaultValue={values.newPassword}
                            placeholder={UpdatePasswordLabels.newPassword}
                            onChangeText={handleChange(
                              UpdatePasswordNames.newPassword
                            )}
                            onBlur={handleBlur(UpdatePasswordNames.newPassword)}
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
                            Must be atleast 8 characters.
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
                            placeholder={UpdatePasswordLabels.confirmPassword}
                            onChangeText={handleChange(
                              UpdatePasswordNames.confirmPassword
                            )}
                            onBlur={handleBlur(
                              UpdatePasswordNames.confirmPassword
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
                        UPDATE
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
