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
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {base_url} from '../../Services/constants';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import Toast from 'react-native-toast-message';

import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const ResetPassword = props => {
  useEffect(() => {
    console.log('forgot email===>', props.route.params.email);
    console.log('reset token===>', props.route.params.token);
  }, []);

  const email = props.route.params.email;
  const resetToken = props.route.params.token;
  const newpasswordRef = useRef();
  const confirmpasswordRef = useRef();

  const [shownNewPassword, setShownNewPassword] = useState(false);
  const [shownConfirmPassword, setShownConfirmPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [email,setEmail]=useState('')

  const newPasswordHandler = value => {
    setNewPassword(value);
    setShownNewPassword(true);
    //console.log(newPassword);
  };

  const confirmPasswordHandler = value => {
    setConfirmPassword(value);
    setShownConfirmPassword(true);
    //console.log(confirmPassword);
  };

  const updateHandle = async () => {
    const emailData = {
      email: email,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    console.log('resetData====>', emailData);
    console.log('token==>', resetToken);
    await axios
      .post(`${base_url}resetpassword/` + resetToken, emailData)
      .then(async response => {
        //console.log('token------------>', response.data.data.token);
        setLoading(false);
        if (response.status == 200) {
          //console.log('login Status=======>', response);
          console.log('reset token=======>', response.data);

          //ToastAndroid.show('Password has been reset', ToastAndroid.SHORT);
          Toast.show({
            type: 'success',
            text1: 'Password has been reset',
          });
          props.navigation.replace('Login');
        } else {
          console.log('Status error==>', response.status);
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        setLoading(false);
        if (error.response) {
          // Request made and server responded

          var myobj = error.response.data.data;
          var firstItem = Object.values(myobj)[0];
          // Request made and server responded
          console.log('error==>', error.response.data);
          console.log('====>firstItem', firstItem);
          console.log('====>firstItem', typeof firstItem);

          Toast.show({
            type: 'error',
            text1: firstItem,
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
              Reset Password
            </Text>
          </View>

          <View
            style={shownNewPassword ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={newpasswordRef}
                onChangeText={value => newPasswordHandler(value)}
                placeholder="New Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmpasswordRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.03,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/lock.png')}
                style={
                  shownNewPassword
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>

          <View
            style={
              shownConfirmPassword ? styles.divisionSelect : styles.division
            }>
            <View style={styles.input}>
              <TextInput
                ref={confirmpasswordRef}
                onChangeText={value => confirmPasswordHandler(value)}
                placeholder="Confirm Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                secureTextEntry={true}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.03,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/lock.png')}
                style={
                  shownConfirmPassword
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>

          <View
            style={{width: width * 0.8, height: 50, marginTop: height * 0.05}}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => updateHandle()}>
              <Text style={{fontSize: RFValue(19), color: '#FFFFFF'}}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
            style={{alignSelf: 'center', margin: height * 0.07}}
            onPress={() => props.navigation.replace('Login')}>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight: '400',
                color: '#151143',
              }}>
              Back to Login
            </Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.03,
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
    marginTop: height * 0.03,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  imagesty: {width: '100%', height: '100%'},
});
