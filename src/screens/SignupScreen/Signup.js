import { Formik } from 'formik';
import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import * as Apis from '../Services/apis';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  HelperText,
  Snackbar,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import { ZodIssueCode } from 'zod';
import { Header, HeaderSignup } from '../../components/Header/Header';
import { User } from '../../models/userAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabase/supabaseClient';
import { TermsAndCondition } from '../TermsAndCon/TermsAnsCon';
import { RFValue } from 'react-native-responsive-fontsize';
import { removeEmojis } from '../../components/emojiRegex';

const eyeclose = require('../../Assets/eyeoff.png')
const eyeopen = require('../../Assets/eyeon.png')

const validateHandler = (values) => {
  let formikErrors = {};
  if (values.cPassword === '') {
    formikErrors = {
      ...formikErrors,
      cPassword: 'Confirm Password is required',
    };
  }
  // if (values.password === '') {
  //   formikErrors = {
  //     ...formikErrors,
  //     password: 'Password ',
  //   };
  // }
  else if (values.cPassword !== values.password) {
    formikErrors = {
      ...formikErrors,
      cPassword: 'Password not match',
    };
  }
  if (values.userfName === undefined || values.userfName === '') {
    formikErrors = {
      ...formikErrors,
      userfName: 'First Name is required',
    };
  }
  if (values.userlName === undefined || values.userlName === '') {
    formikErrors = {
      ...formikErrors,
      userlName: 'Last Name is required',
    };
  }
  try {
    User.parse(values);

  } catch (e) {
    const { errors } = e;
    errors.forEach((subError) => {
      const path = subError.path.join('.');
      let { message } = subError;

      if (path === 'email' && subError.code === ZodIssueCode.invalid_string) {
        message = 'Invalid Email address';
      }
      if (
        path === 'password' &&
        subError.code === ZodIssueCode.invalid_string
      ) {
        message =
          'Password should have at least one special character, one lower case character, one upper case character, one number & minimum 8 characters';
      }
      formikErrors = { ...formikErrors, [path]: message };
    });
  }
  return formikErrors;
};

export const SignupScreen = (props) => {
  const userTempRole = useSelector(
    (state) => state.userDetails.temporaryUserType
  );
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [secureText, setSecureText] = React.useState(true);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false), props.navigation.navigate('OtpVerify');
  };
  const [checked, setChecked] = React.useState(false);
  const setData = () => {
    props.navigation.replace('LogIn');
    setVisible(false);
  };

  console.log('userTempRole', userTempRole);

  const managePasswordVisibilityPass = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const managePasswordVisibilityConfirmPass = () => {
    setSecureText(!secureText);
  };

  const getSignup = async (values) => {
    if (values.userfName.trim() === '' || values.userlName.trim() === '') {
      alert('It is not permitted to enter an empty name');
    } else {
      try {
        const SignupData = {
          name: values.userfName,
          last_name: values.userlName,
          email: values.email,
          password: values.password,
          con_password: values.cPassword,
          role_id: userTempRole === 'Doctor' ? 1 : 2,
        };
        console.log('SignupData', SignupData);
        // const { error: supabseError, user } = await supabase.auth.signUp({
        //   email: SignupData.email,
        //   password: SignupData.password,
        // });
        // if (supabseError) {
        //   console.log('oooo', supabseError);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: supabseError.message,
        //   }));
        //   return;
        // }
        const response = await Apis.getsignup(SignupData);
        console.log(response.data);
        if (response.data.success === 0) {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        }
        console.log('uid==', response.data.user_id);
        await AsyncStorage.setItem(
          'userid',
          JSON.stringify(response.data.user_id)
        );
        setVisible(true);

        //  hideModal();
      } catch (err) {
        console.error(err.response);
        // if (
        //   err.response.data.errors.email[0] ===
        //   "Email has already been taken") {
        //   // eslint-disable-next-line no-lone-blocks
        //   {
        //     setError((data) => ({
        //       ...data,
        //       iserror: true,
        //       message: err.response.data.errors.email[0],
        //     }));
        //   }
        // }
        // else if (err.response.data.errors?.name[0] ===
        //   "Name field special chracters not allowed"

        // ) {
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: err.response.data.errors.name[0],
        //   }));
        // }

      }
    }
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderSignup title="Sign Up" navProps={props.navigation} />
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <ScrollView >
        <Text style={styles.headtext}>Welcome</Text>
        {/* <Text
          style={{
            color: '#737373',
            fontSize: 15,
            marginTop: 20,
            marginLeft: 30,
          }}
        >
          It is a long established fact that a reader will be distracted by the
          readable.
        </Text> */}

        <Formik
          initialValues={{
            userfName: '',
            userlName: '',
            email: '',
            password: '',
            cPassword: '',
          }}
          onSubmit={getSignup}
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
              <View style={{ marginHorizontal: 30, marginTop: 20 }}>
                <TextInput
                  error={
                    touched.userfName === true && errors.userfName !== undefined
                  }
                  mode="outlined"
                  label="First Name*"
                  placeholder=""
                  onChangeText={handleChange('userfName')}
                  onBlur={handleBlur('userfName')}
                  value={removeEmojis(values.userfName.charAt(0).toUpperCase()) + values.userfName.slice(1)}
                  maxLength={15}
                  outlineColor={'#2173A8'}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                  style={{ backgroundColor: '#fff' }}
                />
              </View>
              <HelperText
                style={{ marginLeft: 20 }}
                type="error"
                visible={
                  touched.userfName === true && errors.userfName !== undefined
                }
              >{errors.userfName}
              </HelperText>

              <View style={{ marginHorizontal: 30, }}>
                <TextInput
                  error={
                    touched.userlName === true && errors.userlName !== undefined
                  }
                  mode="outlined"
                  label="Last Name*"
                  placeholder=""
                  onChangeText={handleChange('userlName')}
                  onBlur={handleBlur('userlName')}
                  value={removeEmojis(values.userlName.charAt(0).toUpperCase() + values.userlName.slice(1))}
                  maxLength={15}
                  outlineColor={'#2173A8'}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                  style={{ backgroundColor: '#fff' }}
                />
              </View>
              <HelperText
                style={{ marginLeft: 20 }}
                type="error"
                visible={
                  touched.userlName === true && errors.userlName !== undefined
                }
              >
                {errors.userlName}
              </HelperText>

              <View style={{ marginHorizontal: 30 }}>
                <TextInput
                  error={touched.email === true && errors.email !== undefined}
                  mode="outlined"
                  label="Email*"
                  placeholder=""
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
                  outlineColor={'#2173A8'}
                  maxLength={40}
                  style={{ backgroundColor: '#fff' }}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                />
              </View>
              <HelperText
                style={{ marginLeft: 20 }}
                type="error"
                visible={touched.email === true && errors.email !== undefined}
              >
                {errors.email}
              </HelperText>
              <View style={{ marginHorizontal: 30 }}>
                <TextInput
                  error={
                    touched.password === true && errors.password !== undefined
                  }
                  mode="outlined"
                  label="Password*"
                  outlineColor={'#2173A8'}
                  placeholder=""
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
                  placeholderTextColor="black"
                  secureTextEntry={secureTextEntry}
                  style={{ backgroundColor: '#fff', color: 'red', }}
                  // keyboardType={
                  //   Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  // }
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}

                />
                <TouchableOpacity style={{ position: 'absolute', right: 10, marginTop: 23 }} onPress={() => managePasswordVisibilityPass()}>

                  <Image style={{ height: 24, width: 24 }} source={secureTextEntry ? eyeclose : eyeopen} />
                </TouchableOpacity>
              </View>
              <HelperText
                style={{ marginLeft: 20 }}
                type="error"
                visible={
                  touched.password === true && errors.password !== undefined
                }
              >
                {errors.password}
              </HelperText>
              <View style={{ marginHorizontal: 30 }}>
                <TextInput
                  error={
                    touched.cPassword === true && errors.cPassword !== undefined
                  }
                  maxLength={30}
                  mode="outlined"
                  label="Confirm Password*"
                  placeholder=""
                  onChangeText={handleChange('cPassword')}
                  onBlur={handleBlur('cPassword')}
                  value={values.cPassword.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
                  outlineColor={'#2173A8'}
                  secureTextEntry={secureText}
                  // keyboardType={
                  //   Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                  // }
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                  style={{
                    backgroundColor: '#fff',
                    fontSize: 16,
                    letterSpacing: 6,
                    fontFamily: 'Roboto-Bold',
                  }}
                // right={
                //   <TextInput.Icon

                //     name={secureText ? 'eye' : 'eye-off'}
                //     onPress={() => {
                //       Keyboard.dismiss();
                //       setSecureText(!secureText);
                //       return false;
                //     }}
                //     color="#000"
                //   />
                // }
                />
                <TouchableOpacity style={{ position: 'absolute', right: 10, marginTop: 23 }} onPress={() => managePasswordVisibilityConfirmPass()}>
                  <Image style={{ height: 24, width: 24 }} source={secureText ? eyeclose : eyeopen} />
                </TouchableOpacity>

              </View>
              <HelperText
                style={{ marginLeft: 20 }}
                type="error"
                visible={
                  touched.cPassword === true && errors.cPassword !== undefined
                }
              >
                {errors.cPassword}
              </HelperText>

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: '7%',
                  alignItems: 'center',
                  //   justifyContent: 'space-between',
                  // backgroundColor: 'red'
                }}
              >
                {/* <View style={{height:34,width:33,borderColor:'#000',borderWidth:1.5, }}> */}
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                  // color="red"
                  uncheckedColor="black"
                />
                {/* </View> */}
                {/* <View style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  // backgroundColor: 'blue'
                }}>
                  <Text
                    style={{
                      marginLeft: 20,
                      color: '#000',
                      fontWeight: '600',
                      // marginTop: -20
                    }}
                  >I agree to
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('TermsAndCondition')}
                      style={{}}
                    >
                      <Text
                        style={{
                          //  marginLeft: 20,
                          color: '#2173A8',
                          fontWeight: '600',
                        }}
                      >Terms And Conditions.</Text>
                    </TouchableOpacity>
                    * </Text>
                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 15,
                    //  marginBottom: 10,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    //marginTop: 40,
                  }}
                >
                  <Text style={{ margin: 10, color: '#000', fontSize: RFValue(15) }}>
                    I agree to</Text>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('TermsAndCondition')}
                  ><Text
                    style={{
                      marginVertical: 10,
                      marginLeft: -5,
                      color: '#2173A8',
                      fontSize: RFValue(15),
                    }}
                  >Terms And Conditions.
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
              <View
                style={{
                  marginHorizontal: 30,
                  marginTop: 10,
                  borderRadius: 10,
                }}
              >
                <Button
                  style={{ fontSize: 32 }}
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  contentStyle={{ height: 54 }}
                  onPress={() =>
                    checked
                      ? handleSubmit()
                      : alert('Please Agree Terms And Conditions.')
                  }
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Sign Up
                </Button>
              </View>
            </>
          )}
        </Formik>

        {/* <TouchableOpacity
          onPress={() => {
            setPass();
          }}
        >
          <Text style={styles.fpass}>Forgot password?</Text>
        </TouchableOpacity> */}
        <View
          style={{
            flexDirection: 'row',
            margin: 15,
            marginBottom: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 40,
          }}
        >
          <Text style={{ margin: 10, color: '#000' }}>
            Already have an account?
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
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', height: '100%' }}>
          <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)}>
              <View style={styles.modalview}>
                <View>
                  <IconButton
                    icon="close"
                    size={26}
                    color="red"
                    style={{ alignSelf: 'flex-end', marginTop: '-30%' }}
                    onPress={hideModal}
                  />
                </View>
                <Image
                  style={{
                    width: 150,
                    height: 100,
                    alignSelf: 'center',
                    // marginTop: '-30%',
                  }}
                  source={require('../../Assets/modal.png')}
                />
                <Text style={styles.modaltext}>Please Check Your Email</Text>
              </View>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalview: {
    backgroundColor: '#fff',
    height: 320,
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
  },
  modaltext: {
    marginTop: 25,
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 15,
  },
  fpass: {
    color: '#2173A8',
    fontSize: 15,
    marginTop: 30,
    textAlign: 'right',
    marginRight: 30,
  },
  headtext: {
    fontSize: 30,
    fontWeight: 'bold',
    // marginTop: 10,
    marginLeft: 30,
    color: '#000',
  },
});
