import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
} from '../../utils/comon';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconIonicons from 'react-native-vector-icons/dist/Ionicons';
import IconSimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import IconM from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
//import {ImagePickerModal} from './../../Components/image-picker-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { BASE_URL } from '../../utils/Api/apiName';
import Hud from '../../utils/hud';
import { CheckIcon, Select } from 'native-base';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'


export default function Account({ navigation }) {
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');

  const [mobile, setMobile] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState();

  // const [showHide, setShowHide] = useState(false);

  // const [showHideCP, setShowHideCP] = useState(false);

  // const [showHidePassword, setShowHidePassword] = useState(true);

  // const [showHideCPassword, setShowHideCPassword] = useState(true);

  const [focusName, setFocusName] = useState(false);

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusMobile, setFocusMobile] = useState(false);

  const [focusPassword, setFocusPassword] = useState(false);
  const [focusCPassword, setFocusCPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('1')
  const [country, setCountry] = useState(null)

  //const [visible, setVisible] = useState(false);

  // const showHidePasswordFun = () => {
  //   setShowHide(!showHide);
  //   setShowHidePassword(!showHidePassword);
  // };

  // const showHideCPasswordFun = () => {
  //   setShowHideCP(!showHideCP);
  //   setShowHideCPassword(!showHideCPassword);
  // };

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  const onFocusTextInputMobile = () => {
    setFocusMobile(true);
  };

  const onBlurTextInputMobile = () => {
    setFocusMobile(false);
  };

  const onFocusTextInputPassword = () => {
    setFocusPassword(true);
  };

  const onBlurTextInputPassword = () => {
    setFocusPassword(false);
  };

  const onFocusTextInputCPassword = () => {
    setFocusCPassword(true);
  };

  const onBlurTextInputCPassword = () => {
    setFocusCPassword(false);
  };
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);
  const getAllState = async () => {
    try {
      const response = await axios.get('https://kabou.us/api/state-get');
      //console.log("============{}{}{}{}============", response.data);
      setState(response.data.states);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllState();
  }, []);
  // ----------------------------------------------------------------------------------------------------
  const getProfile = async () => {
    // const profileData = JSON.parse(await AsyncStorage.getItem('user_doc'));
    // console.log('profileData', profileData);
    // setProfileImg(profileData.data.profile_photo);
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const userId = JSON.parse(await AsyncStorage.getItem('userID'));
    console.log('token', userId, token);
    Hud.showHud()
    axios({
      method: 'get',
      url: BASE_URL + `profile-details/${userId}`,
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        console.log("========getProfile============", response.data);
        Hud.hideHud()
        // setProfileImg(response.data.profile_photo);

        setImage(response.data.profile_photo);
        setCity(response.data.city);
        setName(response.data.name);
        // setFilePath(response.data.profile_photo)

        setMobile(response.data.cellphone);

        if (response.data.dial_code == null) {
          setCountryCode("1")

        } else {
          setCountryCode(response.data.dial_code)
        }
        setZip(response.data.zip);
        setStreet(response.data.street);
        setSelectedState(response.data.state_id ?? 1);
      })
      .catch(err => {
        console.log('err', err);
        Hud.hideHud()
        Alert.alert(err);
      });
  };

  const handlesubmit = async () => {
    const PhoneNumberRegex =
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    if (name.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your name ',
      });
    } else if (!PhoneNumberRegex.test(mobile)) {
      Toast.show({
        type: 'error',
        text1: 'Please enter valid mobile number ',
      });
    } else if (street === null) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your street ',
      });
    } else if (city === null) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your city ',
      });
    } else if (zip === null) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your Zip ',
      });
    } else {
      const body = {
        name: name,
        cellphone: mobile,
        street: street,
        city: city,
        zip: zip,
        state_id: selectedState,
        dial_code: `${JSON.parse(countryCode)}`
        // dial_code: `+${JSON.parse(countryCode)}`
      };
      console.log('profile', body);

      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      Hud.showHud();
      axios({
        method: 'post',
        url: BASE_URL + 'update-profile',
        headers: {
          Accept: 'application/json',
          authorization: 'Bearer ' + token,
        },
        data: body,
      })
        .then(response => {
          console.log(response.data);
          Hud.hideHud();


          if (response.data.success) {
            Toast.show({
              type: 'success',
              text1: response.data.success,
            });
            navigation.navigate('homeScreen');
          } else {
            Toast.show({
              type: 'error',
              text1: response.data.message,
            });
          }

          // setFilePath(response.data.profile_photo)
        })
        .catch(err => {
          console.log('errupdaterofile', JSON.stringify(err));
          Hud.hideHud();
          Toast.show({
            type: 'error',
            text1: err.data.message,
          });
        });
    }
  };

  // --------------------Profile image upload here---------------------------------------------------

  // console.log('userData========>', userData);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <View style={styles.viewOne}>

          </View> */}

      <View style={styles.container}>
        {/* <View style={styles.viewOne}>

          </View> */}

        <View
          style={{
            position: 'relative',
            left: 1,
            // top: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: calcH(0.1),
            width: calcW(1.5),
            borderColor: '#000',
            elevation: 1,
            paddingLeft: allPadding,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconAntDesign
              color={colors.textHeader}
              size={24}
              name={'arrowleft'}
            />
            <Text style={[styles.subText, { fontWeight: 'bold', fontSize: 18 }]}>
              {'   '}Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                // marginTop: calcW(0.01),
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: allPadding,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  // marginTop: calcH(0.005),
                }}>
                <View
                  style={{
                    borderRadius: 78,
                  }}>
                  {/* {filePath ? (
                    <Image
                      style={{
                        height: 128,
                        width: 128,
                        resizeMode: 'cover',
                        overflow: 'hidden',
                        borderRadius: 78,
                        borderColor: colors.buttonColor,
                        borderWidth: 2,
                      }}
                      source={{uri: filePath.assets[0].uri}}
                    />
                  ) : (
                    <Image
                      style={{
                        height: 128,
                        width: 128,
                        resizeMode: 'cover',
                        overflow: 'hidden',
                        borderRadius: 78,
                        borderColor: colors.buttonColor,
                        borderWidth: 2,
                      }}
                      source={{uri: profileimg}}
                    />
                  )}
                  {/* <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '68%',
                      backgroundColor: colors.white,
                      padding: 15,
                      borderRadius: 30,
                      elevation: 10,
                    }}
                    onPress={() => setVisible(true)}>
                    <IconEntypo color={'#003169'} size={24} name={'camera'} />
                  </TouchableOpacity> */}

                  {/* <ImagePickerModal
                    isVisible={visible}
                    onClose={() => setVisible(false)}
                    onImageLibraryPress={onImageLibraryPress}
                    onCameraPress={onCameraPress}
                  /> */}
                  {image === null ? (
                    <View style={styles.proname}>
                      <Text style={{ fontSize: RFValue(55), color: colors.activeBorder }}>{name.charAt(0)}</Text>
                    </View>
                  ) : (
                    <Image
                      style={{
                        height: 128,
                        // top: calcH(-0.05),
                        width: 128,
                        resizeMode: 'cover',
                        overflow: 'hidden',
                        borderRadius: 78,
                        borderColor: colors.buttonColor,
                        borderWidth: 2,
                      }}
                      source={{ uri: image }}
                    />
                  )}

                </View>

                {/* <Text
                  style={[
                    styles.headerText,
                    {
                      marginVertical: 0,
                      fontSize: RFValue(18),
                      marginTop: calcH(-0.02),
                    },
                  ]}>
                  {userData ? console.log("grsgvrfs",userData.driver.name) : ''}
                  
                </Text>
                <Text
                  style={[
                    styles.subText,
                    {marginVertical: 0, fontSize: RFValue(18)},
                  ]}>
                  {userData ? userData.driver.email : ''}
                 
                </Text> */}
              </View>

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
                  placeholder="Name"
                  value={name}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setName(text)}
                  placeholderTextColor="#C9CCCF"
                />

              </View>

              <View
                style={
                  focusMobile === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                <CountryPicker
                  onSelect={value => {
                    console.log('VAL', value);

                    // setCca2(value.cca2);
                    setCountry(value.name);
                    // setRegion(value.region);
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
                <Text style={{ color: '#000', marginEnd: 5 }}>{countryCode}</Text>
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
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  placeholder="Mobile Number"
                  value={mobile}
                  onBlur={() => onBlurTextInputMobile()}
                  onFocus={() => onFocusTextInputMobile()}
                  onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
                  placeholderTextColor="#C9CCCF"
                />

              </View>

              <View
                style={
                  focusEmail === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusEmail === true ? (
                  <IconSimpleLineIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'directions'}
                  />
                ) : (
                  <IconSimpleLineIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'directions'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Street"
                  value={street}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setStreet(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>

              <View
                style={
                  focusPassword === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusPassword === true ? (
                  <IconSimpleLineIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'location-pin'}
                  />
                ) : (
                  <IconSimpleLineIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'location-pin'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  value={city}
                  placeholder="City"
                  onChangeText={text => setCity(text)}
                  onBlur={() => onBlurTextInputPassword()}
                  onFocus={() => onFocusTextInputPassword()}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusCPassword === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusCPassword === true ? (
                  <IconIonicons
                    color={colors.activeBorder}
                    size={24}
                    name={'pin-outline'}
                  />
                ) : (
                  <IconIonicons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'pin-outline'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={zip}
                  placeholder="Zip"
                  onChangeText={text => setZip(text)}
                  onBlur={() => onBlurTextInputCPassword()}
                  onFocus={() => onFocusTextInputCPassword()}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <Select
                selectedValue={selectedState}
                minWidth={calcW(0.9)}
                padding={3}
                fontSize={RFValue(16)}
                color={colors.activeBorder}
                // height={calcH(0.075)}
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
              {/* handlesubmit */}
              <TouchableOpacity
                style={{ width: calcW(0.9) }}
                onPress={() => handlesubmit()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Update</Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => navigation.navigate('')}>
                <View
                  style={[styles.buttonStyle, {backgroundColor: '#F5F5F5'}]}>
                  <Text style={[styles.buttonTextStyle, {color: '#7A7C80'}]}>
                    Change Password
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 1,
  },
  viewThree: {
    flex: 1,
  },
  inActiveBorder: {
    width: calcW(0.9),
    flex: Platform.OS === 'ios' ? 0.15 : null,
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.008),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    //paddingVertical: calcH(0.005),
  },
  activeBorder: {
    width: calcW(0.9),
    flex: Platform.OS === 'ios' ? 0.15 : null,
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    marginVertical: calcH(0.008),
    //paddingVertical: 2,
  },
  headerText: {
    fontSize: RFValue(24),
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: calcH(0.01),
  },
  subText: {
    fontSize: RFValue(16),
    color: colors.subHeader,
    marginVertical: calcH(0.01),
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(16),
    flex: 1,
    paddingLeft: calcW(0.03),
    color: colors.activeBorder,
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.04),
  },
  buttonTextStyle: {
    fontSize: RFValue(18),
    color: colors.white,
    marginVertical: 0,
    textAlign: 'center',
  },
  proname: {

    width: calcW(0.32),
    height: calcW(0.3),
    borderRadius: calcW(0.14),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.buttonColor,
    borderWidth: 1
    // position: 'absolute',
    // backgroundColor: '#878f99',
  },
});
