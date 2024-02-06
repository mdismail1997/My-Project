import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager
} from 'react-native';
import { CheckBox, Input } from '@rneui/themed';
import ButtonDark from '../../Component/Common/ButtonDark';
import Loder from '../../Component/Common/Lodar';
import { PostRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import axios from 'axios';

export default function Registration(props,{ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tandc, setTandC] = useState(false);
  const [loder, setLoder] = useState(false);
  const [security, setSecurity] = useState(true);
  const [security2, setSecurity2] = useState(true);

  useEffect(() => {
    setLoder(true)

    selectedLng()
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

  const submit = () => {
    let phoneRegExp = /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/;
    let num = phone.slice(0, 3)
    // console.warn('nummmm', num)
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    let reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (name == '') {
      Alert.alert(strings.REGISTRATION, strings.ENTER_THE_NAME, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (email == '') {
      Alert.alert(strings.REGISTRATION, strings.EMAIL_ERR, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (reg.test(email) == false) {
      Alert.alert(strings.REGISTRATION, strings.VALID_EMAIL, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (phone == '') {
      Alert.alert(strings.REGISTRATION, strings.ENTER_PHONE_NO, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (phone.length !== 0 && phoneRegExp.test(num == '971' ? ('00' + phone) : (phone)) == false) {
      Alert.alert(strings.REGISTRATION, strings.ENTER_10DIGIT_NO, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password == '') {
      Alert.alert(strings.REGISTRATION, strings.ENTER_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password.match(check) == null) {
      Alert.alert(
        strings.REGISTRATION,
        strings.PASS_ERR,
        [
          { text: strings.CANCEL },
          { text: strings.OK },
        ],
      );
    } else if (password !== confirmPassword) {
      Alert.alert(
        strings.REGISTRATION,
        strings.PASS_NOT_MATCH,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else if (tandc == false) {
      Alert.alert(strings.REGISTRATION, strings.ACCEPT_TC, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else {
      register();
    }
  };

  const register = async () => {
    setLoder(true);
    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    let fullname = name.split(' ');
    const data = {
      customer:{
      email: email,
      firstname: fullname[0],
      lastname: fullname.length == 1 ? " " : fullname[fullname.length - 1],
      // firstname: name,
      // lastname: " ",
        custom_attributes: [
          {
          attribute_code: "phone_number",
          value: phone
          }
        ]
      },
      mobileNumber: props.route.params.phone,
      password: password,
      otp:props.route.params.otp        
  
      
  };
    // const data = {
    //   customer: {
    //     email: email,
    //     firstname: name,
    //     lastname: ' ',
    //   },
    //   password: password,
    // };
    console.warn("send registration Data",data)
    // PostRequest('mobilelogin/createaccount', {}, data, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/createaccount`,
      headers: {
          authorization: `Bearer ${Test_ADMIN_TOKEN}`,

      },
      data: data,
  })
      .then(async res => {
        setLoder(false);
        console.log('Registration responce => ', res.data);
        if (res.message) {
          Alert.alert(strings.REGISTRATION, "Register Successfully", [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        } else {
          Alert.alert(
            strings.REG_SUCCESS,
            strings.REG_SUCCESS2,
            [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => props.navigation.navigate('signin'),
              },
            ],
          );
        }
      })
      .catch(error => {
        setLoder(false);
        console.warn('Registration error => ', error.response.data.message);
        Alert.alert(error.response.data.message, strings.LOGIN_FAIL2, [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
        >
        <View>
          <Text
            style={{
              marginTop: 60,
              marginBottom: 40,
              textAlign: 'center',
              fontSize: 30,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
            }}>
            {strings.SIGNUP}
          </Text>
          <Input
            placeholder={strings.ENTER_NAME}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                source={require('../../Assets/account.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setName(e)}
            value={name}
          />
          <Input
            placeholder={strings.ENTER_EMAIL_ID}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                source={require('../../Assets/gmail.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setEmail(e)}
            value={email}
          />
          <Input
            placeholder={strings.MOBILE_NUMBER}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                source={require('../../Assets/phone.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setPhone(e)}
            value={phone.replace(/\s/g, '')}
          />
          <Input
            placeholder={strings.PASSWORD}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
              <TouchableOpacity onPress={() => setSecurity2(!security2)}>
                <Image
                  source={require('../../Assets/eye.png')}
                  style={{ width: 25, height: 25 }}
                />
              </TouchableOpacity>
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setPassword(e)}
            secureTextEntry={security2}
            value={password}
          />
          <Input
            placeholder={strings.CONFIRM_PASSWORD}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
            errorStyle={{ display: 'none' }}
            secureTextEntry={security}
            onChangeText={e => setConfirmPassword(e)}
            value={confirmPassword}
          />
          <View>
            <CheckBox
              center
              title={strings.TERMS_AND_CONDITIONS}
              checkedColor="#5A5A5F"
              textStyle={{
                color: '#47474B',
                fontFamily: 'OpenSans-Regular',
                fontSize: 16,
                fontWeight: 'normal',
              }}
              checked={tandc}
              onPress={() => setTandC(!tandc)}
            />
          </View>
          <ButtonDark handleClick={() => submit()} title={strings.SIGNUP} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 40,
            marginBottom: 60,
          }}>
          <Text
            style={{
              color: '#676767',
              fontSize: 18,
              fontFamily: 'Roboto-Regular',
            }}>
            {strings.ALREADY_HAVE_ACCOUNT_LOGIN}{' '}
          </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('signin')}>
            <Text
              style={{
                fontSize: 18,
                color: '#515256',
                fontFamily: 'Roboto-Bold',
              }}>
              {strings.SIGN_IN}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
