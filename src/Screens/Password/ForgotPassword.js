import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  I18nManager
} from 'react-native';
import { Input } from '@rneui/themed';
import ButtonDark from '../../Component/Common/ButtonDark';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loder from '../../Component/Common/Lodar';
import { PostRequest, PutRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function ForgotPassword(Props) {

  useEffect(() => {
    setLoder(true);
    selectedLng();
  }, []);


  const selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    setLoder(false)
    console.warn("selected Language data==>>>", lngData)
  }


  const [loder, setLoder] = useState(false);
  const [PasswordForgot, setPasswordForgot] = useState('');
  const [security, setSecurity] = useState(true);
  const [security1, setSecurity1] = useState(true);


  const [confirmPassword, setConfirmPassword] = useState('');



  const resetPassword = async () => {
    setLoder(true);
    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    // const params = {
    //     customerId: data?.id
    // }
    // let AccessToken = await AsyncStorage.getItem('traderResToken');

    console.log('props', Props.route.params.phone, Props.route.params.otp);
    const senddata = {
      // email: Props.route.params.email,
      // resetToken: AccessToken,
      // newPassword: PasswordForgot,
      mobileNumber: Props.route.params.phone,
      websiteId:"1",
      otp:Props.route.params.otp,
      password:PasswordForgot      
    };
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnn",senddata)
    // PostRequest('mobilelogin/password', senddata, {}, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/password`,
      headers: {
        authorization: `Bearer ${Test_ADMIN_TOKEN}`,

      },
      data: senddata,
    })

      .then(async response => {
        setLoder(false);
        console.log('change password responce 1111111111111111111111111111111111=> ', response.data[0].status );
        if (response.data[0].status == true) {
          Alert.alert(strings.CHANGE_PASSWORD, strings.CHANGE_PASS_SUCCESS, [
            { text: " " },
            { text: strings.OK , onPress: () => { Props.navigation.navigate('signin')}},
          ]);
        } else {
          // Alert.alert(
          //   strings.CHANGE_PASSWORD,
          //   strings.CHANGE_PASS_SUCCESS,
          //   [{ text: " " },
          //   {
          //     text: strings.OK, onPress: () => { Props.navigation.navigate('signin') }
          //   }],
          // );
        }
      })
      .catch(error => {
        setLoder(false);
        console.log('change password error => ', error);
        Alert.alert(strings.CHANGE_PASS_FAIL, strings.LOGIN_FAIL2, [
          { text: strings.CANCEL },
          { text: strings.OK }
        ])
      })

  };




  const submit = () => {
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  
      if (PasswordForgot == '') {
      Alert.alert(strings.FORGET_YOUR_PASSWORD, strings.ENTER_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (PasswordForgot.match(check) == null) {
      Alert.alert(
        strings.FORGET_YOUR_PASSWORD,
        strings.PASS_ERR,
        [
          { text: strings.CANCEL },
          { text: strings.OK },
        ],
      );
    } else if (PasswordForgot !== confirmPassword) {
      Alert.alert(
        strings.FORGET_YOUR_PASSWORD,
        strings.PASS_NOT_MATCH,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    }  else {
      resetPassword();
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginTop: 100,
          marginBottom: 40,
          textAlign: 'center',
          fontSize: 20,
          fontFamily: 'Roboto-Regular',
          color: '#47474B',
        }}>
        {strings.FORGET_YOUR_PASSWORD}
      </Text>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          color: '#3F4F5F',
          fontSize: 15,
          marginBottom: 5,
        }}>
        {strings.ENTER_NEW_PASS}
      </Text>
      <Input
        placeholder={strings.PASSWORD}
        inputContainerStyle={{ borderWidth: 1 }}
        containerStyle={{ paddingHorizontal: 0 }}
        inputStyle={{
          fontSize: 16,
          fontFamily: 'Roboto-Regular',
          color: '#47474B',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
        placeholderTextColor="#47474B"
        leftIconContainerStyle={{ marginLeft: 10 }}
        leftIcon={
          <Image
            source={require('../../Assets/password.png')}
            style={{ width: 25, height: 25 }}
          />
        }
        rightIconContainerStyle={{ marginLeft: 5, marginRight: 10 }}
        rightIcon={
          <TouchableOpacity onPress={() => setSecurity(!security)}>
            <Image
              source={require('../../Assets/eye.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        }
        secureTextEntry={security}
        onChangeText={e => setPasswordForgot(e)}
        value={PasswordForgot}
      />



      <Input
        placeholder={strings.CONFIRM_PASSWORD}
        inputContainerStyle={{ borderWidth: 1 }}
        containerStyle={{ paddingHorizontal: 0 }}
        inputStyle={{
          fontSize: 16,
          fontFamily: 'Roboto-Regular',
          color: '#47474B',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
        placeholderTextColor="#47474B"
        leftIconContainerStyle={{ marginLeft: 10 }}
        leftIcon={
          <Image
            source={require('../../Assets/password.png')}
            style={{ width: 25, height: 25 }}
          />
        }
        rightIconContainerStyle={{ marginLeft: 5, marginRight: 10 }}
        rightIcon={
          <TouchableOpacity onPress={() => setSecurity1(!security1)}>
            <Image
              source={require('../../Assets/eye.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        }
        secureTextEntry={security1}
        onChangeText={e => setConfirmPassword(e)}
        value={confirmPassword}
      />
      <ButtonDark
        handleClick={() => {
          submit()
          // resetPassword();
        }}
        title={strings.SUBMIT}
      />
      {loder && <Loder />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
});
