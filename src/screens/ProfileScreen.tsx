import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  FormControl,
  Icon,
  Input,
  ScrollView,
  Stack,
  VStack,
  WarningOutlineIcon,
  View,
  Skeleton,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, FormikConfig } from 'formik';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {
  ColorScheme,
  CombineReducersType,
  generateFormikErrors,
  InitialAppStateType,
  InitialUserDetailsType,
  User,
} from '../models';
import { ImageUploader, ImageUploaderProps } from '../components/ImageUploader';
import { appTheme } from '../colorScheme';
import { Asset } from 'react-native-image-picker';
import { getHorses, updateProfile } from '../api/auth';
import { setUserData } from '../redux';
import { getImageURL } from '../utils/utility';
import { Chip } from '../components/Chip';
import { GestureResponderEvent } from 'react-native';
import { HorseProfile } from '../components/HorseProfile';
import { DividerWithText } from '../components/DividerWithText';
import appBaseUrl from '../config/baseUrl';
import { DropdownAlert, DropdownAlertProps } from '../components/DropdownAlert';

interface ProfileScreenProps extends User {
  address?: string;
  horseName?: string;
  horseGender?: string;
  race?: string;
  horseAge?: string;
  education?: string;
  bio?: string;
}

const ProfileScreenPropsNames: Record<
  keyof ProfileScreenProps,
  keyof ProfileScreenProps
> = {
  publicID: 'publicID',
  password: 'password',
  fullName: 'fullName',
  mobileNo: 'mobileNo',
  address: 'address',
  avatarURL: 'avatarURL',
  isTermAccepted: 'isTermAccepted',
  horseName: 'horseName',
  horseGender: 'horseGender',
  race: 'race',
  horseAge: 'horseAge',
  education: 'education',
  bio: 'bio',
};
const ProfileScreenPropsLabels: Record<keyof ProfileScreenProps, string> = {
  publicID: 'User ID',
  password: 'Password',
  fullName: 'Full name',
  mobileNo: 'Mobile no',
  address: 'Address',
  avatarURL: '',
  isTermAccepted: '',
  horseName: 'Name',
  horseGender: 'Gender',
  race: 'Race',
  horseAge: 'Age',
  education: 'Education',
  bio: 'Bio',
};

const validateHandler: FormikConfig<ProfileScreenProps>['validate'] = (
  values
) => {
  return generateFormikErrors(User, values);
};

export const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  const globalState = useSelector<
    CombineReducersType,
    {
      colorScheme: ColorScheme;
      language: InitialAppStateType['appLanguage'];
      userData: InitialUserDetailsType['userData'];
    }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
    userData: state.userDetails.userData,
  }));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });
  const [selectedImage, setSelectedImage] = useState<Asset>();
  const [myHorses, setMyHorses] = useState<{ [key: string]: any }>();
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const fetchHorseProfile = async () => {
      try {
        const response = await getHorses();
        const horseData = response.data.data.horses.reduce(
          (acc: any, cur: { _id: any; [key: string]: any }) => ({
            ...acc,
            [cur._id]: cur,
          }),
          {}
        );
        setMyHorses(horseData);
        setSelectedValue(response.data.data.horses[0]._id);
      } catch (error) {
        setShowAlert((prevData) => ({
          ...prevData,
          isShowing: true,
          message: 'Something went wrong.',
          status: 'error',
        }));
      }
    };
    fetchHorseProfile();
  }, []);

  const onSubmitHandler: FormikConfig<ProfileScreenProps>['onSubmit'] = async (
    values,
    { resetForm }
  ) => {
    try {
      const formData = new FormData();

      formData.append('email', values.publicID);
      formData.append('fullName', values.fullName as string);
      formData.append('phone', values.mobileNo);
      formData.append('address', values.address);
      if (selectedImage) {
        formData.append('photo', {
          name: selectedImage.fileName,
          size: selectedImage.fileSize,
          type: selectedImage.type,
          uri: selectedImage.uri,
        });
      }
      const response = await updateProfile(formData);
      dispatch(
        setUserData({
          ...globalState.userData,
          ...response.data.data,
          photo: response.data.data.photo
            ? getImageURL(response.data.data.photo)
            : undefined,
        })
      );
      setShowAlert((prevData) => ({
        ...prevData,
        isShowing: true,
        message: 'Profile updated.',
        status: 'success',
      }));
      resetForm();
    } catch (error: any) {
      setShowAlert((prevData) => ({
        ...prevData,
        isShowing: true,
        message: 'Something went wrong.',
        status: 'error',
      }));
      resetForm();
    }
  };

  const handleModalClose = () => {
    setShowAlert((prevData) => ({ ...prevData, isShowing: false }));
  };

  const handlePress = (event: GestureResponderEvent, value: string) => {
    setSelectedValue(value);
  };

  const handleAddPress = () => {
    setMyHorses((prevData) => ({
      ...prevData,
      zzz: { _id: '' },
    }));
    setSelectedValue('zzz');
  };

  const handleHorseProfileSubmit = (data: Record<string, any>) => {
    setMyHorses((prevData) => {
      delete prevData?.['zzz'];
      return {
        ...prevData,
        [data.horses._id]: data.horses,
      };
    });
    setSelectedValue(data.horses._id);
    setShowAlert((prevData) => ({
      ...prevData,
      isShowing: true,
      message: 'Horse profile updated.',
      status: 'success',
    }));
  };

  const handleHorseProfileError = () => {
    setShowAlert((prevData) => ({
      ...prevData,
      isShowing: true,
      message: 'Something went wrong.',
      status: 'error',
    }));
  };

  const handleDelete = (id: string) => {
    setMyHorses((prevData) => {
      delete prevData?.[id];
      return prevData;
    });
    setShowAlert((prevData) => ({
      ...prevData,
      isShowing: true,
      message: 'Horse profile deleted.',
      status: 'success',
    }));
  };

  const handleDeleteError = (response: any) => {
    setShowAlert((prevData) => ({
      ...prevData,
      isShowing: true,
      message: response.data.msg,
      status: 'error',
    }));
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
        <VStack m={4} space="2">
          <Formik
            initialValues={{
              ...props,
              avatarURL: globalState.userData.photo,
              fullName: globalState.userData.fullName,
              publicID: globalState.userData.email,
              mobileNo: globalState.userData.phone,
              address: globalState.userData.address ?? '',
              password: 'Password@123',
            }}
            onSubmit={onSubmitHandler}
            validate={validateHandler}
            enableReinitialize
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
              dirty,
            }) {
              const handleFileSelect: ImageUploaderProps['onSelectFile'] = (
                file
              ) => {
                setSelectedImage(file[0]);
                setFieldValue(ProfileScreenPropsNames.avatarURL, file[0].uri);
              };

              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <VStack space={2} width="full">
                    <Center>
                      <ImageUploader
                        alt={values.fullName}
                        src={values.avatarURL}
                        onSelectFile={handleFileSelect}
                      />
                    </Center>
                    <Center>
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.fullName && errors.fullName !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type="text"
                            defaultValue={values.fullName}
                            placeholder={t(ProfileScreenPropsLabels.fullName)}
                            onChangeText={handleChange(
                              ProfileScreenPropsNames.fullName
                            )}
                            onBlur={handleBlur(
                              ProfileScreenPropsNames.fullName
                            )}
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
                            placeholder={t(ProfileScreenPropsLabels.publicID)}
                            onChangeText={handleChange(
                              ProfileScreenPropsNames.publicID
                            )}
                            onBlur={handleBlur(
                              ProfileScreenPropsNames.publicID
                            )}
                            isDisabled
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
                          touched.mobileNo && errors.mobileNo !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type="text"
                            defaultValue={values.mobileNo}
                            placeholder={t(ProfileScreenPropsLabels.mobileNo)}
                            onChangeText={handleChange(
                              ProfileScreenPropsNames.mobileNo
                            )}
                            onBlur={handleBlur(
                              ProfileScreenPropsNames.mobileNo
                            )}
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
                          touched.address && errors.address !== undefined
                        }
                      >
                        <Stack>
                          <Input
                            minHeight="12"
                            type="text"
                            defaultValue={values.address}
                            placeholder={t(ProfileScreenPropsLabels.address)}
                            onChangeText={handleChange(
                              ProfileScreenPropsNames.address
                            )}
                            onBlur={handleBlur(ProfileScreenPropsNames.address)}
                            variant="rounded"
                            InputLeftElement={
                              <Icon
                                as={<EntypoIcons name="location-pin" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                          />
                          {touched.address === true &&
                            errors.address !== undefined && (
                              <FormControl.ErrorMessage
                                ml={2}
                                leftIcon={<WarningOutlineIcon size="xs" />}
                              >
                                {errors.address}
                              </FormControl.ErrorMessage>
                            )}
                        </Stack>
                      </FormControl>
                    </Center>
                    <Center>
                      <Button
                        colorScheme="blue"
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting || dirty === false}
                        isLoading={isSubmitting}
                        isLoadingText="SUBMITTING"
                        borderRadius={30}
                        size="full"
                        height={10}
                        style={{ margin: 10 }}
                      >
                        {t('SUBMIT')}
                      </Button>
                    </Center>
                  </VStack>
                </ScrollView>
              );
            }}
          </Formik>
          {myHorses === undefined ? (
            <Stack space="2">
              <Skeleton size="5" rounded="full" width="100%" />
              <Skeleton size="5" rounded="full" width="100%" />
              <Skeleton size="5" rounded="full" width="100%" />
            </Stack>
          ) : (
            <>
              <DividerWithText message="Choose" color="blue.500" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {myHorses &&
                  Object.keys(myHorses)?.map((el, i) => (
                    <Chip
                      key={i}
                      title={`Horse ${i + 1}`}
                      value={el}
                      onPress={handlePress}
                      selected={selectedValue}
                    />
                  ))}
                <Chip
                  title="+ ADD"
                  value="add"
                  onPress={handleAddPress}
                  selected="add"
                />
              </ScrollView>
              {selectedValue !== '' && (
                <HorseProfile
                  id={myHorses?.[selectedValue]?._id ?? ''}
                  horseName={myHorses?.[selectedValue]?.name ?? ''}
                  education={myHorses?.[selectedValue]?.education ?? ''}
                  horseAge={myHorses?.[selectedValue]?.age?.toString()}
                  race={myHorses?.[selectedValue]?.race ?? ''}
                  bio={myHorses?.[selectedValue]?.description ?? ''}
                  type={myHorses?.[selectedValue]?.type}
                  imageURI={
                    myHorses?.[selectedValue]?.photo
                      ? `${appBaseUrl}assets/img/${myHorses?.[selectedValue]?.photo}`
                      : undefined
                  }
                  onSubmit={handleHorseProfileSubmit}
                  onError={handleHorseProfileError}
                  onDelete={handleDelete}
                  onDeleteError={handleDeleteError}
                />
              )}
            </>
          )}
        </VStack>
      </ScrollView>
    </View>
  );
};
