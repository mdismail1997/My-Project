import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
//import OTPInputView from '@twotalltotems/react-native-otp-input';
import CodeInput from 'react-native-code-input';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import axios from 'axios';
import {base_url} from '../../Services/constants';

import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const ForgotPasswordOtp = props => {
  const [email, setEmail] = useState(props.route.params.email);

  const [otpNumber, setOtpNumber] = useState('');
  //const [shownModal, setShowModal] = useState(false);
  const [emailOtpNumber, setEmailOtpNumber] = useState(props.route.params.otp);
  const [token, setToken] = useState(props.route.params.token);

  const handleOtp = () => {
    if (otpNumber == emailOtpNumber) {
      props.navigation.replace('ResetPassword', {
        email: email,
        token: token,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Plese enter valid Otp from your Email address',
      });
    }
  };

  const resend = async () => {
    console.log('resend Code');
    const emailData = {
      email: email,
    };

    Hud.showHud();
    await axios
      .post(`${base_url}forgetpassword`, emailData)
      .then(async response => {
        Hud.hideHud();
        if (response.status == 200) {
          console.log('reset token=======>', response.data.data.reset_token);
          Toast.show({
            type: 'info',
            text1: 'Otp has been send to your email address',
          });

          setToken(response.data.data.reset_token);
          setEmailOtpNumber(response.data.data.otp);
        } else {
          console.log('Status error==>', response.status);
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        Hud.hideHud();
        setLoading(false);
        if (error.response) {
          // Request made and server responded

          Toast.show({
            type: 'error',
            text1: 'Plese enter valid registered Email address',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const enterOtp = code => {
    console.log(code);
    console.log(typeof code);
    setOtpNumber(code);
    console.log('otp--->', otpNumber);
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <KeyboardAvoidingScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#ffffff', width: width * 0.9}}>
        <View style={{backgroundColor: '#FFFFFF', alignItems: 'center'}}>
          <View
            style={{
              height: height * 0.3,
              width: width * 0.45,
              alignSelf: 'center',
              marginTop: height * 0.05,
            }}>
            <Image
              source={require('../../Assets/Icon/otp.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              width: width * 0.75,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: RFValue(30),
                fontWeight: '600',
                color: '#151143',
                //fontFamily: 'Roboto-Medium',
              }}>
              OTP Verification
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: width * 0.75,
              justifyContent: 'center',
              marginVertical: height * 0.02,
            }}>
            <Text
              style={{
                color: '#151143',
                fontSize: RFValue(15),
                //fontFamily: 'Roboto-Regular',
                fontWeight: 'bold',
              }}>
              Email:
            </Text>
            <Text
              style={{
                color: '#151143',
                fontSize: RFValue(15),
                //fontFamily: 'Roboto-Regular',
                fontWeight: '400',
              }}>
              {email}
            </Text>
          </View>

          <View
            style={{
              //marginTop: 2,
              //backgroundColor: 'red',
              height: height * 0.13,
            }}>
            <CodeInput
              //ref="codeInputRef2"
              // secureTextEntry
              keyboardType="numeric"
              codeLength={4}
              activeColor="#151143"
              inactiveColor="#EBE0E5"
              autoFocus={false}
              inputPosition="center"
              size={50}
              onFulfill={code => enterOtp(code)}
              containerStyle={{marginTop: 10, marginBottom: 10}}
              codeInputStyle={{
                borderWidth: 1,
                borderColor: '#E92D87',
                borderRadius: 7,
              }}
            />
          </View>

          <View
            style={{width: width * 0.8, height: 50, marginTop: height * 0.03}}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => handleOtp()}>
              <Text style={{fontSize: 19, color: '#FFFFFF'}}>OTP Verify</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{alignSelf: 'center', margin: height * 0.07}}
            onPress={() => resend()}>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight: '400',
                color: '#151143',
              }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordOtp;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
  },

  imagesty: {width: '100%', height: '100%'},
});
