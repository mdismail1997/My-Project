import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import { Formik } from 'formik';
import { ZodIssueCode } from 'zod';
import { User } from '../../models/userAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import { supabase } from '../../supabase/supabaseClient';
import { removeEmojis } from '../../components/emojiRegex';

const eyeclose = require('../../Assets/eyeoff.png')
const eyeopen = require('../../Assets/eyeon.png')

export const SettingScreen = (props) => {
  const [loading, setLoding] = useState(false);
  const [newpassword, setNewPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const [image, SetImage] = useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [secureText, setSecureText] = React.useState(true);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  // const getdata = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');
  //   const userid = await AsyncStorage.getItem('userid');
  //   const user_id = JSON.parse(userid);
  //   let token = usertoken;
  //   console.log('user id =====>>>>', user_id);
  //   console.log('token123=', token);
  //   const data = {
  //     user_id: user_id,
  //     new_password: newpassword,
  //     con_password: conpassword,
  //   };
  //   console.log(data);
  //   setLoding(true);
  //   await Apis.changepassword(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       props.navigation.navigate('PatientHome');
  //       setLoding(false);
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setError((data) => ({
  //         ...data,
  //         iserror: true,
  //         message: error.response.data.errors.con_password,
  //       }));
  //       setLoding(false);
  //     });
  // };

  const managePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const managePasswordVisibilityConfirmPass = () => {
    setSecureText(!secureText);
  };

  const Changepassword = async () => {
    if (newpassword === '') {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'The New Password field is required.',
      }));
    }
    else if (conpassword === '') {
      setError((data) => ({
        ...data,
        iserror: true,

        message: 'The Confirm Password field is required.',
      }));
    }
    else if (newpassword !== conpassword) {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Password not matched',
      }));
    } else {
      try {
        const userid = await AsyncStorage.getItem('userid');
        const user_id = JSON.parse(userid);
        console.log('user id =====>>>>', user_id);
        const OtpData = {
          user_id: user_id,
          new_password: newpassword,
          con_password: conpassword,
        };
        console.log(OtpData);
        // if (newpassword === conpassword) {
        //   const {
        //     error: supabseError,
        //     user,
        //     session,
        //   } = await supabase.auth.update({
        //     password: newpassword,
        //   });

        // console.log('user========>', user, session);
        // if (supabseError && newpassword === '') {
        //   console.log('supabaseErr', supabseError);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: 'New Password Required',
        //   }));

        //   return;
        // } else if (supabseError) {
        //   console.log('supabaseErr', supabseError);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: supabseError.message,
        //   }));
        //   return;
        // }
        // console.log('OtpData', OtpData);
        const response = await Apis.changepassword(OtpData);
        console.log(response.data);
        if (response.data.success === 0) {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        }
        else {
          setErr((data) => ({
            ...data,
            iserr: true,
            message: 'Your Password Changed Successfully',
          }));
        }
        // }
        // else if (conpassword === '') {
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: 'Confirm Password Required',
        //   }));
        // } else {
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: 'Password Not Matched',
        //   }));
        // }
        // if (supabseError) {
        //   console.log('supabaseErr', supabseError);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: supabseError.message,
        //   }));
        //   return;
        // }
      } catch (err) {
        console.error(err.response.data);
        if (err.response.data.success === 0) {
          setError((data) => ({
            ...data,
            iserror: true,
            message:
              'Password should have at least one special character, one upper case character, one lower case character, one number & minimum 8 characters',
          }));
        } else {
          setError((data) => ({
            ...data,
            iserror: true,
            message: err.response.data.errors.con_password,
          }));
        }
      }
    }
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  const onDismissSnack = () => {
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Change Password" navProps={props.navigation} />
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <Snackbar
        visible={err.iserr}
        onDismiss={onDismissSnack}
        style={{ backgroundColor: 'green', zIndex: 100 }}
      >
        {err.message}
      </Snackbar>
      <ScrollView>
        {/* <View style={{ marginHorizontal: 30, marginTop: '30%' }}>
          <TextInput mode="outlined" label="Old Password" placeholder="" />
        </View> */}
        <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          <TextInput
            mode="outlined"
            label="New Password*"
            outlineColor={'#2173A8'}
            placeholder=""
            onChangeText={(text) => setNewPassword(text)}
            value={newpassword.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            placeholderTextColor="black"
            secureTextEntry={secureTextEntry}
            style={{ backgroundColor: '#fff', color: 'red', }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          // style={{ backgroundColor: '#fff' }}
          // right={
          //   <TextInput.Icon
          //     name={secureTextEntry ? 'eye' : 'eye-off'}
          //     color="#000"
          //     onPress={() => {
          //       setSecureTextEntry(!secureTextEntry);
          //       return false;
          //     }}
          //   />
          // }
          />
          <TouchableOpacity style={{ position: 'absolute', right: 10, marginTop: 23 }} onPress={() => managePasswordVisibility()}>

            <Image style={{ height: 24, width: 24 }} source={secureTextEntry ? eyeclose : eyeopen} />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          <TextInput
            mode="outlined"
            label="Confirm Password*"
            outlineColor={'#2173A8'}
            placeholder=""
            onChangeText={(text) => setConPassword(text)}
            value={conpassword.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            placeholderTextColor="black"
            secureTextEntry={secureText}
            style={{ backgroundColor: '#fff', color: 'red', }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          // right={
          //   <TextInput.Icon
          //     name={secureText ? 'eye' : 'eye-off'}
          //     color="#000"
          //     onPress={() => {
          //       setSecureText(!secureText);
          //       return false;
          //     }}
          //   />
          // }
          />
          <TouchableOpacity style={{ position: 'absolute', right: 10, marginTop: 23 }} onPress={() => managePasswordVisibilityConfirmPass()}>
            <Image style={{ height: 24, width: 24 }} source={secureText ? eyeclose : eyeopen} />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 30, marginTop: 30 }}>
          <Button
            style={{ fontSize: 32 }}
            mode="contained"
            color="#2173A8"
            uppercase={false}
            contentStyle={{ height: 54 }}
            onPress={() => Changepassword()}
          >
            Submit
          </Button>
        </View>
        <Image
          style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
            marginTop: 30,
          }}
          source={require('../../Assets/resetpassword.png')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
