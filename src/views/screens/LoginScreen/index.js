import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
  Modal,
  TouchableOpacity,
  I18nManager,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toast from 'react-native-toast-message';

import Loader from '../../components/Loader';
import styles from './style';
import {
  calcH,
  calcW,
  STYLES,
  STORAGE_KEY,
  API_TOKEN,
} from '../../../utils/constants/common';
import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';
import {
  createpost,
  createformdata,
  createGet,
  createPut,
} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import {AuthContext} from '../../components/context';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import mmkv from '../../../utils/constants/mmkv/index.js';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

const LoginScreen = ({navigation}) => {
  const {signIn} = React.useContext(AuthContext);
  const [inputs, setInputs] = React.useState({
    email: '',
    password: '',
    forgotEmail: '',
    resToken: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '786530219411-hh2q7914j2q58o806q4v7nhk53j5snvt.apps.googleusercontent.com',
    });
    selectedLng();
  }, []);

  const setToastMsg = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.TOP);
  };
  const selectedLng = async () => {
    setLoading(true);
    const lngData = getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true);
    }
    console.log('selected Language data==>>>', lngData);
    setLoading(false);
  };

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please enter email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please enter password', 'password');
      isValid = false;
    }
    if (isValid) {
      doLogin();
    }
  };

  const doLogin = async email => {
    setLoading(true);
    if (email) {
      const data = {
        data: {
          email: email,
        },
      };
      try {
        let result = await createpost({
          tokenType: 'adminAdd',
          url: `${commonUrl.oneClickSocialLogin}`,
          body: data,
        });
        console.log('result.data doLogin with social email', result.data);
        if (result.data === 'email is not exist') {
          console.log('token ==> ', result.data);

          Toast.show({
            text1: `Email not found`,
            type: 'error',
            position: 'bottom',
          });
        } else {
          mmkv.store(
            STORAGE_KEY.CUSTOMER_TOKEN,
            result.data[0]?.customer_token,
          );
          await getUserDetails();
          Toast.show({
            text1: `Login Successful.`,
            type: 'success',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('doLoginError', error);
        setLoading(false);
        Toast.show({
          text1: `Invalid Email id/Password.`,
          text2: `or your account is disabled temporarily.`,
          type: 'error',
        });
      }
    } else {
      try {
        console.log('email- typed', inputs.email, inputs.password);

        const data = {
          username: inputs.email.trim(),
          password: inputs.password,
        };

        let result1 = await createpost({
          tokenType: 'adminAdd',
          url: `${commonUrl.generateToken}`,
          body: {
            username: inputs.email.trim(),
            password: inputs.password,
          },
        });
        console.log('dologin result', result1.data);
        if (result1.status === 200) {
          console.log('token ==> ', result1.data);
          mmkv.store(STORAGE_KEY.CUSTOMER_TOKEN, result1.data);
          await getUserDetails();
          Toast.show({
            text1: `Login Successful.`,
            type: 'success',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('doLoginError', error);
        setLoading(false);
        Toast.show({
          text1: `Invalid Email id/Password.`,
          text2: `or your account is disabled temporarily.`,
          type: 'error',
        });
      }
    }
  };

  const getUserDetails = async () => {
    try {
      let result = await createGet({
        tokenType: 'self',
        url: commonUrl.customerDetails,
      });
      if (result.status === 200) {
        mmkv.store(STORAGE_KEY.CUSTOMER_DETAILS, {
          ...result.data,
          loggedIn: true,
        });

        signIn({...result.data, loggedIn: true});
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
      console.log(error.response.data.message);
    } finally {
    }
  };

  const forgotPasswordBtnPress = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.forgotEmail) {
      handleError('Please enter email', 'forgotEmail');
      isValid = false;
    } else if (!inputs.forgotEmail.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'forgotEmail');
      isValid = false;
    }
    if (isValid) {
      await doForgetPassword();
    }
  };

  const doForgetPassword = async () => {
    setLoading(true);
    try {
      let result = await createPut({
        tokenType: 'admin',
        url: commonUrl.forgot_password,
        body: {
          email: inputs.forgotEmail.trim(),
          template: 'email_reset',
          websiteId: 1,
        },
      });
      console.log(`result`, result.data);
      if (result.status === 200) {
        setLoading(false);
        setModalVisible(false);
        Toast.show({
          text1: `Please check your email address to reset your password`,
          type: 'info',
        });
      } else {
        setLoading(false);
        setToastMsg('Oops Somthing Wrong!');
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `Email address not found.`,
        type: 'error',
      });
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const hangleGoogleOnPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('dataaaaaaaaaaaaaaaaaaaa', userInfo);
      //navigation.navigate("RegistrationScreen", { userInfo });
      await SocialLogin(userInfo.user);
    } catch (error) {
      console.log(error);
    }
  };

  const SocialLogin = async userInfo => {
    console.log('userInfo social login', userInfo);
    setLoading(true);
    const password = 'Admin123@123';
    const data = {
      sellerinfo: {
        mail: userInfo.email,
      },
    };
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: commonUrl.isSeller, //registration
        body: data,
      });
      console.log(`result`, result.data);
      if (result.data === false) {
        setLoading(false);
        navigation.navigate('RegistrationScreen', {info: userInfo});
      } else {
        setLoading(false);
        doLogin(userInfo.email);
      }
    } catch (error) {
      setLoading(false);
      console.log('SocialLogin/registration error', error);
      Toast.show({
        text1: `${error.response.data.message}`,
        type: 'error',
      });
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleFbLogin = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      console.log('User cancelled the login process');
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    return auth().signInWithCredential(facebookCredential);
  };
  const hangleAppleOnPress = async() =>{
    console.log("VVVVVVVVVVVVVV")

  };

  return (
    <>
      <Loader visible={loading} />
    
      <SafeAreaView style={{flex: 1}}>
      <ScrollView 
          //showsVerticalScrollIndicator={true}
         // style={styles.container}
          keyboardShouldPersistTaps={'handled'}
           style={!modalVisible ? styles.container : styles.afterContainer}
          >
        
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <Loader visible={loading} />
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.crossContainer}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Image
                      source={require('../../../assets/cross.png')}
                      style={styles.crossIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.topModalTxt}>
                  <Text style={styles.topTxt}>
                    {strings.FORGET_YOUR_PASSWORD}
                  </Text>
                </View>
                <View style={styles.inputContainer3}>
                  <Input
                    onChangeText={text => handleOnchange(text, 'forgotEmail')}
                    onFocus={() => handleError(null, 'forgotEmail')}
                    iconName="email-outline"
                    placeholder={strings.ENTER_YOUR_EMAIL}
                    label={strings.ENTER_YOUR_EMAIL}
                    error={errors.forgotEmail}
                    maxLength={80}
                  />
                </View>
                <View style={styles.inputContainer3}>
                  <Button
                    onPress={forgotPasswordBtnPress}
                    title={strings.SUBMIT}
                    bgColor={COLORS.header_color}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <View
            style={{paddingTop: calcH(0.02), paddingHorizontal: calcW(0.06)}}>
            <Text style={styles.textHeader}>{strings.SIGNNOW}</Text>
            <Text style={styles.subHeader}>{strings.SIGN_IN_AS_A_TRADERS}</Text>
            <View style={{marginVertical: calcW(0.05)}}>
              <Input
                onChangeText={text => handleOnchange(text, 'email')}
                onFocus={() => handleError(null, 'email')}
                iconName="email-outline"
                placeholder={strings.ENTER_YOUR_EMAIL}
                error={errors.email}
                maxLength={80}
              />
              <Input
                onChangeText={text => handleOnchange(text, 'password')}
                onFocus={() => handleError(null, 'password')}
                iconName="lock-outline"
                placeholder={strings.PASSWORD}
                error={errors.password}
                password
                maxLength={25}
              />
              <Button
                title={strings.LOGIN}
                bgColor={COLORS.BlackTie}
                onPress={validate}
              />
              <View>
                <TouchableOpacity onPress={openModal}>
                  <Text
                    style={{
                      color: COLORS.black,
                      textAlign: 'center',
                      fontSize: 15,
                      fontWeight: '400',
                    }}>
                    {strings.FORGOT_PASSWORD}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.orHeaderContainer}>
                <View
                  style={{flex: 1, height: 0.8, backgroundColor: 'black'}}
                />
                <View>
                  <Text style={styles.orHeader}> {strings.OR} </Text>
                </View>
                <View
                  style={{flex: 1, height: 0.8, backgroundColor: 'black'}}
                />
              </View>
              <View style={styles.socialIconContainer}>
                <TouchableOpacity
                  style={styles.googleContainer}
                  onPress={hangleGoogleOnPress}>
                  <Image
                    source={require('../../../assets/google.png')}
                    style={styles.leftImg}
                  />
                  <Text style={styles.googleText}>{strings.GOOGLE}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleFbLogin()
                      .then(async res => {
                        console.log(`res fblogin`, res);
                        await SocialLogin(res?.additionalUserInfo?.profile);
                      })
                      .catch(error => console.log(`error in fbSignin`, error))
                  }
                  style={styles.googleContainer}>
                  <Image
                    source={require('../../../assets/fb.png')}
                    style={styles.leftImg}
                  />
                  <Text style={styles.googleText}>{strings.FACEBOOK} </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.googleContainer}
                  onPress={hangleAppleOnPress}>
                  <Image
                    source={require('../../../assets/apple.png')}
                    style={styles.leftImg}
                  />
                  <Text style={styles.googleText}>{strings.GOOGLE}</Text>
                </TouchableOpacity>
                
              </View>
              <Text
                onPress={() => navigation.navigate('RegistrationScreen')}
                style={styles.signUpTxtContainer}>
                {strings.DONT_HAVE_ACCOUNT_SIGNIN}
              </Text>
            </View>
          </View>
          {/* <View>
            <Text style={{marginTop:550,}}> 
              hjgsgshcaghsafgchfg
            </Text>
          </View> */}
        </ScrollView>
      </SafeAreaView>
      
    </>
  );
};

export default LoginScreen;
