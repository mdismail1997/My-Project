import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';

import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { User } from '../../models/userAuth';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { ZodIssueCode } from 'zod';
import { styles } from './styles';
import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS } from '../../utils/Const';
import { loginAPI } from '../../Services/ApiService';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginAction } from '../../Redux/actions/AuthAction';
import { setUserLogin, setUserToken } from '../../utils/DataStore';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';


import axios from 'axios';





export const LoginScreen = props => {

  const dispatch = useDispatch();

  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [Loading, setLoading] = useState(false);

  const Auth = useSelector(state => state.Auth);
  const isLoading = useSelector(state => state.Auth.isLoading);

  useEffect(() => {
    if (Auth.loginSuccess) {
      props.navigation.navigate('BiometricScreen');
      // setLogin();
      setUserTokenData(Auth.userToken);
    } else {
      setErrorMessage(Auth.errorMessage);
    }
    //console.log('auth user token ', Auth.userToken);
    return () => {
      setErrorMessage('');
    };
  }, [Auth]);


  useEffect(() => {
    _configureGoogleSignIn();
  }, []);



  const setUserTokenData = async token => {
    await setUserToken(token);
  };

  // TODO: validation
  const validateData = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const fullPasswordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (username === '' && password === '') {
      setErrorMessage('Please insert all required fields');
    } else if (username === '') {
      setErrorMessage('Please insert username');
    } else if (password === '') {
      setErrorMessage('Please enter password');
    }
    // else if (fullPasswordRegex.test(password) === false) {
    //   setErrorMessage(
    //     'Password must be between 8 to 32 characters and contain one uppercase, lowercase, special character and number',
    //   );
    // }
    else {
      // setErrorMessage('');
      onPressLogin();
    }
  };
  // TODO: call login API
  const onPressLogin = async () => {
    const fcmtoken = await AsyncStorage.getItem('fcmToken');
    const data = {
      email: username,
      password: password,
      device_token: fcmtoken,
    };
    dispatch(userLoginAction(data));
  };
  const setData = () => {
    props.navigation.navigate('Home');
  };
  const setPass = () => {
    props.navigation.navigate('VerifyScreen');
  };
  // const submitHandler = async (values) => {
  //   try {
  //     console.log(values);
  //     const res = await axios.post(
  //       'https://mydevfactory.com/~saikat8/doctorApp/public/api/login',
  //       values
  //     );
  //     console.log(res.data);
  //     props.navigation.navigate('Dashboard');
  //   } catch (error) {}
  // };





  _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
      ], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '1014674398298-mrsia160a6cjb5c435l3pk0fb8b3g0ti.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '1014674398298-mrsia160a6cjb5c435l3pk0fb8b3g0ti.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist) 299452138548-lmm88n9qrct2usc7d2ees3ouh28ktquj.apps.googleusercontent.com
    });
  };


  _signIn = async () => {
    setLoading(true)
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      await GoogleSignin.revokeAccess();
      console.log('userInfo --->', userInfo);
      // console.log('google signin token --->', token);

      submitSocialLogin(userInfo.user, 'google');
    } catch (error) {

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        console.log('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.refs.toast.show('play services not available or outdated');
      } else {
        console.log('Something went wrong:', error.toString());
        // setError(error);
      }
    }
  };


  const submitSocialLogin = async (data, type) => {
    const fcm_token = await AsyncStorage.getItem('fcm_token');
    console.log("000000000000000", data)
    socialLoginData =
      type === 'google'
        ? {
          social_id: data.id,   //googleId
          first_name: data.name.split(' ').slice(0, -1).join(' '),
          last_name: data.name.split(' ').slice(-1).join(' '),
          fname: data.name,
          email: data.email,
          profile_image: data.photo,
          device_type: Platform.OS,
          device_token: fcm_token,
        }
        : {
          social_id: data.id,   //googleId
          first_name: data.name.split(' ').slice(0, -1).join(' '),
          last_name: data.name.split(' ').slice(-1).join(' '),
          fname: data.name,
          email: data.email,
          profile_image: data.photo,
          device_type: Platform.OS,
          device_token: fcm_token,
        };
    console.log('Social login Data', socialLoginData);


    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/users/googlelogin`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: socialLoginData

    };

    axios(config)
      .then(async (response) => {

        if (response.data.success == true) {
          //console.log("............",response.data);
          props.navigation.navigate('Home')
          setLoading(false)
          setUserTokenData(response.data.token);
          // props.navigation.navigate('BiometricScreen')
          //Alert.alert("Login Successfull!")
        } else {
          Alert.alert("Login Failed!")
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };





   const fblogin = async () => {
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('==> Login cancelled');
        } else {
          console.log(
            '==> Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('Facebook data====>', data);
            console.log(
              'Facebook Access data====>',
              data.accessToken.toString(),
            );
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });

          // AccessToken.getCurrentAccessToken().then(data => {
          //   console.log('Facebook data====>', data);
          //   console.log(
          //     'Facebook Access data====>',
          //     data.accessToken.toString(),
          //   );
          //   let accessToken = data.accessToken;
          //   //alert(accessToken.toString());

          //   const responseInfoCallback = (error, result) => {
          //     if (error) {
          //       console.log(error);
          //       alert('Error fetching data: ' + error.toString());
          //     } else {
          //       console.log('Success fetching data: ', result);
          //       //alert('Success fetching data: ' + result.toString());
          //     }
          //   };

          //   const infoRequest = new GraphRequest(
          //     '/me',
          //     {
          //       accessToken: accessToken,
          //       parameters: {
          //         fields: {
          //           string: 'email,name,first_name,middle_name,last_name',
          //         },
          //       },
          //     },
          //     responseInfoCallback,
          //   );

          //   // Start the graph request.
          //   new GraphRequestManager().addRequest(infoRequest).start();
          // });
        }
      },
      function (error) {
        console.log('==> Login fail with error: ' + error);
      },
    );
   };










  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.subHeading}>
        It is a long established fact that a reader will be distracted by the
        readable.
      </Text>
      <ScrollView>
        <View style={{ marginHorizontal: wp(38), marginTop: hp(38) }}>
          <TextInput
            mode="outlined"
            label="User Name"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setUsername(text);
            }}
            value={username}
            style={{ backgroundColor: '#fff', borderRadius: 10 }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.password === true && errors.password !== undefined}
            mode="outlined"
            label="Password"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setPassword(text);
            }}
            value={password}
            secureTextEntry
            style={{ backgroundColor: '#fff', borderRadius: 10 }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
          <HelperText type="error">{errorMessage}</HelperText>
        </View>
        <View style={{ marginHorizontal: wp(18), marginTop: hp(20) }}>
          <CustomButton title="Log In" onPress={() => validateData()} />
        </View>

        <Text
          style={styles.forgotText}
          onPress={() => props.navigation.navigate('EmailVerifyScreen')}>
          {'Forgot password?'}
        </Text>

        <View style={styles.lineContainer}>
          <View style={styles.verticleLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.verticleLine} />
        </View>
        <View style={styles.socialButtonContainer}>




          <TouchableOpacity
            onPress={() => fblogin()}
            style={[styles.socialButton, { borderColor: COLORS.LAPSI_LAZULI }]}>
            <Image
              source={require('../../Assets/facebook.png')}
              style={styles.socialIcon}
            />
            <Text
              style={[styles.socialButtonText, { color: COLORS.LAPSI_LAZULI }]}>
              {'Facebook'}
            </Text>
          </TouchableOpacity>







          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => _signIn()}
            style={[styles.socialButton, { borderColor: COLORS.COQUELICOT }]}>
            <Image
              source={require('../../Assets/google.png')}
              style={styles.socialIcon}
            />
            <Text style={[styles.socialButtonText, { color: COLORS.COQUELICOT }]}>
              {'Google'}
            </Text>
          </TouchableOpacity>









        </View>
        <View style={styles.singupContainer}>
          <Text style={styles.singupText}>
            {'Don’t have an account?'}
            <Text
              onPress={() => props.navigation.navigate('SignupScreen')}
              style={[styles.singupText, { color: COLORS.YELLOW_GREEN }]}>
              {' Signup'}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {Loading && <Loader />}
    </SafeAreaView>
  );
};
