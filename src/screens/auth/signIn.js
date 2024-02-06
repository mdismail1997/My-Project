import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
} from '../../utils/comon';
import commonToast from '../../utils/commonToast';

import {BASE_URL} from '../../utils/Api/apiName';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as commonService from '../../service/commonService';
import {RFValue} from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud';
import {IconButton, Toast} from 'native-base';
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
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState();

  const [focusPassword, setFocusPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAllState = async () => {
    try {
      const response = await axios.get('https://kabou.us/api/state-get');
      console.log("*******************", response.data);
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
    getAllState()
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

  const onLoginBtnPress = () => {
    const testForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email === '') {
      Toast.show({
        title: 'Please enter your email id',
        placement: 'top',
        textStyle: {color: '#FFF', fontWeight: '500', textAlign: 'center'},
        style: {
          backgroundColor: colors.primary,
          width: calcW(0.5),
          height: calcH(0.05),
        },
      });
      return false;
    }
    //  else if (!testForEmail.test(email)) {
    //   commonToast({
    //     text: 'Please enter valid email',
    //     position: 'top',
    //     toastFor: 'error',
    //   });
    //   return false;
    // }

    if (password === '') {
      Toast.show({
        title: 'Please enter your password',
        placement: 'top',
        textStyle: {color: '#FFF', fontWeight: '500', textAlign: 'center'},
        style: {
          backgroundColor: colors.primary,
          width: calcW(0.6),
          height: calcH(0.06),
          alignItems: 'center',
        },
      });
      return false;
    }

    doLogin();
  };

  const doLogin = async () => {
    setIsLoading(true);
    const FcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('::::::::::::::::::::::::', FcmToken);
    if (!FcmToken) {
      commonToast({
        text: 'No FCM token found.',
        position: 'top',
        toastFor: 'error',
      });
      return;
    }
    const data = {email: email, password: password, fcm_token: FcmToken};

    console.log(data);
    Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        setIsLoading(false);
        console.log('++++++++++++++++', response.data);
        Hud.hideHud();
        if (response.data.message) {
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'success',
          });
        } else {
          commonToast({
            text: response.data.error,
            position: 'top',
            toastFor: 'error',
          });
        }
        // commonToast({
        //   text: response.data,
        //   position: 'top',
        //   toastFor: 'success',
        // });

        let loginData = {
          id: response.data.data.rider.id,
          name: response.data.data.rider.name,
          email: response.data.data.rider.email,
          mobile: response.data.data.rider.cellphone,
          token: response.data.data.token,
        };
        commonService.storeData('userData', JSON.stringify(loginData));
        AsyncStorage.setItem('userToken', JSON.stringify(response));
        props.navigation.replace('TabScreen');
        console.log('Success', response.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        Hud.hideHud();
        console.log('err', err.response.data.message);
        if (err.response.data.message) {
          commonToast({
            text: err.response.data.message,
            position: 'top',
            toastFor: 'error',
          });
        } else {
          const errapi = Object.values(err.response.data.error)[0][0];
          commonToast({
            text: errapi,
            position: 'top',
            toastFor: 'error',
          });
        }
      });
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
          Hud.showHud()
          try {
            console.log('result:', user, selectedState);
            const FcmToken = await AsyncStorage.getItem('fcmToken');
            console.log('::::::::::::::::::::::::', FcmToken, selectedState);
            if (!FcmToken) {
              commonToast({
                text: 'No FCM token found.',
                position: 'top',
                toastFor: 'error',
              });
              return;
            }
            const response = await axios.post(
              'https://kabou.us/api/rider/go_fb_SocialRegisterWithLogin',
              {
                name: user.name,
                email: user.email,
                register_by: 'fb',
                fcm_token: FcmToken,
                state_id: selectedState,
              },
            );
            console.log("facebook  login", response.data);
            Hud.hideHud()
            commonToast({
              text: response.data.message,
              position: 'top',
              toastFor: 'success',
            });
            let loginData = {
              id: response.data.data.userData.id,
              name: response.data.data.userData.name,
              email: response.data.data.userData.email,
              mobile: response.data.data.userData.cellphone,
              token: response.data.data.token,
            };
            if(response.data.success){
              commonToast({
                text: response.data.message,
                position: 'top',
                toastFor: 'success',
              });
            }
            commonService.storeData('userData', JSON.stringify(loginData));
            AsyncStorage.setItem('userToken', JSON.stringify(response));
            props.navigation.replace('TabScreen');
            console.log('Success', response.data.data);
          } catch (err) {
            Hud.hideHud()
            
            commonToast({
              text: error.response.data.error.email[0],
              position: 'top',
              toastFor: 'error',
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
        LoginManager.setLoginBehavior('web_only');
      }
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      console.log(result);

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
      console.log('loginStated====123===========>');
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const user = await GoogleSignin.signIn();
      console.log("============signInWithGoogle===============",user);
      const FcmToken = await AsyncStorage.getItem('fcmToken');
      console.log('::::::::::::::::::::::::', FcmToken);
      if (!FcmToken) {
        commonToast({
          text: 'No FCM token found.',
          position: 'top',
          toastFor: 'error',
        });
        return;
      }
      Hud.showHud()
      const response = await axios.post(
        'https://kabou.us/api/rider/go_fb_SocialRegisterWithLogin',
        {
          email: user.user.email,
          register_by: 'google',
          fcm_token: FcmToken,
          name: user.user.name,
          state_id: selectedState,
        },
      );
      Hud.hideHud()
      commonToast({
        text: response.data.message,
        position: 'top',
        toastFor: 'success',
      });
      let loginData = {
        id: response.data.data.userData.id,
        name: response.data.data.userData.name,
        email: response.data.data.userData.email,
        mobile: response.data.data.userData.cellphone,
        token: response.data.data.token,
      };
      commonService.storeData('userData', JSON.stringify(loginData));
      AsyncStorage.setItem('userToken', JSON.stringify(response));
      props.navigation.replace('TabScreen');
      console.log('Success', response.data.data);
    } 
    catch (error) {
      console.log(error.response);
      Hud.hideHud()
      // Toast.show({
      //   type: 'error',
      //   text1: error.response.data.error.email[0],
      // });
      commonToast({
        text: error.response.data.error.email[0],
        position: 'top',
        toastFor: 'error',
      });
    }
  };
  // console.log("+++++++++++++++++",email)

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: calcH(0.01),
                alignItems: 'center',
                padding: allPadding,
              }}>
              <Image
                style={{
                  height: logoHeight,
                  width: logoWidth,
                  resizeMode: 'contain',
                  marginBottom: calcH(0.015),
                }}
                source={require('../../../assets/images/logo.png')}
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
                  <Image
                    source={require('../../../assets/images/email.png')}
                    style={styles.activeImage}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/email.png')}
                    style={styles.inactiveImage}
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
                          height: calcH(0.02),
                          tintColor: colors.activeBorder,
                        }}
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
              <TouchableOpacity
                style={{width: calcW(0.9)}}
                onPress={onLoginBtnPress}>
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
                        ,
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
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.025),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    height: calcH(0.08),
  },
  activeBorder: {
    width: calcW(0.9),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.025),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    height: calcH(0.08),
  },
  headerText: {
    fontSize: RFValue(25),
    color: colors.headerText,
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
    height: textInputHeight,
    color: colors.activeBorder,
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
  activeImage: {
    width: calcW(0.055),
    height: calcH(0.022),
  },
  inactiveImage: {
    width: calcW(0.055),
    height: calcH(0.022),
    tintColor: colors.inActiveBorder,
  },
});
