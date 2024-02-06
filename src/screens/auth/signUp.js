import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
} from '../../utils/comon';

import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import Hud from '../../utils/hud';
import { RFValue } from 'react-native-responsive-fontsize';
import { BASE_URL } from '../../utils/Api/apiName';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'native-base';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

// import userVerification from userVerification;

export default function SignUp(props) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

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
  const [countryCode, setCountryCode] = useState('1')
  const [country, setCountry] = useState(null)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '654075399835-c8o0okncp67jhm8fup7i1ou8mud1idbf.apps.googleusercontent.com',
    });
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
  const selectCountry = (country) => {
    console.log("asfbausy", country.callingCode[0])
    setCountryCode(country.callingCode[0])
    setCountry(country)
  }
  const GetInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      { token, parameters: PROFILE_REQUEST_PARAMS },
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

              console.log('Success', response.data);
            }
          } catch (error) {
            console.log("err fb reg", error.response)
            Toast.show({
              type: 'error',
              text1: Object.values(error.response.data.error)[0][0],
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
        LoginManager.setLoginBehavior("web_only");
      }
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (Platform.OS === 'ios') {
        const res = await AuthenticationToken.getAuthenticationTokenIOS();
        console.log(res?.authenticationToken);
      } else {
        const res = await AccessToken.getCurrentAccessToken();
        console.log(res?.accessToken);
      }
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
      console.log('driverSignUpStated===============>');
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const user = await GoogleSignin.signIn();
      const response = await axios.post(
        'https://kabou.us/api/driver/socialRegister',
        {
          email: user.user.email,
          register_by: 'google',
          name: user.user.name,
        },
      );
      console.log(response);
      if (response.data.success == true) {
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

        console.log('Success', response.data);
      }
    } catch (error) {
      console.error("kyvurt7tut7v", JSON.stringify(error.response));
      Toast.show({
        type: 'error',
        text1: error.response.data.error.email[0],
      });
    }
  };

  const handlesubmit = () => {
    if (name.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your name ',
      });
    } else if (email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your email ',
      });
    } else if (mobile.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your mobile ',
      });
    } else if (password.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your password ',
      });
    } else if (mobile.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid phone number ',
      });
    }
    else if (password !== cPassword) {
      Toast.show({
        type: 'error',
        text1: 'password and confirm password in not match ',
      });
    } else if (toggleCheckBox !== true) {
      Toast.show({
        type: 'error',
        text1: 'Please Accept terms and conditions ',
      });
    } else {
      const body = {
        email: email,
        name: name,
        cellphone: mobile,
        password: password,
        c_password: password,
        state_id: "2",
        dial_code: `+${JSON.parse(countryCode)}`
      };
      Hud.showHud();
      axios({
        method: 'post',
        url: BASE_URL + 'register',
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      })
        .then(response => {
          //setIsLoading(false);
          console.log('+++++++++++Success+++++++++++', response.data);
          Hud.hideHud();
          if (response.data.success === true) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            props.navigation.navigate('userVerification', { userEmail: email, UserPhone: mobile, UserCountry: countryCode });

            AsyncStorage.setItem(
              'userToken',
              JSON.stringify(response.data.data.token),
            );
            AsyncStorage.setItem(
              'userEmail',
              JSON.stringify(response.data.data.driver.email),
            );

            console.log('Success', response.data);
          }
        })
        .catch(err => {
          //setIsLoading(false);
          Hud.hideHud();
          console.log('err', Object.values(err.response.data.error)[0][0]);
          const errapi = Object.values(err.response.data.error)[0][0];
          Toast.show({
            type: 'error',
            text1: errapi,
          });
        });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* <View style={styles.viewOne}>

          </View> */}

          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                marginTop: calcH(0.01),
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
                source={require('../../asserts/logo.png')}
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
                  // <IconAntDesign
                  //   color={colors.activeBorder}
                  //   size={24}
                  //   name={'user'}
                  // />
                  <Image
                    source={require('../../asserts/userdif.png')}
                    style={{
                      width: calcW(0.055),
                      height: calcH(0.03),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/userdif.png')}
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
                    source={require('../../asserts/email.png')}
                    style={{
                      width: calcW(0.058),
                      height: calcH(0.022),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/email.png')}
                    style={{
                      width: calcW(0.058),
                      height: calcH(0.022),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  autoCapitalize="none"
                  value={email}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setEmail(text)}
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
                  <Image
                    source={require('../../asserts/phone.png')}
                    style={{
                      width: calcW(0.06),
                      height: calcH(0.032),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/phone.png')}
                    style={{
                      width: calcW(0.06),
                      height: calcH(0.032),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}
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
                    source={require('../../asserts/password.png')}
                    style={{
                      width: calcW(0.045),
                      height: calcH(0.03),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/password.png')}
                    style={{
                      width: calcW(0.045),
                      height: calcH(0.03),
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
                        source={require('../../asserts/eye.png')}
                        style={{
                          width: calcW(0.06),
                          height: calcH(0.02),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../asserts/eye.png')}
                        style={{
                          width: calcW(0.06),
                          height: calcH(0.02),
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
                        source={require('../../asserts/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.028),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../asserts/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.028),
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
                    source={require('../../asserts/password.png')}
                    style={{
                      width: calcW(0.045),
                      height: calcH(0.03),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/password.png')}
                    style={{
                      width: calcW(0.045),
                      height: calcH(0.03),
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
                        source={require('../../asserts/eye.png')}
                        style={{
                          width: calcW(0.06),
                          height: calcH(0.02),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../asserts/eye.png')}
                        style={{
                          width: calcW(0.06),
                          height: calcH(0.02),
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
                        source={require('../../asserts/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.028),
                          tintColor: colors.activeBorder,
                        }}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={require('../../asserts/eye-off.png')}
                        style={{
                          width: calcW(0.07),
                          height: calcH(0.028),
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
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingHorizontal: calcW(0.02),
                }}>
                <CheckBox
                  disabled={false}
                  // tintColors={toggleCheckBox ? colors.buttonColor : null}
                  tintColors={'#000'}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <Text
                  style={[
                    styles.subText,
                    { fontSize: RFValue(17), flex: 1, textAlign: 'left' },
                  ]}>
                  {' '}
                  Accept terms & conditions
                </Text>
              </View>

              <TouchableOpacity
                style={{ width: calcW(0.9) }}
                // onPress={() => navigation.navigate('userVerification')}
                onPress={() => handlesubmit()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* <Text style={{textAlign: 'center', marginVertical: 10}}>or</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
            <View style={{ padding: allPadding, flex: 1 }}>
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={[
                      styles.subText,
                      { fontSize: RFValue(17), marginVertical: 0 },
                    ]}>
                    Already have a account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('signIn')}>
                    <Text
                      style={[
                        styles.subText,
                        {
                          color: colors.textHeader,
                          fontSize: RFValue(17),
                          fontWeight: 'bold',
                          marginVertical: 0,
                        },
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
    flex: Platform.OS === 'ios' ? 0.3 : 1,
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: calcH(0.004),
  },
  activeBorder: {
    width: calcW(0.9),
    flex: Platform.OS === 'ios' ? 0.3 : null,
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: calcH(0.004),
  },
  headerText: {
    fontSize: RFValue(24),
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: calcH(0.01),
  },
  subText: {
    fontSize: RFValue(17),
    color: colors.subHeader,
    marginVertical: calcH(0.01),
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(16),
    flex: 1,
    paddingLeft: calcW(0.03),
    color: colors.activeBorder,
    padding: Platform.OS === 'ios' ? 12 : 5,
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
