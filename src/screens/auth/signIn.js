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
  Platform,
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

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Hud from '../../utils/hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {BASE_URL} from '../../utils/Api/apiName';
import {IconButton} from 'native-base';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';

export default function SignIn(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showHide, setShowHide] = useState(false);

  const [showHidePassword, setShowHidePassword] = useState(true);

  const [focusEmail, setFocusEmail] = useState(false);

  const [focusPassword, setFocusPassword] = useState(false);
  //const [doc, setDoc] = useState(null);
  //const [documents, setDocuments] = useState(null);

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

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  const onFocusTextInputPassword = () => {
    setFocusPassword(true);
  };

  const onBlurTextInputPassword = () => {
    setFocusPassword(false);
  };

  const handlesubmit = async () => {
    const FcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('::::::::::::::::::::::::', FcmToken);
    if (!FcmToken) {
      Toast.show({
        type: 'error',
        text1: 'No FCM token found.',
      });
      return;
    }
    if (email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your email ',
      });
    } else if (password.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your password ',
      });
    } else {
      const body = {
        email: email,
        password: password,
        fcm_token: FcmToken,
      };
      console.log('login data: ', body);
      Hud.showHud();
      await axios({
        method: 'post',
        url: `${BASE_URL}login`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      })
        .then(response => {
          //setIsLoading(false);
          console.log('Success===========', response.data);
          Hud.hideHud();
          if (response.data.message) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: response.data.error,
            });
          }

          if (response.data.data.documentVerifyStatus === true) {
            setTimeout(() => {
              props.navigation.replace('mainNavigation');
            }, 1000);
          } else {
            setTimeout(() => {
              props.navigation.replace('mainNavigation');
            }, 1000);
          }

          AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          AsyncStorage.setItem(
            'userEmail',
            JSON.stringify(response.data.data.driver.email),
          );
          AsyncStorage.setItem(
            'userName',
            JSON.stringify(response.data.data.driver.name),
          );
          AsyncStorage.setItem(
            'userID',
            JSON.stringify(response.data.data.driver.id),
          );

          //props.navigation.navigate('mainNavigation');
          console.log('Success', response.data);
        })
        .catch(err => {
          //setIsLoading(false);
          Hud.hideHud();
          console.log('err', err.response.data);
          // const error = JSON.parse(err.error)

          if (err.response.data.message) {
            Toast.show({
              type: 'error',
              text1: err.response.data.message,
            });
          } else {
            const errapi = Object.values(err.response.data.error)[0][0];
            Toast.show({
              type: 'error',
              text1: errapi,
            });
          }
        });
    }
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
          const FcmToken = await AsyncStorage.getItem('fcmToken');
          console.log('::::::::::::::::::::::::', FcmToken);
          if (!FcmToken) {
            Toast.show({
              type: 'error',
              text1: 'No FCM token found.',
            });
            return;
          }
          try {
            const response = await axios.post(
              'https://kabou.us/api/driver/go_fb_SocialRegisterWithLogin',
              {
                name: user.name,
                email: user.email,
                register_by: 'fb',
                fcm_token: FcmToken,
              },
            );
            if (response.data.message) {
              Toast.show({
                type: 'success',
                text1: response.data.message,
              });
            } else {
              Toast.show({
                type: 'error',
                text1: response.data.error,
              });
            }

            setTimeout(() => {
              props.navigation.replace('mainNavigation');
            }, 1000);

            AsyncStorage.setItem(
              'userToken',
              JSON.stringify(response.data.data.token),
            );
            AsyncStorage.setItem(
              'userEmail',
              JSON.stringify(response.data.data.userData.email),
            );
            AsyncStorage.setItem(
              'userName',
              JSON.stringify(response.data.data.userData.name),
            );
            AsyncStorage.setItem(
              'userID',
              JSON.stringify(response.data.data.userData.id),
            );
          } catch (error) {
            console.log('error fb login', error.response);
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


  const signInWithFacebook = async () => {
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

  const signInWithGoogle = async () => {
    try {
      console.log('driverLoginStated===============>');
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const user = await GoogleSignin.signIn();
      console.log('user data', user.user);
      const FcmToken = await AsyncStorage.getItem('fcmToken');
      console.log('::::::::::::::::::::::::', FcmToken);
      if (!FcmToken) {
        Toast.show({
          type: 'error',
          text1: 'No FCM token found.',
        });
        return;
      }
      try {
        const response = await axios.post(
          'https://kabou.us/api/driver/go_fb_SocialRegisterWithLogin',
          {
            email: user.user.email,
            register_by: 'google',
            fcm_token: FcmToken,
            name: user.user.name,
          },
        );
        console.log(response.data);
        if (response.data.message) {
          Toast.show({
            type: 'success',
            text1: response.data.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: response.data.error,
          });
        }

        setTimeout(() => {
          props.navigation.replace('mainNavigation');
        }, 1000);
        AsyncStorage.setItem('userResponse', JSON.stringify(response.data));
        AsyncStorage.setItem(
          'userToken',
          JSON.stringify(response.data.data.token),
        );
        AsyncStorage.setItem(
          'userEmail',
          JSON.stringify(response.data.data.userData.email),
        );
        AsyncStorage.setItem(
          'userName',
          JSON.stringify(response.data.data.userData.name),
        );
        AsyncStorage.setItem(
          'userID',
          JSON.stringify(response.data.data.userData.id),
        );
      } catch (err) {
        console.log('*****', err.response.data.error.email[0]);
        await GoogleSignin.signOut();
        Toast.show({
          type: 'error',
          text1: err.response.data.error.email[0],
        });
      }
    } catch (error) {
      console.log(error.response);
      await GoogleSignin.signOut();
      Toast.show({
        type: 'error',
        text1: error.response.data.error.email[0],
      });
    }
  };



  return (
    <SafeAreaView style={styles.cover}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* <View style={styles.viewOne}>

          </View> */}

          <View style={styles.viewTwo}>
            <View style={styles.new}>
              <Image
                style={{
                  width: logoWidth,
                  height: logoHeight,
                  resizeMode: 'contain',
                  marginBottom: calcH(0.015),
                }}
                source={require('../../asserts/logo.png')}
              />
              <Text style={styles.headerText}>Sign In</Text>
              <Text style={styles.subText}>
                Input login id & password to get started
              </Text>
              <View
                style={
                  focusEmail === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusEmail === true ? (
                  // <IconFontisto
                  //   color={colors.activeBorder}
                  //   size={24}
                  //   name={'email'}
                  // />
                  <Image
                    source={require('../../asserts/email.png')}
                    style={styles.activeImage}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/email.png')}
                    style={styles.inactiveImage}
                    resizeMode={'contain'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  keyboardType="email-address"
                  value={email}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  autoCapitalize="none"
                  onChangeText={text => setEmail(text.toLowerCase())}
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
                      width: calcW(0.052),
                      height: calcH(0.035),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/password.png')}
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
              <TouchableOpacity
                style={{width: calcW(0.9)}}
                // onPress={() => navigation.navigate('')}>
                onPress={() => handlesubmit()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Sign In</Text>
                </View>
              </TouchableOpacity>

              <Text style={{textAlign: 'center', marginVertical: 10}}>or</Text>
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
                  onPress={signInWithFacebook}
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
                  onPress={signInWithGoogle}
                />
              </View>

              <TouchableOpacity
                onPress={() => props.navigation.navigate('forgetPassword')}>
                <Text
                  style={[
                    styles.subText,
                    {fontSize: RFValue(16), marginVertical: calcH(0.06)},
                  ]}>
                  Forget Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
                      {fontSize: RFValue(16), marginVertical: 0},
                    ]}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('signUp')}>
                    <Text
                      style={[
                        styles.subText,
                        {
                          color: colors.textHeader,
                          fontSize: RFValue(16),
                          fontWeight: 'bold',
                          marginVertical: 0,
                        },
                      ]}>
                      {' '}
                      Sign Up
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
  cover: {
    flex: 1,
    backgroundColor: colors.background,
  },
  new: {
    flex: 1,
    justifyContent: 'center',
    marginTop: calcH(0.01),
    alignItems: 'center',
    padding: allPadding,
  },
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
    marginVertical: calcH(0.025),
    flexDirection: 'row',
    padding: 8,
    // paddingHorizontal: allPadding,
    alignItems: 'center',
    // paddingVertical: calcH(0.001),
  },
  activeBorder: {
    width: calcW(0.9),
    flex: Platform.OS === 'ios' ? 0.3 : null,
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.025),
    flexDirection: 'row',
    // paddingHorizontal: 15,
    padding: 8,
    alignItems: 'center',
    //paddingVertical: 2,
  },
  headerText: {
    fontSize: RFValue(25),
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: calcH(0.02),
  },
  subText: {
    fontSize: RFValue(17),
    color: colors.subHeader,
    marginVertical: calcH(0.02),
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(17),
    flex: 1,
    paddingLeft: calcW(0.03),
    color: colors.activeBorder,
    padding: Platform.OS === 'ios' ? 12 : 0,
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  buttonTextStyle: {
    fontSize: RFValue(18),
    color: colors.white,
    // marginVertical: 10,
    textAlign: 'center',
  },
  activeImage: {width: calcW(0.062), height: calcH(0.024)},
  inactiveImage: {
    width: calcW(0.062),
    height: calcH(0.024),
    tintColor: colors.inActiveBorder,
  },
});
