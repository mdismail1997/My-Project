import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
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
import {BASE_URL} from '../../utils/Api/apiName';
import axios from 'axios';
import commonToast from '../../utils/commonToast';
import Hud from '../../utils/hud'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDown from 'react-native-countdown-component';

import {RFValue} from 'react-native-responsive-fontsize';

export default function UserVerification({navigation, route}) {
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setMobile] = useState('');
  const [Usercountrycode, setCountry] = useState('');
  const [counter, setCounter] = useState(60);
  const [disabled, setDisabled] = useState(true)


  useEffect(() => {
    const passedData = route.params;
    
    console.log('eeeee', passedData);
    if (passedData) {
      setUserEmail(passedData.userEmail)
      setMobile(passedData.UserPhone);
      setCountry(passedData.UserCountry)
      setCounter(60)

    }
  }, [route.params]);

  const sendOTP = async () => {
    console.log("=================",userEmail);
    Hud.showHud()
    setDisabled(true)
    setCounter(60)
    try {
      Hud.showHud()
      const response = await axios.post(
        'https://kabou.us/api/rider/reg-resend-otp',
        {
          email: userEmail,
        },
      );
      console.log(response.data);
      Hud.hideHud()
      commonToast({
        text: response.data.message,
        position: 'top',
      });
    } catch (error) {
      Hud.hideHud()
      console.error(error);
    }
  };

  const doVerifyOtp = async code => {
    //setIsLoading(true);
    const data = {
      email: userEmail,
      otp: code,
    };
    console.log(data);
    //Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'otp-verify',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        // setIsLoading(false);
        //Hud.hideHud();
        console.log('response', response);
        if (response.data.success === true) {
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'success',
          });

          navigation.navigate('signIn');
        }
        console.log('Successotppppppppppp', response.data);
        if(response.data.success === false){
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'error',
          });
        }

      })
      .catch(err => {
        // setIsLoading(false);
        console.log('err', err);
        //Hud.hideHud();
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
          <View
            style={{
              position: 'absolute',
              left: calcW(0.05),
              top: calcW(0.04),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../../assets/images/back_arrow.png')}
                style={{
                  width: calcW(0.06),
                  height: calcH(0.022),
                  tintColor: colors.activeBorder,
                }}
              />
              <Text
                style={[
                  styles.subText,
                  {fontWeight: 'bold', fontSize: RFValue(18)},
                ]}>
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
                marginTop: calcH(0.02),
                padding: allPadding,
              }}>
              <Image
                style={{
                  height: logoHeight,
                  width: logoWidth,
                  resizeMode: 'contain',
                  marginBottom: calcH(0.03),
                }}
                source={require('../../../assets/images/logo.png')}
              />
              <Text style={styles.headerText}>Verification Code</Text>
              <Text style={[styles.subText, {marginVertical: 0}]}>
                Please type verification code send
              </Text>
              <Text
                style={[
                  styles.subText,
                  {marginVertical: 0, marginBottom: calcH(0.02)},
                ]}>
                to +{Usercountrycode}{userMobile}
              </Text>

              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '100%',
                }}> */}
              {/* <View
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
                </View> */}
              <OTPInputView
                style={{
                  width: calcW(0.8),
                  height: calcH(0.3),
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderColor: '#000',
                }}
                // placeholderTextColor="#000"
                pinCount={4}
                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                // onCodeChanged = {code => { this.setState({code})}}
                autoFocusOnLoad={true}
                editable={true}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={code => {
                  doVerifyOtp(code);
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />
              {/* </View> */}
              {/* <TouchableOpacity onPress={doVerifyOtp} style={{width: '100%'}}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity>  */}

              {/* <TouchableOpacity style={{width: calcW(0.9)}} onPress={sendOTP}>
                <Text
                  style={[
                    styles.subText,
                    {fontSize: RFValue(18), marginVertical: calcH(0.03)},
                  ]}>
                  Resend
                </Text>
              </TouchableOpacity> */}
                <CountDown
             
             key={new Date().getTime().toString()}
                  until={counter}
                  size={15}
                  onFinish={() => {setDisabled(() => false),setCounter(0)}}
                  // onFinish={() => exipry_otp()}

                separatorStyle={{ color: 'black' }}
                  digitStyle={{ backgroundColor: '#FFF' }}
                  digitTxtStyle={{ color: 'black' }}
                  timeToShow={['M', 'S']}
                  showSeparator
                  timeLabels={{ m: '', s: '' }}
                />

                {disabled? null : (
                    <TouchableOpacity style={{width: calcW(0.9)}} disabled={disabled} onPress={sendOTP}>
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
}

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
    width: calcW(0.2),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.01),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: calcH(0.01),
  },
  activeBorder: {
    width: calcW(0.2),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.01),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: calcH(0.01),
  },
  headerText: {
    fontSize: RFValue(24),
    color: colors.headerText,
    fontWeight: 'bold',
    marginVertical: calcH(0.02),
  },
  subText: {
    fontSize: RFValue(16),
    color: colors.subHeader,
    marginVertical: calcH(0.02),
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(16),
    flex: 1,
    // paddingLeft: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  buttonTextStyle: {
    fontSize: RFValue(18),
    color: colors.white,
    textAlign: 'center',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#000',
  },

  underlineStyleHighLighted: {
    borderColor: colors.activeBorder,
  },
});
