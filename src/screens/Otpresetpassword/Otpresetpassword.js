import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { User } from '../../models/userAuth';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import OtpInputs from 'react-native-otp-inputs';
import axios from 'axios';
import * as Apis from '../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header4 } from '../../components/Header/Header';

export const OtpResetPass = (props) => {
  const otpRef = useRef();
  const [otp, setOTP] = useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [loginSuccess, setLoginSuccess] = React.useState({
    visible: false,
    message: '',
  });
  const getOtp = async (values) => {
    try {
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      console.log('user id =====>>>>', user_id);
      const OtpData = {
        otp: otp,
      };
      console.log('OtpData', OtpData);
      const response = await Apis.getotpreset(OtpData);
      console.log(response.data);
      setLoginSuccess((data) => ({
        ...data,
        visible: true,
        message: response.data.message,
      }));
      setError({ iserror: false, message: '' })
      setTimeout(() => {
        props.navigation.replace('ResetPass');

      }, 2500)
      await AsyncStorage.setItem(
        'userid',
        JSON.stringify(response.data.user_id)
      );
    } catch (err) {
      console.error(err.response.data);
      if (err.response.data.error === 'Incorrect OTP') {
        //console.warn(err.response.data.error)
        setError((data) => ({
          ...data,
          iserror: true,
          message: err.response.data.error,
        }));
        setLoginSuccess({
          visible: false,
          message: '',
        })
      } else
        setError((data) => ({
          ...data,
          iserror: true,
          message: err.response.data.errors.otp,
        }));
      setLoginSuccess({
        visible: false,
        message: '',
      })
    }
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setLoginSuccess({ visible: false, message: '' });
  };

  const handleChange = (code) => {
    console.log('currentCodeReturned', code);
    setOTP(code);
  };

  console.log('entered otp', otp);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <Header4 title="Otp Verification" navProps={props.navigation} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignSelf: 'center' }}>
          <Image
            source={require('../../Assets/verification.png')}
            style={{ resizemode: 'contain', height: 90, width: 90 }}
          />
        </View>
        <View style={{ margin: 20, width: '80%', marginLeft: 35 }}>
          <OtpInputs
            clearTextOnFocus
            handleChange={handleChange}
            autofillFromClipboard={false}
            keyboardType="number-pad"
            numberOfInputs={4}
            ref={otpRef}
            selectTextOnFocus={false}
            inputStyles={{
              borderWidth: 2,
              borderRadius: 5,
              width: 60,
              fontSize: 25,
              textAlign: 'center',
              height: 90,
              borderColor: '#2173A8',
              color: '#2173A8',
            }}
          />
        </View>
        <View
          style={{
            marginHorizontal: 30,
            marginTop: 10,
            borderRadius: 10,
            marginBottom: 90
          }}
        >
          <Button
            style={{ fontSize: 32 }}
            mode="contained"
            color="#2173A8"
            uppercase={false}
            contentStyle={{ height: 54 }}
            onPress={getOtp}
          >
            Submit
          </Button>
        </View>
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: '#d15656', zIndex: 1 }}
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
    </SafeAreaView>
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
    marginTop: 20,
    marginLeft: 30,
  },
  view: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 60,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
