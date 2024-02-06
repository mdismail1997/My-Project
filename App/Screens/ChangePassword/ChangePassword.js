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
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Hud from '../Common/Hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {postApiCall} from '../../Services/Network';
import Toast from 'react-native-toast-message';
//import Toasts from 'react-native-simple-toast';

const {width, height} = Dimensions.get('window');

const ChangePassword = props => {
  const oldpasswordRef = useRef();
  const newpasswordRef = useRef();
  const confirmpasswordRef = useRef();

  const [shownOldPassword, setShownOldPassword] = useState(false);
  const [shownNewPassword, setShownNewPassword] = useState(false);
  const [shownConfirmPassword, setShownConfirmPassword] = useState(false);

  const [oldpassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const oldPasswordHandler = value => {
    setOldPassword(value);
    setShownOldPassword(true);
    //console.log(oldpassword);
  };

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
    console.log('old password==>', oldpassword);
    console.log('newPassword==>', newPassword);
    console.log('confirmPassword==>', confirmPassword);
    //props.navigation.navigate('Home')
    if (newPassword.trim().length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password should be atleast 8 digit.',
      });
    } else if (newPassword != confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'The new password and confirm password must match.',
      });
    } else {
      Hud.showHud();
      const changeData = {
        old_password: oldpassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      console.log('change data==>', changeData);
      await postApiCall('changepassword', changeData, {})
        .then(response => {
          Hud.hideHud();
          console.log('response==>', response.data);
          if (response.status === 200) {
            console.log('message===>', response.data.message);
            // ToastAndroid.show(
            //   'Password has been Updated Successfully',
            //   ToastAndroid.SHORT,
            // );
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Password has been Updated Successfully',
            });
            props.navigation.navigate('Home');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Password has not been Updated Successfully',
            });
          }
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            console.log('error==>', error.response.data.message);
            Hud.hideHud();
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Old Password is not correct',
            });
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error request===>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('error setting==>', error.message);
          }
        });
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <TouchableOpacity
        style={{
          width: width * 0.9,
          marginTop: height * 0.05,
          alignItems: 'flex-start',
        }}
        onPress={() => props.navigation.goBack()}>
        <Image
          source={require('../../Assets/Icon/back.png')}
          style={{
            height: 18,
            width: 12,
            tintColor: 'black',
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>

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
              Change Password
            </Text>
          </View>

          <View
            style={shownOldPassword ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={oldpasswordRef}
                onChangeText={value => oldPasswordHandler(value)}
                placeholder="Old Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={() => {
                  newpasswordRef.current.focus();
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
                  shownOldPassword
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
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
              onPress={() => updateHandle()}
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: RFValue(19), color: '#FFFFFF'}}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

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
