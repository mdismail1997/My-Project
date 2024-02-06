import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ScreenScrollComponent} from '../../commonItem';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import colors from '../../utils/colors';
import {BASE_URL} from '../../utils/Api/apiName';
import axios from 'axios';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
} from '../../utils/comon';
import {UIActivityIndicator} from 'react-native-indicators';

import commonToast from '../../utils/commonToast';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconIonicons from 'react-native-vector-icons/dist/Ionicons';
import * as commonService from '../../service/commonService';
import Hud from '../../utils/hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {CheckIcon, Select} from 'native-base';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'


const phoneNoRegex =
  /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export default function EditProfile(props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [token, setToken] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [filePath, setFilePath] = useState('');
  const [visible, setVisible] = useState(false);
  const [focusName, setFocusName] = useState(false);
  const [focusMobile, setFocusMobile] = useState(false);
  const [imagePickermodal, setImagePickermodal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataRun, setDataRun] = useState(false);
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [countryCode, setCountryCode] = useState('+1')
  const [country, setCountry] = useState(null)

  const getAllState = async () => {
    try {
      const response = await axios.get('https://kabou.us/api/state-get');
      setState(response.data.states);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllState();
  }, []);

  useEffect(() => {
    commonService
      .getData('userData')
      .then(data => {
        setDataRun(true);
        let parsed = data;
        setId(parsed.id);
        setToken(parsed.token);
        getProfile(parsed.token);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  }, []);

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  const onFocusTextInputMobile = () => {
    setFocusMobile(true);
  };

  const onBlurTextInputMobile = () => {
    setFocusMobile(false);
  };

  // function for fetching data from api for show previous enlist profile data

  const getProfile = currentToken => {
    Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + 'user-details',
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer ' + currentToken,
      },
    })
      .then(response => {
        console.log("=========MyProfile===============",response.data);
        Hud.hideHud();
        setEmail(response.data.email);
        setName(response.data.name);
        setMobile(response.data.cellphone);
        setSelectedState(response.data.state_id ?? 1);
        if (response.data.dial_code == null) {
          setCountryCode("1")

        }else{
          setCountryCode(response.data.dial_code)
        }
        
        if (response.data.profile_photo !== '') {
          setProfileImg(response.data.profile_photo);
          setFilePath(response.data.profile_photo);
        } else {
          // bydefault image show
          setFilePath('');
        }
      })
      .catch(err => {
        console.log('err', err);
        Hud.hideHud();
        Alert.alert(err);
      });
  };

  // function for image capture from both camera & gallery  starting from here
  const openImagePicker = () => {
    setImagePickermodal(true);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission given');
          launchCamerafun();
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      launchCamerafun();
    }
  };

  const launchCamerafun = () => {
    const options = {
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisible(false);
        setFilePath(source);
        updateUserProfileImg(source.assets[0].uri);
      }
    });
  };

  const requestGalleryPermission = () => {
    const options = {
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        setImagePickermodal(false);
        console.log('response----------', response);
        let source = response;
        setVisible(false);
        updateUserProfileImg(source.assets[0].uri);
        setFilePath(source);
      }
    });
  };

  const updateUserProfileImg = async value => {
    let formdata = new FormData();
    formdata.append('profile_photo', {
      uri: value,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    console.log('access token', token);
    Hud.showHud();
    axios({
      url: BASE_URL + 'update-profile-picture',
      method: 'POST',
      data: formdata,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer ' + token,
      },
    })
      .then(function (response) {
        console.log('response :', response.data.data.profile_photo);
        Hud.hideHud();
        setProfileImg(response.data.data.profile_photo);
        commonToast({
          text: response.data.message,
          position: 'top',
        });
      })
      .catch(function (error) {
        console.log('error from image :', error);
        Hud.hideHud();
        commonToast({
          text: 'Sorry, Please try again.',
          position: 'top',
          toastFor: 'error',
          duration: 500,
        });
      });
  };

  const updateProfile = () => {
    
    if (name === '') {
      commonToast({
        text: 'Please enter name',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } 
    else if (countryCode == ''|| countryCode == null || countryCode == undefined) {
      commonToast({
        text: 'Please enter country code',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }
    else if (mobile == ''|| mobile == null || mobile == undefined) {
      commonToast({
        text: 'Please enter mobile no',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (mobile.length < 10) {
      commonToast({
        text: 'Please enter 10 digit mobile no',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }

    doDocumentUpdate();
  };

  const doDocumentUpdate = async () => {
    console.log("=========CountryCode=========",countryCode)
    setIsLoading(true);
    if (!phoneNoRegex.test(mobile)) {
      commonToast({
        text: 'Please enter 10 digit mobile number.',
        position: 'top',
        toastFor: 'error',
      });
      setIsLoading(false);
      return;
    }
    const data = {name: name, cellphone: mobile, state_id: selectedState,dial_code: `${countryCode}`};
    console.log("==========Data============",data);
    Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'update-profile',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      data: data,
    })
      .then(response => {
        setIsLoading(false);
        console.log('Success', response);
        Hud.hideHud();
        setName(name);
        setMobile(mobile);
        let upDateStore = {
          id: id,
          name: name,
          email: email,
          mobile: mobile,
          token: token,
        };
        commonService.storeData('userData', JSON.stringify(upDateStore));
        commonToast({
          text: response.data.message,
          position: 'top',
        });
        props.navigation.goBack();
      })
      .catch(err => {
        setIsLoading(false);
        console.log('err', err);
        Hud.hideHud();
        commonToast({
          text: err.data.message,
          position: 'top',
          toastFor: 'error',
        });
      });
  };

  const removeName = () => {
    setName('');
  };

  const removePhn = () => {
    setMobile('');
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image
                style={styles.arrowIcon}
                source={require('../../../assets/images/back_arrow.png')}
              />
            </TouchableOpacity>
            <Text style={styles.instruction}>Edit Profile</Text>
          </View>

          <View style={styles.imageContainer}>
            {filePath && dataRun ? (
              <Image style={styles.profileImg} source={{uri: profileImg}} />
            ) : (
              //  filePath === '' ? (
              //   // <Image
              //   //   style={styles.profileImg}
              //   //   source={require('../../asserts/profile.png')}
              //   // />
              //   <UIActivityIndicator color="#000" style={styles.profileImg} />
              // ) : (
              <View style={styles.proname}>
                <Text style={{fontSize: RFValue(55)}}>{name.charAt(0)}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraContainer}
              onPress={openImagePicker}>
              <Image
                style={styles.cameraIcon}
                source={require('../../../assets/images/camera.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.desContainer}>
            <Text style={styles.proName}>{name}</Text>
            <Text style={styles.proMail}>{email}</Text>
          </View>

          <View style={styles.lowerContainer}>
            <View style={styles.infoContainer}>
              <View
                style={
                  focusName === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusName === true ? (
                  <IconAntDesign
                    color={colors.activeBorder}
                    size={24}
                    name={'user'}
                  />
                ) : (
                  <IconAntDesign
                    color={colors.inActiveBorder}
                    size={24}
                    name={'user'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setName(text)}
                />
                {/* <TouchableOpacity
                onPress={removeName}
                style={{width: calcW(0.3), right: calcW(0.25)}}>
                <Text style={styles.editphnText}>Edit</Text>
              </TouchableOpacity> */}
              </View>
              <View
                style={
                  focusMobile === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                   {focusMobile === true ? (
                  <IconIonicons
                    color={colors.activeBorder}
                    size={24}
                    name={'ios-call-outline'}
                  />
                ) : (
                  <IconIonicons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'ios-call-outline'}
                  />
                )}
                    <CountryPicker
                onSelect={value => {
                  console.log('VAL', value);
                  
                  // setCca2(value.cca2);
                  setCountry(value.name);
                  // setRegion(value.region);
                  console.warn("==DialCode============",value.callingCode)
                  setCountryCode(value.callingCode);
                }}
                style={{
                  // fontFamily: FONTS.Regular,
                  alignSelf: 'center',
                }}
                // theme={DARK_THEME}
                translation="en"
                onClose={value => console.log('CLOSE', value)}
               
                placeholderTextColor="#000"
                placeholder="  +"
                value={countryCode}
                withAlphaFilter
                withCountryNameButton
                withFilter
                withFlag
                containerButtonStyle={{
                  // borderWidth: 1,
                  borderColor: '#3d3d3d',
                  // backgroundColor: '#414141',
                  
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  borderRadius: 8,
                  textAlign: 'center',
                //  fontFamily:FONTS.bold
                }}
                // visible
              />
              {countryCode == null &&  countryCode == undefined ?
               <Text style={{color: '#000',marginEnd: 5}}>{countryCode}</Text>
               :
               <Text style={{color: '#000',marginEnd: 5}}>{countryCode}</Text>
              
            }
                   
               
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Please enter mobile no"
                  value={mobile}
                  onBlur={() => onBlurTextInputMobile()}
                  onFocus={() => onFocusTextInputMobile()}
                  onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
                />

                {/* <TouchableOpacity
                onPress={removePhn}
                style={{width: calcW(0.3), right: calcW(0.25)}}>
                <Text style={styles.editphnText}>Edit</Text>
              </TouchableOpacity> */}
              </View>
              <Select
                selectedValue={selectedState}
                minWidth={calcW(0.9)}
                padding={3}
                height={calcH(0.065)}
                accessibilityLabel="Choose State"
                placeholder="Choose State"
                rounded="full"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => setSelectedState(itemValue)}>
                {state.map((el, i) => (
                  <Select.Item
                    key={el.state_id}
                    label={el.stateName}
                    value={el.state_id}
                  />
                ))}
              </Select>
            </View>
            <View style={styles.btnconfirmContainer}>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={updateProfile}>
                  <Text style={styles.btnconfirmText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={styles.btnconfirmContainer}>
                    <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.btnpwdConfirm} onPress={() =>
                                navigation.navigate('')
                              }>
                                    <Text style={styles.btnpwdText}>Change Password</Text>
                                </TouchableOpacity>
                      </View>
              </View>    */}
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={imagePickermodal}
        statusBarTranslucent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setImagePickermodal(!imagePickermodal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerView}>
              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() => {
                  setImagePickermodal(!imagePickermodal);
                }}>
                <IconAntDesign
                  color={colors.buttonColor}
                  size={22}
                  name={'close'}
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>Choose Media</Text>
            </View>
            <View style={styles.subcanbtnContainer}>
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={requestCameraPermission}>
                <Text>Launch Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitContainer}
                onPress={requestGalleryPermission}>
                <Text>Open Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
  },
  headerContainer: {
    width: calcW(0.9),
    height: calcH(0.05),
    //  backgroundColor: colors.buttonColor,
    flexDirection: 'row',
    marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width: calcW(0.9),
    height: calcH(0.2),
    justifyContent: 'center',
    //  position: 'absolute'
    // backgroundColor: colors.buttonColor,
  },

  cameraContainer: {
    left: calcW(0.5),
    width: calcW(0.12),
    height: calcW(0.12),
    borderRadius: calcW(0.3),
    backgroundColor: colors.white,
    position: 'relative',
    marginTop: calcH(0.1),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cameraIcon: {
    // left: calcW(0.025),
    //alignItems: 'center',
    width: calcW(0.06),
    height: calcW(0.06),
  },
  profileImg: {
    left: calcW(0.3),
    width: calcW(0.28),
    height: calcW(0.28),
    borderRadius: calcW(0.14),
    alignItems: 'center',
    borderColor: colors.buttonColor,
    position: 'absolute',
  },
  proname: {
    left: calcW(0.3),
    width: calcW(0.28),
    height: calcW(0.28),
    borderRadius: calcW(0.14),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.buttonColor,
    position: 'absolute',
    backgroundColor: '#878f99',
  },
  desContainer: {
    //  backgroundColor: colors.primary,
    // height: calcH(0.15),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: calcH(0.05),
  },
  proName: {
    // left: calcW(0.1),
    fontSize: 18,
    fontWeight: '600',
    color: '#121212',
  },
  proMail: {
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#121212',
  },

  lowerContainer: {
    backgroundColor: colors.background,
    // height: calcH(0.55),
    flex: 1,
  },
  infoContainer: {
    // marginVertical: calcH(0.09),
    flex: 1,
  },
  inActiveBorder: {
    // width: calcW(0.9),
    // height: calcH(0.08),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    flex: 1,
    // justifyContent: 'center',
    padding: 3,
    alignItems: 'center',
    // paddingVertical: 4,
  },
  activeBorder: {
    // width: calcW(0.9),
    // height: calcH(0.08),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    flex: 1,
    // justifyContent: 'center',
    padding: 3,
    alignItems: 'center',
    // paddingVertical: 4,
  },
  instructionContainer: {
    flexDirection: 'row',
    marginTop: calcH(0.07),
    width: calcW(0.9),
    justifyContent: 'flex-start',
    // backgroundColor: colors.buttonColor
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: colors.textHeader,
  },
  textInput: {
    width: calcW(0.5),
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 10,
    color: colors.black,
    padding: Platform.OS === 'ios' ? 12 : 0,
  },
  btnconfirmContainer: {
    height: calcH(0.08),
    marginTop: calcH(0.01),
  },
  btnContainer: {
    alignItems: 'center',
  },
  btnConfirm: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
  },
  btnpwdConfirm: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonAnothercolor,
    justifyContent: 'center',
  },
  btnconfirmText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  btnpwdText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7A7C80',
    fontWeight: '500',
  },
  editText: {
    left: calcW(0.44),
    fontWeight: '400',
    color: '#B8B8B8',
    fontSize: 16,
  },
  editphnText: {
    left: calcW(0.4),
    fontWeight: '400',
    color: '#B8B8B8',
    fontSize: 16,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: calcW(0.9),
    //height: calcH(0.2),
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: calcW(0.05),
    padding: calcW(0.03),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  headerView: {
    width: '100%',
    height: calcH(0.06),
    justifyContent: 'center',
    // backgroundColor:colors.primary
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },

  subcanbtnContainer: {
    flexDirection: 'row',
    width: '98%',
    marginTop: calcW(0.05),
  },

  cancelContainer: {
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    height: calcH(0.06),
    backgroundColor: colors.buttonColor,
    borderRadius: calcW(0.1),
  },
  submitContainer: {
    width: '48%',
    left: calcW(0.02),
    justifyContent: 'center',
    alignItems: 'center',
    height: calcH(0.06),
    backgroundColor: colors.buttonColor,
    borderRadius: calcW(0.1),
  },
  arrowTurn: {
    // alignItems:'flex-end',
    // backgroundColor :colors.buttonColor,
  },
});
