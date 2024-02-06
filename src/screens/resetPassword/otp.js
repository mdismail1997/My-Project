import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
  resendOTP,
} from '../../utils/comon';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {BASE_URL} from '../../utils/Api/apiName';
import axios from 'axios';
import commonToast from '../../utils/commonToast';
import Hud from '../../utils/hud';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDown from 'react-native-countdown-component';
import {RFValue} from 'react-native-responsive-fontsize';

export default otp = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState(0);
  const [digitTwo, setDigitTwo] = useState(0);
  const [digitThree, setDigitThree] = useState(0);
  const [digitFour, setDigitFour] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [focusDigitOne, setFocusDigitOne] = useState(false);

  const [focusDigitTwo, setFocusDigitTwo] = useState(false);
  const [focusDigitThree, setFocusDigitThree] = useState(false);

  const [focusDigitFour, setFocusDigitFour] = useState(false);
  const [counter, setCounter] = useState(60);
  const [disabled, setDisabled] = useState(true);

  const onFocusTextInputDigitOne = () => {
    setFocusDigitOne(true);
  };

  const onBlurTextInputDigitOne = () => {
    setFocusDigitOne(false);
  };

  const onFocusTextInputDigitTwo = () => {
    setFocusDigitTwo(true);
  };

  const onBlurTextInputDigitTwo = () => {
    setFocusDigitTwo(false);
  };

  const onFocusTextInputDigitThree = () => {
    setFocusDigitThree(true);
  };

  const onBlurTextInputDigitThree = () => {
    setFocusDigitThree(false);
  };

  const onFocusTextInputDigitFour = () => {
    setFocusDigitFour(true);
  };

  const onBlurTextInputDigitFour = () => {
    setFocusDigitFour(false);
  };

  const sendOTP = async () => {
    Hud.showHud();
    try {
      const response = await resendOTP(route.params.userEmail, '');
      Hud.hideHud();
      setDisabled(true);
      setCounter(60);
      commonToast({
        text: response.data.message,
        position: 'top',
      });
      console.log(response.data);
    } catch (error) {
      Hud.hideHud();
      console.error(error);
    }
  };

  useEffect(() => {
    const passedData = route.params;

    console.log('eeeee', passedData);
    if (passedData) {
      setUserEmail(passedData.userEmail);
      setPhoneNo(passedData.UserPhone);
      setCounter(60);
    }
  }, [route.params]);

  const doVerifyOtp = async code => {
    setIsLoading(true);
    const data = {
      email: userEmail,
      otp: code,
    };
    console.log(data);

    await axios({
      method: 'post',
      url: BASE_URL + 'otp-verify-to-reset-password',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        setIsLoading(false);

        if (response.data.success === true) {
          commonToast({
            text: response.data.message,
            position: 'top',
          });

          navigation.navigate('setPassword', {userEmail: userEmail});
        }
        console.log('Success', response.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('err', err);
        commonToast({
          text: err,
          position: 'top',
          toastFor: 'error',
        });
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          {/* <View style={styles.viewOne}>

          </View> */}

          <View
            style={{
              position: 'absolute',
              left: 15,
              top: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('signIn')}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconAntDesign
                color={colors.headerText}
                size={24}
                name={'arrowleft'}
              />
              <Text
                style={[styles.subText, {fontWeight: 'bold', fontSize: 18}]}>
                {'   '}Back
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                padding: allPadding,
              }}>
              <Image
                style={{
                  height: logoHeight,
                  width: logoWidth,
                  resizeMode: 'contain',
                  marginBottom: 30,
                }}
                source={require('../../../assets/images/logo.png')}
              />
              <Text style={styles.headerText}>Verification Code</Text>
              <Text style={[styles.subText, {marginVertical: 0}]}>
                Please type verification code send
              </Text>
              <Text
                style={[styles.subText, {marginVertical: 0, marginBottom: 15}]}>
                to {userEmail}
              </Text>

              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View
                  style={
                    focusDigitOne === true
                      ? styles.activeBorder
                      : styles.inActiveBorder
                  }>
                  <TextInput
                    style={styles.textInput}
                    value={digitOne}
                    keyboardType="numeric"
                    maxLength={1}
                    onBlur={() => onBlurTextInputDigitOne()}
                    onFocus={() => onFocusTextInputDigitOne()}
                    onChangeText={text => setDigitOne(text)}
                  />
                </View>
                <View
                  style={
                    focusDigitTwo === true
                      ? styles.activeBorder
                      : styles.inActiveBorder
                  }>
                  <TextInput
                    style={styles.textInput}
                    value={digitTwo}
                    keyboardType="numeric"
                    maxLength={1}
                    onBlur={() => onBlurTextInputDigitTwo()}
                    onFocus={() => onFocusTextInputDigitTwo()}
                    onChangeText={text => setDigitTwo(text)}
                  />
                </View>
                <View
                  style={
                    focusDigitThree === true
                      ? styles.activeBorder
                      : styles.inActiveBorder
                  }>
                  <TextInput
                    style={styles.textInput}
                    value={digitThree}
                    keyboardType="numeric"
                    maxLength={1}
                    onBlur={() => onBlurTextInputDigitThree()}
                    onFocus={() => onFocusTextInputDigitThree()}
                    onChangeText={text => setDigitThree(text)}
                  />
                </View>
                <View
                  style={
                    focusDigitFour === true
                      ? styles.activeBorder
                      : styles.inActiveBorder
                  }>
                  <TextInput
                    style={styles.textInput}
                    value={digitFour}
                    keyboardType="numeric"
                    maxLength={1}
                    onBlur={() => onBlurTextInputDigitFour()}
                    onFocus={() => onFocusTextInputDigitFour()}
                    onChangeText={text => setDigitFour(text)}
                  />
                </View>
              </View> */}

              <OTPInputView
                style={{
                  height: 200,
                  width: '80%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderColor: '#000',
                }}
                pinCount={4}
                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                // onCodeChanged = {code => { this.setState({code})}}
                autoFocusOnLoad={true}
                editable={true}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeChanged={code => {
                  console.log('my code', code);
                }}
                onCodeFilled={code => {
                  doVerifyOtp(code);
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />
              {/* <TouchableOpacity
                onPress={(code)=> {doVerifyOtp(code)}}
                style={{width: '100%'}}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => {
                  sendOTP();
                }}>
                <Text
                  style={[styles.subText, {fontSize: 18, marginVertical: 30}]}>
                  Resend
                </Text>
              </TouchableOpacity> */}
              <CountDown
                key={new Date().getTime().toString()}
                until={counter}
                size={15}
                onFinish={() => {
                  setDisabled(() => false), setCounter(0);
                }}
                // onFinish={() => exipry_otp()}

                separatorStyle={{color: 'black'}}
                digitStyle={{backgroundColor: '#FFF'}}
                digitTxtStyle={{color: 'black'}}
                timeToShow={['M', 'S']}
                showSeparator
                timeLabels={{m: '', s: ''}}
              />

              {disabled ? null : (
                <TouchableOpacity
                  style={{width: calcW(0.9)}}
                  disabled={disabled}
                  onPress={() => sendOTP()}>
                  <Text
                    style={[
                      styles.subText,
                      {fontSize: RFValue(18), marginVertical: calcH(0.03)},
                    ]}>
                    Resend
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 2,
  },
  viewThree: {
    flex: 1,
  },
  inActiveBorder: {
    width: '20%',
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: '20%',
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 24,
    color: colors.headerText,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subText: {
    fontSize: 16,
    color: colors.subHeader,
    marginVertical: 10,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    // paddingLeft: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextStyle: {
    fontSize: 18,
    color: colors.white,
    // marginVertical: 10,
    textAlign: 'center',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#000',
    color: '#000',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
