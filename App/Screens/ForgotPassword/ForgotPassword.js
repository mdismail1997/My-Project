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
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import axios from 'axios';
import {base_url} from '../../Services/constants';
import Hud from '../Common/Hud';
//import {getApicall, postApiCall} from '../../Services/Network';
import Toast from 'react-native-toast-message';

import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const ForgotPassword = props => {
  const [email, setEmail] = useState('');

  const [shownEmail, setShownEmail] = useState(false);

  const [errorMsg, setErrorMsg] = useState({
    isValidEmail: true,
  });

  const emailHandler = value => {
    setEmail(value);
    setShownEmail(true);
    //console.log(email);
  };

  const handleReset = async () => {
    const emailData = {
      email: email,
    };
    //props.navigation.navigate('ResetPassword');
    Hud.showHud();
    await axios
      .post(`${base_url}forgetpassword`, emailData)
      .then(async response => {
        Hud.hideHud();
        if (response.status == 200) {
          //console.log('login Status=======>', response);
          console.log('reset token=======>', response.data.data.reset_token);
          Toast.show({
            type: 'info',
            text1: 'OTP has been send to your mail.',
          });

          props.navigation.replace('ForgotPasswordOtp', {
            email: email,
            token: response.data.data.reset_token,
            otp: response.data.data.otp,
          });
        } else {
          console.log('Status error==>', response.status);
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        Hud.hideHud();

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
              source={require('../../Assets/Icon/ForgotPassword.png')}
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
            <Text style={{fontSize: RFValue(30), fontWeight: 'bold'}}>
              Forgot Password
            </Text>

            <Text
              style={{
                fontSize: RFValue(17),
                fontWeight: 'bold',
                marginTop: height * 0.03,
              }}>
              Please enter the email address you’d like your password reset
              information sent to{' '}
            </Text>
          </View>

          <View style={shownEmail ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                onChangeText={value => emailHandler(value)}
                placeholder="Email"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                style={{
                  flex: 1,
                  color: '#151143',
                }}
              />
            </View>

            <View
              style={{
                height: height * 0.05,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/reg_message.png')}
                style={
                  shownEmail
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
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
              onPress={() => handleReset()}>
              <Text style={{fontSize: 19, color: '#FFFFFF'}}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{alignSelf: 'center', margin: height * 0.07}}
            onPress={() => props.navigation.navigate('Login')}>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight: '400',
                color: '#151143',
              }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
    width: width * 0.8,
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
