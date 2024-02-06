import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
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
import * as Apis from '../../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Header } from '../../../components/Header/Header';

const rnBiometrics = new ReactNativeBiometrics();
export const QuickOtp = (props) => {
  const otpRef = useRef();
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  //const [userid, setUserid] = useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  useEffect(() => {}, [
    props.route.params?.userid,
    props.route.params?.message,
  ]);
  const getOtp = async (values) => {
    try {
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      console.log('user id =====>>>>', user_id);
      const OtpData = {
        otp: otp,
      };
      console.log('OtpData', OtpData);
      const response = await Apis.quickotp(OtpData);
      console.log(response.data);

      if (response.data.success === 0) {
        setError((data) => ({
          ...data,
          iserror: true,
          message: response.data.message,
        }));
      } else {
        console.log('userid', `${props.route.params?.userid}`);
        await AsyncStorage.setItem('userid', `${props.route.params?.userid}`);
        await AsyncStorage.setItem('role', 'Patient');
        setMessage(response.data.email);
        //  getquickdata()
        props.navigation.replace('SelectGender', {
          message: response.data.email,
          userid: props.route.params?.userid,
        });
      }
    } catch (err) {
      console.error(err.response.data);
      setError((data) => ({
        ...data,
        iserror: true,
        message: err.response.data.errors.otp,
      }));
    }
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };

  const handleChange = (code) => {
    console.log('currentCodeReturned', code);
    setOTP(code);
  };

  // useEffect(()=>{getquickdata()},[])
  console.log('entered otp', otp);
  useEffect(() => {
    rnBiometrics
      .simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then((resultObject) => {
        const { success } = resultObject;

        if (success) {
          console.log('successful biometrics provided');

          AsyncStorage.setItem('userid', `${props.route.params?.userid}`);
          AsyncStorage.setItem('role', 'Patient');
          props.navigation.navigate('SelectGender', {
            message: props.route.params?.message,
            userid: props.route.params?.userid,
          });
        } else {
          console.log('user cancelled biometric prompt');
        }
      })
      .catch(() => {
        Alert.alert('Biometrics failed Please enter OTP');
        console.log('biometrics failed');
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="OTP Verification" navProps={props.navigation} />
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656' }}
      >
        {error.message}
      </Snackbar>
      <ScrollView>
        <View style={{ marginTop: 40, alignSelf: 'center' }}>
          <Image
            source={require('../../../Assets/verification.png')}
            style={{ resizemode: 'contain', height: 80, width: 80 }}
          />
        </View>
        <View style={{ margin: 20, width: '80%', marginLeft: 35 }}>
          <OtpInputs
            clearTextOnFocus
            handleChange={handleChange}
            keyboardType="phone-pad"
            numberOfInputs={4}
            ref={otpRef}
            selectTextOnFocus={false}
            inputStyles={{
              borderWidth: 1,
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
            marginTop: 30,
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
