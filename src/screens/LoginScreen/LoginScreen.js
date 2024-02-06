import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  Keyboard,
  BackHandler,
} from 'react-native';
import { User } from '../../models/userAuth';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Snackbar,
  Checkbox,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZodIssueCode } from 'zod';
import * as Apis from '../Services/apis';
import { getDataFromStorage, setUserToken } from '../../storage';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabase/supabaseClient';
import { DOCTOR_APP_FCM_TOKEN } from '../../constants/appConstant';
import { RFValue } from 'react-native-responsive-fontsize';
import { Header } from '../../components/Header/Header';
import { removeEmojis } from '../../components/emojiRegex';


const eyeclose = require('../../Assets/eyeoff.png')
const eyeopen = require('../../Assets/eyeon.png')

const validateHandler = (values) => {

  console.log('formikvalue=====', values);
  let formikErrors = {};
  try {
    User.parse(values);
  } catch (e) {
    const { errors } = e;
    errors.forEach((subError) => {
      const path = subError.path.join('.');
      let { message } = subError;
      if (path === 'email' && subError.code === ZodIssueCode.invalid_string) {
        message = 'Invalid email address';
      }
      if (
        path === 'password' &&
        subError.code === ZodIssueCode.invalid_string
      ) {
        message =
          'Password should have at least one special character, one upper case character, one lower case character, one number & minimum 8 characters';
      }
      formikErrors = { ...formikErrors, [path]: message };
    });
  }
  console.log('error======', formikErrors);
  return formikErrors;
};

export const LoginScreen = (props) => {
  const HEIGHT = Dimensions.get('window').height;
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [loginSuccess, setLoginSuccess] = React.useState({
    visible: false,
    message: '',
  });
  const [email, setEmail] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const formikvalue = "ddddd"
  const setData = () => {
    props.navigation.navigate('SignUp');
  };
  const setPass = () => {
    props.navigation.navigate('VerifyScreen');
  };
  const userTempRole = useSelector(
    (state) => state.userDetails.temporaryUserType
  );
  useEffect(() => {
    // retrieveData();
    console.log('==>>>', props.route?.params);
  }, [props.route?.params]);

  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate('SelectScreen');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [props.navigation]);

  const retrieveData = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const password = await AsyncStorage.getItem('password');
      const mail = await AsyncStorage.getItem('mail');

      setEmail(mail);
      setPassWord(password);
    } catch (error) {
      console.log(error);
    }
  };
  //console.log(password, mail.toString());
  const submitHandler = async (values) => {
    console.log('lllllll===');
    try {
      const fcmToken = await getDataFromStorage(DOCTOR_APP_FCM_TOKEN);
      const LoginData = {
        email: values.email,
        password: values.password,
        role_id: userTempRole === 'Doctor' ? 1 : 2,
        fcm_token: fcmToken,
      };

      // console.log(LoginData);
      // const {
      //   error: supabseError,
      //   user,
      //   session,
      // } = await supabase.auth.signIn({
      //   email: LoginData.email,
      //   password: LoginData.password,
      // });
      // if (supabseError) {
      //   console.log('supabaseErr', supabseError);
      //   setError((data) => ({
      //     ...data,
      //     iserror: true,
      //     message: supabseError.message,
      //   }));
      //   return;
      // }
      console.log('LoginData', LoginData);
      const response = await Apis.getlogin(LoginData);
      if (checked === true) {
        console.log('setvalue', checked);
        await AsyncStorage.setItem('password', LoginData.password);
        await AsyncStorage.setItem('mail', LoginData.email);
      }
      else {
        console.log('setvalue', checked);
        await AsyncStorage.setItem('password', '');
        await AsyncStorage.setItem('mail', '');
      }
      //console.warn('hhhhhhhhhhhhhhhh');
      console.log(response.data);
      setLoginSuccess({
        visible: true,
        message: 'Successfully logged in',
      });
      setError({ iserror: false, message: '' })
      // if (session) {
      //   await AsyncStorage.setItem('supabaseAuthToken', session.access_token);
      // }
      // const password = await AsyncStorage.getItem('password');
      // const mail = await AsyncStorage.getItem('mail');
      //  console.log(password, mail);
      await AsyncStorage.setItem('authtoken', response.data.auth_token);
      await AsyncStorage.setItem(
        'userid',
        JSON.stringify(response.data.user_id)
      );
      await AsyncStorage.setItem('email', response.data.email);
      await AsyncStorage.setItem('role', response.data.role);

      // await setUserToken(response.data.role, response.data.auth_token);
      // await AsyncStorage.setItem('fcm_token', response.data.auth_token),
      // props.navigation.replace(
      //   response.data.role === 'Doctor' ? 'Dashboard' : 'PatientTabNavigator'
      // );
      setTimeout(() => {
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name:
                response.data.role === 'Doctor'
                  ? 'Dashboard'
                  : 'PatientTabNavigator',
            },
          ],
        });
      }, 2500);
    } catch (err) {
      console.error('error=========', err);
      setError((data) => ({
        ...data,
        iserror: true,
        message: err.response.data.error,
      }));
      setLoginSuccess({
        visible: false,
        message: '',
      })
    }
  };
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     submitHandler();
  //   });
  //   return unsubscribe;
  // }, []);

  const managePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };


  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' })),
      setLoginSuccess({ visible: false, message: '' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <Header title="Log In" navProps={props.navigation} /> */}

      <View style={[styles.view, { marginTop: 30, paddingVertical: 15 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => props.navigation.replace('SelectScreen')}>
            <Image
              source={require('../../Assets/back.png')}
              resizeMode="contain"
              style={{ width: 20, height: 20, tintColor: '#2173A8' }}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 20,
              //  fontFamily: 'Roboto-Bold',
              color: '#333333',
              width: "85%"
            }}
          >
            Log In
          </Text>
        </View>
      </View>
      <ScrollView
        //  keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps={'always'}
      >
        <Text style={styles.head}>Welcome</Text>

        <View
          style={{
            flex: 1,
            marginTop: HEIGHT * 0.7,
            position: 'absolute',
            width: '100%',
          }}
        >
          <View
            style={{
              //   bottom: 10,
              flexDirection: 'row',
              //   margin: 15,
              marginLeft: 20,
              marginBottom: 0,
              // justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={{ margin: 10, color: '#000', textAlign: 'center' }}>
              Don’t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                setData();
              }}
            >
              <Text
                style={{
                  margin: 10,
                  marginLeft: 0,
                  color: '#2173A8',
                }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            flex: 1,
            marginTop: HEIGHT * 0.55,
            position: 'absolute',
            width: '100%',
          }}
        >
          <View
            style={{
              //   bottom: 10,
              flexDirection: 'row',
              //   margin: 15,
              marginLeft: 20,
              marginBottom: 0,
              // justifyContent: 'center',
              // alignSelf: 'center',
            }}
          >
            <Text style={{ margin: 10, color: '#000', textAlign: 'center' }}>
              Remember me
            </Text>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                console.log(checked);
                setChecked(!checked);
              }}
              // color="red"
              uncheckedColor="black"
            />
            {/* <TouchableOpacity
              onPress={() => {
                setData();
              }}
            >
              <Text
                style={{
                  margin: 10,
                  marginLeft: 0,
                  color: '#2173A8',
                }}
              >
                Signup
              </Text>
            </TouchableOpacity> */}
        {/* </View> */}
        {/* </View> */}
        {/* <Text style={styles.text}>
          It is a long established fact that a reader will be distracted by the
          readable.
        </Text> */}

        <Formik
          initialValues={{ email: props.route.params?.email === null || props.route.params?.email === '' || props.route.params?.email === undefined ? '' : props.route.params?.email, password: props.route.params?.password === null || props.route.params?.password === '' || props.route.params?.password === undefined ? '' : props.route.params?.password }}
          //  initialValues={{ email: '', password: '' }}
          onSubmit={submitHandler}
          validate={validateHandler}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isSubmitting,
          }) => (
            <>
              <View style={{ marginHorizontal: 30, marginTop: 30 }}>
                <TextInput
                  error={touched.email === true && errors.email !== undefined}
                  mode="outlined"
                  label="Email"
                  placeholder=""
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
                  outlineColor={'#2173A8'}
                  placeholderTextColor="black"
                  style={{ backgroundColor: '#fff' }}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  //textColor="red"

                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                />
                <HelperText
                  type="error"
                  visible={touched.email === true && errors.email !== undefined}
                >
                  {errors.email}
                </HelperText>
              </View>
              <View style={{ marginHorizontal: 30, marginTop: 5 }}>
                <TextInput
                  error={
                    touched.password === true && errors.password !== undefined
                  }
                  mode="outlined"
                  label="Password"
                  outlineColor={'#2173A8'}
                  placeholder=""
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
                  placeholderTextColor="black"
                  secureTextEntry={secureTextEntry}
                  style={{ backgroundColor: '#fff', color: 'red', }}
                  //   keyboardType={'ascii-capable'}
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                // textColor
                // right={
                //   <TextInput.Icon
                //     name={secureTextEntry ? 'eye' : 'eye-off'}
                //     onPress={() => {
                //       setSecureTextEntry(!secureTextEntry);

                //       return false;
                //     }}
                //     //   showSoftInputOnFocus={false}
                //     color="#000"
                //   />
                // }
                />
                <TouchableOpacity style={{ position: 'absolute', right: 10, marginTop: 23 }} onPress={() => managePasswordVisibility()}>

                  <Image style={{ height: 24, width: 24 }} source={secureTextEntry ? eyeclose : eyeopen} />
                </TouchableOpacity>

                <HelperText
                  type="error"
                  visible={
                    touched.password === true && errors.password !== undefined
                  }
                >
                  {errors.password}
                </HelperText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  //  width: '85%',
                  //alignSelf: 'center'
                  marginHorizontal: 30,
                  // backgroundColor: 'red'
                }}
              >
                <View
                  style={{
                    //   bottom: 10,
                    flexDirection: 'row',
                    //alignSelf:'center',
                    //   marginLeft: 40,
                    marginBottom: 0,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    // alignSelf: 'center',
                  }}
                >
                  {/* <View style={{height:34,width:33,borderColor:'#000',borderWidth:1.5,alignSelf:'center' }}> */}
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      console.log(checked);
                      setChecked(!checked);
                    }}
                    // color="red"
                    uncheckedColor="black"
                  />
                  {/* </View> */}
                  <Text
                    style={{

                      color: '#000',
                      textAlign: 'center',
                      // marginTop: 40,
                      fontSize: RFValue(15)
                    }}
                  >
                    Remember me
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ alignSelf: 'flex-end' }}
                  onPress={() => {
                    setPass();
                  }}
                >
                  <Text
                    style={{
                      color: '#2173A8',
                      fontSize: RFValue(15),
                      marginTop: -28,
                      //   textAlign: 'right',
                      // marginRight: 30,
                    }}
                  >
                    Forgot Password ?
                  </Text>
                </TouchableOpacity>


              </View>
              <View style={{ marginHorizontal: 30, marginTop: 30 }}>
                <Button
                  style={{ fontSize: 52 }}
                  mode="contained"
                  theme={{ colors: { disabled: 'red' } }}
                  color="#2173A8"
                  //  color={isSubmitting ? 'red' : 'blue'}
                  uppercase={false}
                  contentStyle={{ height: 54 }}
                  onPress={() => { handleSubmit(), Keyboard.dismiss() }}
                  disabled={isSubmitting}
                  loading={isSubmitting}

                >
                  Log In
                </Button>
              </View>
            </>
          )}
        </Formik>

        {/* <View style={{ flex: 1, bottom: 0 }}>
          <View
            style={{
              bottom: 10,
              flexDirection: 'row',
              //   margin: 15,
              marginLeft: 20,
              marginBottom: 0,
              // justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={{ margin: 10, color: '#000' }}>
              Don’t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                setData();
              }}
            >
              <Text
                style={{
                  margin: 10,
                  marginLeft: 0,
                  color: '#2173A8',
                }}
              >
                Signup
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
        {/* <View style={{ marginTop: 30 }}>
          <TouchableOpacity style={styles.fab}>
            <Image
              source={require('../../Assets/quickvisit.png')}
              style={{
                tintColor: '#ffffff',
                alignSelf: 'center',
                marginTop: 20,
                justifyContent: 'space-between',
              }}
            />
          </TouchableOpacity>
        </View> */}
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: '#d15656', zIndex: 500, marginbottom: 20 }}
        >
          {error.message}
        </Snackbar>
        <Snackbar
          visible={loginSuccess.visible}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: '#30D13B', zIndex: 500, marginbottom: 20 }}

        >
          {loginSuccess.message}
        </Snackbar>
      </ScrollView>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  head: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 30,
  },
  text: {
    color: '#737373',
    fontSize: 15,
    marginTop: 15,
    marginLeft: 30,
  },
  // view: {
  //   flexDirection: 'row',
  //   margin: 15,
  //   marginTop: 60,
  //   justifyContent: 'center',
  //   alignSelf: 'center',
  // },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    //  marginTop: props.margin? props.margin :  30,
    marginLeft: 20,
    //  paddingVertical: props.padding? props.padding : 15,
    paddingHorizontal: 10,
  },
});
