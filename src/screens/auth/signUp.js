import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
  textInputHeight,
  cardHeight,
} from '../../utils/comon';
import commonToast from '../../utils/commonToast';
import IconFontisto from 'react-native-vector-icons/dist/Fontisto';
import IconMaterialIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconIonicons from 'react-native-vector-icons/dist/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import {register} from '../../utils/Api/serverRequest';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import TexttermsCondition from './termsCondition';
import {RFValue} from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud';
import {ScreenScrollComponent} from '../../commonItem';
import {CheckIcon, IconButton, Select, Toast} from 'native-base';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

export default function SignUp({navigation}) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [setModel, setonModel] = useState(false);
  const [termAndCondition, setTermAndCondition] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');

  const [showHide, setShowHide] = useState(false);

  const [showHideCP, setShowHideCP] = useState(false);

  const [showHidePassword, setShowHidePassword] = useState(true);

  const [showHideCPassword, setShowHideCPassword] = useState(true);

  const [focusName, setFocusName] = useState(false);

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusMobile, setFocusMobile] = useState(false);

  const [focusPassword, setFocusPassword] = useState(false);
  const [focusCPassword, setFocusCPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [countryCode, setCountryCode] = useState('1')
  const [country, setCountry] = useState(null)

  const getAllState = async () => {
    try {
      const response = await axios.get('https://kabou.us/api/state-get');
      setSelectedState(response.data.states[0].state_id);
      setState(response.data.states);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '214755125299-dlk54ftmlo9capl1ol47gsuvj9gaaror.apps.googleusercontent.com',
    });
    getAllState();
  }, []);



  const showHidePasswordFun = () => {
    setShowHide(!showHide);
    setShowHidePassword(!showHidePassword);
  };

  const showHideCPasswordFun = () => {
    setShowHideCP(!showHideCP);
    setShowHideCPassword(!showHideCPassword);
  };

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

  const GetInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      async (error, user) => {
        if (error) {
          console.log('login info has error: ' + JSON.stringify(error));
          // Alert.alert('login info has error: ', JSON.stringify(error));
        } else {
          console.log('result:', user);
          try {
            const response = await axios.post(
              'https://kabou.us/api/driver/socialRegister',
              {
                email: user.email,
                register_by: 'fb',
                name: user.name,
              },
            );
            Hud.hideHud();
            console.log('Success', response.data);
            if (response.data.success === true) {
              Toast.show({
                type: 'success',
                text1: response.data.message,
              });
              AsyncStorage.setItem(
                'userToken',
                JSON.stringify(response.data.data.token),
              );
              AsyncStorage.setItem(
                'userEmail',
                JSON.stringify(response.data.data.driver.email),
              );

              
            }
          } catch (error) {
            Hud.hideHud();
            console.log('err fb reg', Object.values(error.response.data.error)[0][0]);
            commonToast({
              text: Object.values(error.response.data.error)[0][0],
              position: 'top',
              toastFor: 'error',
            });
          }
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const signUpWithFacebook = async () => {
    try {
      console.log('facebook signup');
      // Attempt login with permissions
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('web_only');
      }
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      console.log(data);
      GetInfoFromToken(data.accessToken);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const signUpWithGoogle = async () => {
    try {
      console.log('loginStated===============>');
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const user = await GoogleSignin.signIn();
      console.log({
        email: user.user.email,
        register_by: 'google',
        name: user.user.name,
      });
      const response = await axios.post(
        'https://kabou.us/api/rider/socialRegister',
        {
          email: user.user.email,
          register_by: 'google',
          name: user.user.name,
          state_id: selectedState,
        },
      );
      if (response.data.success === true) {
        commonToast({
          text: 'Successfully registered',
          position: 'top',
          toastFor: 'success',
        });
        Hud.hideHud();
      }
    } catch (error) {
      console.log(error);
      // commonToast({
      //   text:
      //     error.response.data.error.email?.[0] ?? 'Google registration failed.',
      //   position: 'top',
      //   toastFor: 'error',
      // });
    }
  };

  const onSignUpPress = () => {
    const testForEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.com/;
    const testForPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const PhoneNumberRegex =
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    if (name === '') {
      commonToast({
        text: 'Please enter name',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (email === '') {
      commonToast({
        text: 'Please enter email',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (!testForEmail.test(email)) {
      commonToast({
        text: 'Please enter valid email',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (mobile === '') {
      commonToast({
        text: 'Please enter mobile no',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (!PhoneNumberRegex.test(mobile)) {
      commonToast({
        text: 'Please enter valid mobile no',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (password === '') {
      commonToast({
        text: 'Please enter password',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (password.length < 8) {
      commonToast({
        text: 'Your password must be at least 8 characters',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (!testForPassword.test(password)) {
      commonToast({
        text: 'Your password must be at least one uppercase letter, one lowercase letter, one special character and one number',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }
    if (password !== cPassword) {
      commonToast({
        text: 'Your password is not match with confirm password',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }
    if (toggleCheckBox === false) {
      commonToast({
        text: 'Please Accept terms and conditions',
        position: 'top',
        toastFor: 'error',
      });
      return;
    }

    if (toggleCheckBox) {
      doRegiser();
    }
  };

  const doRegiser = async () => {
    setIsLoading(true);
    const data = {
      name: name,
      email: email,
      state_id: selectedState,
      password: password,
      cellphone: mobile,
      c_password: cPassword,
      dial_code: `+${JSON.parse(countryCode)}`
    };
    console.log(data);
    Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'register',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        // alert('success');
        setIsLoading(false);

        if (response.data.success === true) {
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'success',
          });
          Hud.hideHud();
          navigation.navigate('userVerification', 
          //{userEmail: email}
          {userEmail: email,
          UserPhone : mobile,
          UserCountry:countryCode
          }
          );
        }
        console.log('Success', response.data);
      })
      .catch(err => {
        // alert('failure');
        setIsLoading(false);
        console.log('err',err.response.data.error);
        Hud.hideHud();
        const errapi = Object.values(err.response.data.error)[0][0];
        commonToast({
          text: errapi,
          position: 'top',
          toastFor: 'error',
        });
      });
  };

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                //marginTop: calcH(0.01),
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: allPadding,
              }}>
              <Image
                style={{
                  height: logoHeight,
                  width: logoWidth,
                  resizeMode: 'contain',
                }}
                source={require('../../../assets/images/logo.png')}
              />
              <Text style={styles.headerText}>Create Account</Text>
              <Text style={styles.subText}>
                Input required details to get started
              </Text>
              <View
                style={
                  focusName === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusName === true ? (
                  <Image
                    source={require('../../../assets/images/userdif.png')}
                    style={{
                      width: calcW(0.055),
                      height: calcH(0.03),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/userdif.png')}
                    style={{
                      width: calcW(0.055),
                      height: calcH(0.03),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
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
                  focusEmail === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusEmail === true ? (
                  <Image
                    source={require('../../../assets/images/email.png')}
                    style={{
                      width: calcW(0.062),
                      height: calcH(0.024),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/email.png')}
                    style={{
                      width: calcW(0.062),
                      height: calcH(0.024),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  value={email}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setEmail(text.toLowerCase())}
                  placeholderTextColor="#C9CCCF"
                />
              </View>

              <Select
                selectedValue={selectedState}
                minWidth={calcW(0.9)}
                // height={calcH(0.075)}
                fontSize={16}
                accessibilityLabel="Choose State"
                placeholder="Choose State"
                placeholderTextColor={'black'}
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

              <View
                style={
                  focusMobile === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                      
                    
                {focusMobile === true ? (
                  <Image
                    source={require('../../../assets/images/phone.png')}
                    style={{
                      width: calcW(0.065),
                      height: calcH(0.034),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/phone.png')}
                    style={{
                      width: calcW(0.065),
                      height: calcH(0.034),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}
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

                <Text style={{color: '#000',marginEnd: 5}}>{countryCode}</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Mobile Number"
                  value={mobile}
                  onBlur={() => onBlurTextInputMobile()}
                  onFocus={() => onFocusTextInputMobile()}
                  onChangeText={text => setMobile(text)}
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
                  <Image
                    source={require('../../../assets/images/password.png')}
                    style={{
                      width: calcW(0.052),
                      height: calcH(0.035),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/password.png')}
                    style={{
                      width: calcW(0.052),
                      height: calcH(0.035),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  value={password}
                  secureTextEntry={showHidePassword}
                  placeholder="Password"
                  onChangeText={text => setPassword(text)}
                  onBlur={() => onBlurTextInputPassword()}
                  onFocus={() => onFocusTextInputPassword()}
                  placeholderTextColor="#C9CCCF"
                />
                {showHide === true ? (
                  <TouchableOpacity onPress={() => showHidePasswordFun()}>
                    {focusPassword === true ? (
                      <Image
                        source={require('../../../assets/images/eye.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.025),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/eye.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.025),
                          tintColor: colors.inActiveBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => showHidePasswordFun()}>
                    {focusPassword === true ? (
                      <Image
                        source={require('../../../assets/images/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.035),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.035),
                          tintColor: colors.inActiveBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={
                  focusCPassword === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusCPassword === true ? (
                  <Image
                    source={require('../../../assets/images/password.png')}
                    style={{
                      width: calcW(0.052),
                      height: calcH(0.035),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/password.png')}
                    style={{
                      width: calcW(0.052),
                      height: calcH(0.035),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  value={cPassword}
                  secureTextEntry={showHideCPassword}
                  placeholder="Confirm Password"
                  onChangeText={text => setCPassword(text)}
                  onBlur={() => onBlurTextInputCPassword()}
                  onFocus={() => onFocusTextInputCPassword()}
                  placeholderTextColor="#C9CCCF"
                />
                {showHideCP === true ? (
                  <TouchableOpacity onPress={() => showHideCPasswordFun()}>
                    {focusCPassword === true ? (
                      <Image
                        source={require('../../../assets/images/eye.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.025),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/eye.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.025),
                          tintColor: colors.inActiveBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => showHideCPasswordFun()}>
                    {focusCPassword === true ? (
                      <Image
                        source={require('../../../assets/images/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.035),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/images/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.035),
                          tintColor: colors.inActiveBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: calcW(0.02),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CheckBox
                  disabled={false}
                  // style={{
                  //   transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                  //   marginRight: 5,
                  // }}
                  tintColors={'#000'}
                  value={toggleCheckBox}
                  onValueChange={newValue => {
                    setToggleCheckBox(newValue), setonModel(true);
                  }}
                  // onChange={() => setonModel(true)}
                />
                <Modal visible={setModel} transparent={true}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        height: calcH(0.05),
                        width: calcW(0.4),
                        borderColor: '#000',
                        borderWidth: 0,
                        marginLeft: calcH(0.5),
                        // marginTop: calcH(0.01),
                        // position: 'absolute',
                      }}
                      onPress={() => {
                        setonModel(false);
                        setTermAndCondition(true);
                      }}>
                      <Image
                        source={require('../../../assets/images/cross_model.png')}
                        style={{
                          height: calcH(0.05),
                          width: calcW(0.09),
                          tintColor: '#fff',
                          position: 'absolute',
                          left: calcW(0.1),
                          // marginBottom: calcH(0.5)
                        }}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: calcW(0.8),
                        height: calcH(0.6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: allPadding,
                      }}>
                      {/* <Text style={styles.text}>There are many variations of passages of</Text>
                        <Text style={styles.text}> Lorem Ipsum available</Text> */}
                      <ScrollView>
                        <TexttermsCondition />
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
                <Text
                  style={[
                    styles.subText,
                    {fontSize: RFValue(17), flex: 1, textAlign: 'left'},
                  ]}>
                  {' '}
                  I accept terms & conditions
                </Text>
              </View>

              {/* {isLoading ? (
                <ActivityIndicator size="large" color={colors.buttonColor} />
              ) : ( */}
              <TouchableOpacity
                style={{width: calcW(0.9)}}
                //onPress={() => navigation.navigate('userVerification')}
                onPress={onSignUpPress}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Sign Up</Text>
                </View>
              </TouchableOpacity>
              {/* )} */}
            </View>
          </View>
          {/* <Text style={{textAlign: 'center', marginVertical: 10}}>or</Text> */}
          {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <IconButton
              colorScheme="lightBlue"
              width="16"
              margin="5"
              size="lg"
              variant="solid"
              _icon={{
                as: IconAntDesign,
                name: 'facebook-square',
              }}
              onPress={signUpWithFacebook}
            />
            <IconButton
              colorScheme="red"
              width="16"
              margin="5"
              size="lg"
              variant="solid"
              _icon={{
                as: IconAntDesign,
                name: 'google',
              }}
              onPress={signUpWithGoogle}
            />
          </View> */}

          <View style={styles.viewThree}>
            <View style={{padding: allPadding, flex: 1}}>
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={[
                      styles.subText,
                      {fontSize: RFValue(17), marginVertical: 0},
                    ]}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('signIn')}>
                    <Text
                      style={[
                        styles.subText,
                        {
                          color: colors.textHeader,
                          fontSize: RFValue(17),
                          fontWeight: 'bold',
                          //marginVertical: 0,
                        },
                        ,
                      ]}>
                      {' '}
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 2,
  },
  viewThree: {
    flex: 1,
  },
  inActiveBorder: {
    width: calcW(0.9),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.018),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    height: calcH(0.075),
    //paddingVertical: calcH(0.004),
  },
  activeBorder: {
    width: calcW(0.9),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.018),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    height: calcH(0.075),
    //paddingVertical: calcH(0.004),
  },
  headerText: {
    fontSize: RFValue(24),
    color: colors.headerText,
    fontWeight: 'bold',
    //marginVertical: calcH(0.01),
  },
  subText: {
    fontSize: RFValue(17),
    color: colors.subHeader,
    //marginVertical: calcH(0.01),
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(16),
    flex: 1,
    paddingLeft: calcW(0.03),
    color: colors.activeBorder,
    height: textInputHeight,
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.03),
  },
  buttonTextStyle: {
    fontSize: RFValue(18),
    color: colors.white,
    marginVertical: calcH(0.01),
    textAlign: 'center',
  },
});
