import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Animated,
  Platform,
} from 'react-native';
import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import {
  calcH,
  calcW,
  STYLES,
  STORAGE_KEY,
  IMAGE_PATH,
} from '../../../utils/constants/common';

import {createGet, createPut} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import styles from './style';

import strings from '../../components/lng/LocalizedStrings';
import ProfileInput from '../../components/ProfileInput.js';
import storage from '../../../utils/constants/storage.js';
import AppImage from '../../components/AppImage.js';
import icons from '../../../conts/icons.js';
import cache from '../../../utils/constants/cache.js';
import BottomSheet from 'reanimated-bottom-sheet';
import CustomButton from '../../components/CustomButton.js';
import {AuthContext} from '../../components/context.js';
import mmkv from '../../../utils/constants/mmkv/index.js';
import Toast from 'react-native-toast-message';

const OnlyEnglishArabicRegex =
  /^[a-zA-Z\u0600-\u06FF,-][\sa-zA-Z\u0600-\u06FF,-]*$/;

function ProfileScreen({navigation}) {
  const [inputs, setInputs] = React.useState({
    email: '',
    fullname: '',
    mobile: '',
    business: '',
    address: null,
    photo: null,
    image_location: null,
    id: '',
    website_id: '',
    imageName: '',
    mime: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [imagestatus, setimagestatus] = React.useState(false);

  const [editable, setEditable] = React.useState(false);

  const [image, setImage] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);

  const sheetRef = React.useRef(null);
  const fall = new Animated.Value(1);

  const {updateCounter} = useContext(AuthContext);

  React.useEffect(() => {
    getCustomerDetails();
    const customerDetailsOnFocus = navigation.addListener('focus', () => {
      getCustomerDetails();
    });
    return customerDetailsOnFocus;
  }, []);

  const takePhotoFromCamera = () => {
    try {
      ImagePicker.openCamera({
        compressImageMaxHeight: 400,
        compressImageMaxWidth: 400,
        cropping: true,
        compressImageQuality: 0.7,
        includeBase64: true,
        mediaType: 'photo',
      })
        .then(image => {
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          setImage(imageUri);
          let fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
          setInputs(prevState => ({
            ...prevState,
            ['image_location']: imageUri,
          }));
          setInputs(prevState => ({...prevState, ['photo']: image.data}));
          setInputs(prevState => ({...prevState, ['imageName']: fileName}));
          setInputs(prevState => ({...prevState, ['mime']: image.mime}));

          sheetRef.current.snapTo(2);
          setModal(!modal);
        })
        .catch(error => {
          console.log(`TakePhotoFromCamera error`, error);
          setModal(!modal);
        });
    } catch (error) {
      console.log(`TakePhotoFromCamera error`, error);
    }
  };

  const takePhotoFromLibrary = () => {
    try {
      ImagePicker.openPicker({
        compressImageMaxHeight: 400,
        compressImageMaxWidth: 400,
        //cropping: true,
        compressImageQuality: 0.7,
        includeBase64: true,
        mediaType: 'photo',
      })
        .then(image => {
          //console.log('image', image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;

          let fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
          setInputs(prevState => ({
            ...prevState,
            ['image_location']: imageUri,
          }));
          setInputs(prevState => ({...prevState, ['photo']: image.data}));
          setInputs(prevState => ({...prevState, ['imageName']: fileName}));
          setInputs(prevState => ({...prevState, ['mime']: image.mime}));

          sheetRef.current.snapTo(2);
          setModal(!modal);
        })
        .catch(error => {
          console.log(`TakePhotoFromLibrary error`, error);
          setModal(!modal);
        });
    } catch (error) {
      console.log(`TakePhotoFromLibrary error`, error);
    }
  };

  const handleModalClick = () => {
    setModal(!modal);
    modal ? sheetRef.current.snapTo(2) : sheetRef.current.snapTo(0);
  };

  const RenderContent = () => (
    <View style={styles.bottomSheet}>
      <View style={styles.headerDot} />
      <View>
        <Text style={styles.bottomSheetText}>Upload Photo</Text>
        <Text style={styles.bottomSheetText2}>Choose Your Photo</Text>
      </View>
      <View style={styles.renderContent}>
        <CustomButton
          text="Take Photo"
          style={{marginBottom: 10, backgroundColor: COLORS.white}}
          textStyle={{color: COLORS.Profile_font_color}}
          name="camera"
          color={COLORS.Profile_font_color}
          onPress={takePhotoFromCamera}
        />
        <CustomButton
          text="Choose From Library"
          style={{marginBottom: 10, backgroundColor: COLORS.white}}
          textStyle={{color: COLORS.Profile_font_color}}
          name="archive"
          color={COLORS.Profile_font_color}
          onPress={takePhotoFromLibrary}
        />
        <CustomButton
          text="Cancel"
          style={{marginBottom: 10, backgroundColor: COLORS.white}}
          textStyle={{color: COLORS.Profile_font_color}}
          onPress={() => {
            sheetRef.current.snapTo(2);
            setModal(false);
          }}
          name="close-o"
          color={COLORS.Profile_font_color}
        />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerDotContainer}>
      <View style={styles.headerDot} />
    </View>
  );

  const UploadCancelHandle = () => {
    setInputs(prevState => ({...prevState, ['photo']: null}));
  };

  const getCustomerDetails = async () => {
    try {
      let userDetails = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);

      setInputs(prevState => ({...prevState, ['email']: userDetails.email}));
      setInputs(prevState => ({
        ...prevState,
        ['fullname']: `${userDetails.firstname}  ${userDetails.lastname}`,
      }));
      setInputs(prevState => ({
        ...prevState,
        ['address']: userDetails?.addresses[0]?.city,
      }));
      setInputs(prevState => ({...prevState, ['id']: userDetails.id}));
      setInputs(prevState => ({
        ...prevState,
        ['website_id']: userDetails.website_id,
      }));
      userDetails.custom_attributes.forEach(element => {
        if (element.attribute_code == 'phone_number') {
          setInputs(prevState => ({
            ...prevState,
            ['mobile']: element.value?.trim(),
          }));
        }
        if (element.attribute_code == 'avatar') {
          setInputs(prevState => ({
            ...prevState,
            ['photo']: `${element.value}`,
          }));
        }
        if (element.attribute_code == 'shopurl') {
          setInputs(prevState => ({
            ...prevState,
            ['business']: `${element.value}`,
          }));
        }
      });
    } catch (error) {
      console.log(`error getting user details in profilescreen`, error);
    } finally {
      setLoading(false);
    }
  };

  // const getUserDetails = async () => {
  //   //const data = await storage.get(STORAGE_KEY.CUSTOMER_DETAILS);
  //   // console.log('data', data);
  //   setLoading(true);
  //   try {
  //     let result = await createGet({
  //       tokenType: 'self',
  //       url: commonUrl.customerDetails,
  //     });
  //     if (result.status === 200) {
  //       await setUserData(result?.data);
  //       console.log('result.data', result.data);
  //       //console.log('Profile data ==> ', result.data);
  //       //setCustomerId(result.data?.id);
  //       await storage.store(STORAGE_KEY.CUSTOMER_DETAILS, result.data);
  //       setLoading(false);
  //       // setUserData(prevState => ({
  //       //   ...prevState,
  //       //   ['name']: result.data?.firstname,
  //       // }));
  //       //setName(result.data?.firstname);
  //       // result.data?.custom_attributes.map(item => {
  //       //   if (item?.attribute_code == 'avatar') {
  //       //     setUserData(prevState => ({
  //       //       ...prevState,
  //       //       ['profilePicture']: item?.value,
  //       //     }));
  //       //     //setProfileImg(item?.value);
  //       //   }
  //       // });
  //     }
  //   } catch (error) {
  //     console.log('Profile error ==> ', error);
  //     setLoading(false);
  //   }
  // };
  //console.log('userData', userData);
  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.fullname) {
      handleError('Please enter name', 'fullname');
      isValid = false;
    }

    if (!inputs.email) {
      handleError('Please enter email', 'email');
      isValid = false;
    }

    if (!inputs.mobile) {
      handleError('Please enter mobile number', 'mobile');
      isValid = false;
    }
    if (isValid) {
      console.log('true');
      updateUser();
    }
  };

  const fullName = inputs.fullname.trim().split(' ');

  const updateUser = async () => {
    setLoading(true);
    try {
      let bodyData;
      if (inputs.image_location && inputs.imageName) {
        bodyData = {
          customer: {
            id: inputs.id,
            website_id: inputs.website_id,
            email: inputs.email,
            firstname: fullName[0],
            lastname: fullName[fullName.length - 1],
            custom_attributes: [
              {
                attribute_code: 'phone_number',
                value: inputs.mobile,
              },
              {
                attribute_code: 'avatar',
                value: {
                  base64EncodedData: inputs.photo,
                  type: inputs.mime,
                  name: inputs.imageName,
                },
              },
            ],
          },
        };
      } else {
        bodyData = {
          customer: {
            id: inputs.id,
            website_id: inputs.website_id,
            email: inputs.email,
            firstname: fullName[0],
            lastname: fullName[fullName.length - 1],
            custom_attributes: [
              {
                attribute_code: 'phone_number',
                value: inputs.mobile,
              },
            ],
          },
        };
      }

      let result = await createPut({
        tokenType: 'admin',
        url: `${commonUrl.registartion}/${inputs.id}`,
        body: bodyData,
      });

      if (result) {
        setLoading(false);

        mmkv.store(STORAGE_KEY.CUSTOMER_DETAILS, {
          ...result.data,
          loggedIn: true,
        });
        setToastMsg('Updated SuccessFully');
      }
    } catch (error) {
      setLoading(false);
      console.log('--------------------', error);
    } finally {
      setEditable(false);
      setInputs(prevState => ({
        ...prevState,
        ['image_location']: null,
      }));
      navigation.goBack();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const setToastMsg = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.TOP);
  };

  return (
    <>
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <SafeAreaView style={styles.container}>
          <Animated.View>
            <ScrollView>
              <View style={styles.subContainer}>
                <View style={styles.topContainer}>
                  <TouchableOpacity onPress={handleModalClick}>
                    <AppImage
                      source={
                        inputs.image_location
                          ? {uri: inputs.image_location}
                          : inputs.photo != undefined
                          ? {
                              uri: `${IMAGE_PATH.CUSTOMER_PROFILE_PATH}/${inputs.photo}`,
                            }
                          : icons.user
                      }
                      style={styles.imageContainer}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        top: calcH(0.11),
                      }}>
                      <AppImage
                        source={icons.editImage}
                        size={calcH(0.05)}
                        style={styles.editImage}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="account-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.fullname}
                    inputContainer={true}
                    editable={editable}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      borderBottomWidth: editable ? 0 : 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: editable ? 1 : 0}}
                  />
                  <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="store-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.business}
                    inputContainer={true}
                    editable={false}
                    //selectTextOnFocus={editable}
                    // inputStyle={{
                    //   borderBottomWidth: editable ? 0 : 0.5,
                    //   borderColor: COLORS.profile_bottom_border,
                    // }}
                    // containerStyle={{ borderWidth: editable ? 1 : 0 }}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                  />
                  <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="email-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.email}
                    inputContainer={true}
                    // editable={false}
                    // //selectTextOnFocus={editable}
                    // inputStyle={{
                    //   //borderBottomWidth: editable ? 0 : 0.5,
                    //   borderBottomWidth: 0.5,
                    //   borderColor: COLORS.profile_bottom_border,
                    // }}
                    // containerStyle={{ borderWidth: 0 }}
                    editable={false}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                    // editable={editable}
                    // //selectTextOnFocus={editable}
                    // inputStyle={{
                    //   borderBottomWidth: editable ? 0 : 0.5,
                    //   borderColor: COLORS.profile_bottom_border,
                    // }}
                    // containerStyle={{borderWidth: editable ? 1 : 0}}
                  />
                  <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="phone-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.mobile}
                    inputContainer={true}
                    editable={false}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                  />
                  {/* <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="map-marker-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.address ? inputs.address : 'Empty'}
                    inputContainer={true}
                    editable={false}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                  /> */}

                  <View>
                    <Button
                      title={strings.UPLOAD_REQUIRED_FILE.toLocaleUpperCase()}
                      bgColor={COLORS.white}
                      onPress={() => navigation.navigate('UploadDocuments')}
                      containerStyle={{
                        marginVertical: calcH(0.01),
                        borderWidth: 1,
                        marginTop: calcH(0.03),
                      }}
                      height={calcH(0.065)}
                      color={COLORS.BlackTie}
                    />
                    <Button
                      title={strings.CHANGE_PASSWORD.toLocaleUpperCase()}
                      bgColor={COLORS.white}
                      onPress={() => navigation.navigate('ChangePassword')}
                      containerStyle={{
                        marginVertical: calcH(0.01),
                        borderWidth: 1,
                      }}
                      color={COLORS.BlackTie}
                      height={calcH(0.065)}
                    />
                    {editable || inputs.image_location ? (
                      <Button
                        title={strings.UPDATE.toLocaleUpperCase()}
                        bgColor={COLORS.white}
                        onPress={validate}
                        containerStyle={{
                          marginVertical: calcH(0.01),
                          borderWidth: 1,
                        }}
                        color={COLORS.BlackTie}
                        height={calcH(0.065)}
                      />
                    ) : null}
                    <Button
                      title={!editable ? strings.EDIT_PROFILE : strings.CANCEL}
                      bgColor={COLORS.BlackTie}
                      onPress={() => {
                        setEditable(!editable);
                      }}
                      containerStyle={{marginVertical: calcH(0.01)}}
                      height={calcH(0.065)}
                    />
                  </View>
                  <View style={{height: calcH(0.12)}} />
                </View>
              </View>
            </ScrollView>
            <BottomSheet
              ref={sheetRef}
              snapPoints={
                Platform.OS === 'ios'
                  ? [calcH(0.5), calcH(0.2), 0]
                  : [calcH(0.55), calcH(0.2), 0]
              }
              borderRadius={10}
              //renderHeader={renderHeader}
              renderContent={RenderContent}
              initialSnap={2}
              //callbackNode={fall}
              enabledInnerScrolling={false}
              onCloseStart={() => setModal(false)}
            />
          </Animated.View>
        </SafeAreaView>
      )}
    </>
  );
}

export default ProfileScreen;
