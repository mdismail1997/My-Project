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
import React, {useState, useRef} from 'react';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
//import RadioForm from 'react-native-simple-radio-button';

import {RFValue} from 'react-native-responsive-fontsize';

import {base_url} from '../../Services/constants';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import CountryPicker from 'react-native-country-picker-modal';
import CustomRadio from '../Common/CustomRadio';

const {width, height} = Dimensions.get('window');

const Registration = props => {
  const nameRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const confirmPassRef = useRef();

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [countryCode, setCountryCode] = useState(null);
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [currency, setCurrency] = useState('');

  const onSelect = country => {
    setShownCountry(true);
    setCountryCode(country.cca2);
    setCountry(country.name);
    setWithCountryNameButton(true);
    setCurrency(country.currency[0]);
    console.log('Country Details===>', country);
    setErrorMsg({...errorMsg, isCountry: true});
  };

  const [value, setValue] = useState(0);
  var choice = [
    {label: 'User', value: 0},
    {label: 'Celebrity', value: 1},
  ];

  const userHandler = val => {
    setValue(val);
  };

  const [shownName, setShownName] = useState(false);
  const [shownUserName, setShownUserName] = useState(false);
  const [shownEmail, setShownEmail] = useState(false);
  const [shownPhone, setShownPhone] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const [shownConfirmPassword, setShownConfirmPassword] = useState(false);
  const [shownCountry, setShownCountry] = useState(false);

  const [errorMsg, setErrorMsg] = useState({
    isName: true,
    isValidEmail: true,
    isPhone: true,
    isValidPassword: true,
    isConfirmPassword: true,
    isUserName: true,
    isCountry: true,
  });

  const nameHandler = value => {
    setName(value);
    setShownName(true);
  };
  const userNameHandler = value => {
    setUserName(value);
    setShownUserName(true);
  };

  const emailHandler = value => {
    setEmail(value);
    setShownEmail(true);
  };

  const validateEmail = value => {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regExp.test(value) === false) {
      return false;
    } else {
      return true;
    }
  };

  const phoneHandler = value => {
    setPhone(value);
    setShownPhone(true);
  };

  const passwordHandler = value => {
    setPassword(value);
    setShownPassword(true);
  };

  const confirmPasswordHandler = value => {
    setConfirmPassword(value);
    setShownConfirmPassword(true);
  };

  const handleSubmit = async () => {
    if (name.trim() == '') {
      return setErrorMsg({...errorMsg, isName: false});
    } else if (userName.trim() == '') {
      return setErrorMsg({...errorMsg, isUserName: false});
    } else if (!validateEmail(email.trim())) {
      return setErrorMsg({...errorMsg, isValidEmail: false});
    } else if (country == null) {
      return setErrorMsg({...errorMsg, isCountry: false});
    } else if (password.trim().length < 8) {
      return setErrorMsg({...errorMsg, isValidPassword: false});
    } else if (password != confirmPassword) {
      return setErrorMsg({...errorMsg, isConfirmPassword: false});
    } else if (phone.trim() == '') {
      return setErrorMsg({...errorMsg, isPhone: false});
    } else {
      Hud.showHud();

      const registrationData = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        confirm_password: confirmPassword.trim(),
        country: country,
        user_type: value + 1,
        mobile_number: phone.trim(),
        username: userName.trim(),
        country_code: countryCode,
        currency: currency,
      };
      console.log('data====>', registrationData);
      await axios
        .post(`${base_url}register`, registrationData)
        .then(async response => {
          console.log('response==>', response.data.message);
          Hud.hideHud();
          // setLoading(false);
          if (response.status == 200) {
            setName('');
            setUserName('');
            setPhone('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            nameRef.current.clear();
            userNameRef.current.clear();
            phoneRef.current.clear();
            emailRef.current.clear();
            passwordRef.current.clear();
            confirmPassRef.current.clear();
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            if (value + 1 == 1) {
              props.navigation.navigate('Login');
            } else {
              props.navigation.navigate('PleaseWait');
            }
          } else {
            console.log('Error in registration==>', response.data.message);
          }
        })
        .catch(function (error) {
          Hud.hideHud();
          if (error.response) {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
            // Request made and server responded
            console.log('error==>', error.response.data);
            console.log('====>firstItem', firstItem);
            Toast.show({
              type: 'error',
              text1: firstItem,
            });
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(error.message);
          }
        });
    }
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
          <View style={{marginTop: height * 0.1, marginBottom: height * 0.03}}>
            <Text style={{fontSize: RFValue(40), fontWeight: 'bold'}}>
              Sign Up
            </Text>
          </View>

          <View style={shownName ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={nameRef}
                onChangeText={value => nameHandler(value)}
                placeholder="Name"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  userNameRef.current.focus();
                }}
                style={styles.input}
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
                source={require('../../Assets/Icon/name.png')}
                style={
                  shownName
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isName && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter Name
            </Text>
          )}

          <View style={shownUserName ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={userNameRef}
                onChangeText={value => userNameHandler(value)}
                placeholder="UserName"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
                style={styles.input}
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
                source={require('../../Assets/Icon/name.png')}
                style={
                  shownUserName
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isUserName && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter unique UserName
            </Text>
          )}

          <View style={shownEmail ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={emailRef}
                onChangeText={value => emailHandler(value)}
                placeholder="Email"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  phoneRef.current.focus();
                }}
                style={styles.input}
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
          {!errorMsg.isValidEmail && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid email
            </Text>
          )}

          <View style={shownPhone ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={phoneRef}
                onChangeText={value => phoneHandler(value)}
                placeholder="Phone"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="next"
                // onSubmitEditing={() => {
                //   passwordRef.current.focus();
                // }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                height: height * 0.038,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/mobile.png')}
                style={
                  shownPhone
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isPhone && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Phone number
            </Text>
          )}

          {shownCountry ? (
            <TouchableOpacity style={styles.divisionSelect}>
              <View style={{...styles.input, justifyContent: 'center'}}>
                <CountryPicker
                  {...{
                    countryCode,
                    withFlag,
                    withCountryNameButton,

                    onSelect,
                  }}
                  visible={shownCountry}
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
                  source={require('../../Assets/Icon/flag.png')}
                  style={
                    shownCountry
                      ? {...styles.imagesty, tintColor: 'black'}
                      : {...styles.imagesty, tintColor: '#B19DA7'}
                  }
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setShownCountry(true);
                //onSelect();
              }}
              style={styles.division}>
              <View style={{...styles.input, justifyContent: 'center'}}>
                {country == null ? (
                  <Text style={{color: '#8E7B85'}}>Country</Text>
                ) : (
                  <Text style={{color: '#151143'}}>{country}</Text>
                )}
              </View>

              <View
                style={{
                  height: height * 0.05,
                  width: width * 0.05,
                  alignSelf: 'center',
                  marginRight: 8,
                }}>
                <Image
                  source={require('../../Assets/Icon/flag.png')}
                  style={
                    shownCountry
                      ? {...styles.imagesty, tintColor: 'black'}
                      : {...styles.imagesty, tintColor: '#B19DA7'}
                  }
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          )}

          {!errorMsg.isCountry && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please Select your Country
            </Text>
          )}

          <View style={shownPassword ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={passwordRef}
                secureTextEntry={true}
                onChangeText={value => passwordHandler(value)}
                placeholder="Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPassRef.current.focus();
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
                  shownPassword
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isValidPassword && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Password
            </Text>
          )}

          <View
            style={
              shownConfirmPassword ? styles.divisionSelect : styles.division
            }>
            <View style={styles.input}>
              <TextInput
                ref={confirmPassRef}
                secureTextEntry={true}
                onChangeText={value => confirmPasswordHandler(value)}
                placeholder="Confirm Password"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
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

          {!errorMsg.isConfirmPassword && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Password
            </Text>
          )}

          {/* <View style={{width: width * 0.75, marginTop: height * 0.03}}>
            <Text style={{color: '#8E7B85', fontSize: RFValue(20)}}>
              User Type
            </Text>

            <View style={{marginVertical: height * 0.03}}>
              <RadioForm
                radio_props={choice}
                initial={0}
                onPress={val => userHandler(val)}
                buttonSize={12}
                buttonOuterSize={20}
                buttonColor={'#EBE0E5'}
                selectedButtonColor={'#E92D87'}
                //buttonInnerColor={'#EBE0E5'}
                labelHorizontal={true}
                labelStyle={{
                  fontSize: RFValue(20),
                  marginRight: 20,
                  color: '#151143',
                }}
                disabled={false}
                formHorizontal={true}
              />
            </View>
          </View> */}
          <View style={{width: width * 0.75, marginVertical: height * 0.03}}>
            <Text style={{color: '#8E7B85', fontSize: RFValue(20)}}>
              User Type
            </Text>

            <View
              style={{
                marginTop: height * 0.01,
                width: '70%',
                alignSelf: 'flex-start',
                //backgroundColor: 'red',
                //height: 50,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  //width: '40%',
                  alignSelf: 'flex-start',
                  //backgroundColor: 'red',
                  //height: 50,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <CustomRadio
                  status={value === 0}
                  onPress={() => userHandler(0)}
                />
                <Text
                  onPress={() => userHandler(0)}
                  style={{fontSize: RFValue(18), alignSelf: 'center'}}>
                  User
                </Text>
              </View>

              <View
                style={{
                  alignSelf: 'flex-start',
                  //backgroundColor: 'red',
                  //height: 50,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <CustomRadio
                  status={value === 1}
                  onPress={() => userHandler(1)}
                />

                <Text
                  onPress={() => userHandler(1)}
                  style={{fontSize: RFValue(18)}}>
                  Celebrity
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{width: width * 0.8, height: 50, marginTop: height * 0.02}}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => handleSubmit()}>
              <Text style={{fontSize: 19, color: '#FFFFFF'}}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              height: height * 0.07,
              width: width * 0.8,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height * 0.01,
              marginBottom: height * 0.05,
            }}>
            <Text style={{fontSize: RFValue(18), color: '#8A8A8A'}}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Login')}>
              <Text
                style={{
                  color: '#E92D87',
                  fontSize: RFValue(19),
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
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
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  imagesty: {width: '100%', height: '100%'},
});
