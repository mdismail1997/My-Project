import { Formik } from 'formik';
import React, { useRef, useState, useEffect } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import { Alert, BackHandler } from 'react-native';
import { Header4 } from '../../components/Header/Header';

export const OtpVerify = (props) => {
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
        user_id: user_id,
        otp: otp,
      };
      console.log('OtpData', OtpData);
      const response = await Apis.getotp(OtpData);
      if (response.data.success === 1) {
        console.log(response.data);
        setLoginSuccess((data) => ({
          ...data,
          visible: true,
          message: response.data.message,
        }));
        setError({ iserror: false, message: '' })
        setTimeout(() => {
          props.navigation.replace('LogIn');

        }, 1500)
      } else {
        setError((data) => ({
          ...data,
          iserror: true,
          message: response.data.message,
        }));
        setLoginSuccess({
          visible: false,
          message: '',
        })
      }
    } catch (err) {
      console.error(err.response.data.errors);
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
  const resendOtp = async () => {
    try {
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      console.log('user id =====>>>>', user_id);
      const OtpData = {
        user_id: user_id,
      };
      console.log('OtpData', OtpData);
      const response = await Apis.resendotp(OtpData);
      console.log(response.data);
      await AsyncStorage.setItem(
        'userid',
        JSON.stringify(response.data.user_id)
      );
      if (response.data.success === 1) {
      } else {
        setError((data) => ({
          ...data,
          iserror: true,
          message: response.data.message,
        }));
        setLoginSuccess({
          visible: false,
          message: '',
        })
      }
    } catch (err) {
      console.error(err.response.data.errors);
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
  const handleChange = (code) => {
    console.log('currentCodeReturned', code);
    setOTP(code);
  };

  console.log('entered otp', otp);
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setLoginSuccess({ visible: false, message: '' });
  };
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on',
        'OTP Verification is required to complete your registration ?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);
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
        <View
          style={{
            margin: 20,
            width: '80%',
            marginLeft: 35,
          }}
        >
          <OtpInputs
            clearTextOnFocus
            handleChange={handleChange}
            keyboardType="phone-pad"
            numberOfInputs={4}
            ref={otpRef}
            // inputStyles={{}}
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
        <View
          style={{
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
            marginRight: 30,
          }}
        >
          <View style={{ flexDirection: 'row', marginLeft: 30 }}>
            <Text style={{ color: '#000' }}>Didn't receive OTP?</Text>
            <TouchableOpacity onPress={resendOtp}>
              <Text style={{ color: '#2173A8', marginLeft: 10 }}>
                Resend new code.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={{ backgroundColor: '#d15656' }}
        >
          {error.message}
        </Snackbar>

        <Snackbar
          visible={loginSuccess.visible}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: '#30D13B' }}
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
