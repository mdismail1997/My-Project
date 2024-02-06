

import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
} from '../../utils/comon';

import Toast from 'react-native-toast-message';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Hud from '../../utils/hud';
import { RFValue } from 'react-native-responsive-fontsize';
import axios from 'axios';
import { BASE_URL } from '../../utils/Api/apiName';
import CountDown from 'react-native-countdown-component';

export default function UserVerification({ navigation, route }) {
  const [digitOne, setDigitOne] = useState('');

  const [userEmail, setUserEmail] = useState('');
  const [counter, setCounter] = useState(60);
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const passedData = route.params;

    // console.log('eeeee', passedData)
    if (passedData) {
      setUserEmail(passedData.userEmail);
      setCounter(60)
    }
  }, [route.params]);

  // -----------------------Validation and api implementation------------------------

  const handlesubmit = async () => {
    if (digitOne === '') {
      // console.warn('abccccccccccc');
      Toast.show({
        type: 'error',
        text1: 'Please enter your OTP ',
      });
    } else {
      const body = {
        email: userEmail,
        otp: digitOne,
      };
      console.log('heeeeeeeeeeeee', body);
      // (async () => {
      //   Hud.showHud();
      //   const rawResponse = await fetch(
      //     // 'http://mydevfactory.com/~devserver/kabou/api/driver/otp-verify',
      //     'http://kabou.us/api/driver/otp-verify-to-reset-password',
      //     {
      //       method: 'POST',
      //       headers: {
      //         Accept: 'application/json',
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(body),
      //     },
      //   );
      //   const content = await rawResponse.json();

      //   console.log(content);
      //   Hud.hideHud();
      //   if (content.success) {
      //     Toast.show({
      //       type: 'success',
      //       text1: content.message,
      //     });

      //     // setTimeout(() => {
      //     //   try {
      //     //     AsyncStorage.setItem('userToken', JSON.stringify(content.data));
      //     //   } catch (error) { }

      //     // navigation.navigate('documentUpload');
      //     navigation.navigate('setPassword', {userEmail: userEmail});
      //     // }, 1000);
      //   } else {
      //     Hud.hideHud();
      //     Toast.show({
      //       type: 'error',
      //       text1: content.message,
      //     });
      //   }
      // })();
      Hud.showHud()
      await axios({
        method: 'post',
        url: BASE_URL + 'otp-verify-to-reset-password',
        headers: {
          Accept: 'application/json',
          //authorization: 'Bearer ' + token,
        },
        data: body,
      })
        .then(response => {
          console.log("byiyiyiu", response.data.message);
          Hud.hideHud();
          //setProfileImg(response.data.profile_photo);
          if (response.data.success) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            navigation.navigate('setPassword', { userEmail: userEmail });
          } else {
            Toast.show({
              type: 'error',
              text1: response.data.message,
            });
          }

        })
        .catch(err => {
          console.log('err', err);
          Hud.hideHud();
          Toast.show({
            type: 'error',
            text1: err.response.message,
          });
        });
    }
  };
  const resendOtp = async () => {

    const body = {
      email: userEmail,
    };
    console.log('userEmail', body);
    Hud.showHud()

    setDisabled(true)
    setCounter(60)
    await axios({
      method: 'post',
      url: BASE_URL + 'otp-resend',
      headers: {
        Accept: 'application/json',
        //authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {

        console.log('resend otp', response.data);
        Hud.hideHud()
        if (response.data.success === true) {
          Toast.show({
            type: 'success',
            text1: response.data.message,
          });

        }
      })
      .catch(err => {
        Hud.hideHud()
        console.log('resend otp err', err);
        Toast.show({
          type: 'error',
          text1: err.response.data.message,
        });
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* <View style={styles.viewOne}>

          </View> */}
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
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../asserts/back_arrow.png')}
                style={{
                  width: calcW(0.06),
                  height: calcH(0.022),
                  tintColor: colors.activeBorder,
                }}
              />
              <Text
                style={[
                  styles.subText,
                  { fontWeight: 'bold', fontSize: RFValue(18) },
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
                source={require('../../asserts/logo.png')}
              />
              <Text style={styles.headerText}>Verification Code</Text>
              <Text style={[styles.subText, { marginVertical: 0 }]}>
                Please type verification code send
              </Text>
              <Text
                style={[
                  styles.subText,
                  { marginVertical: 0, marginBottom: calcH(0.02) },
                ]}>
                to {userEmail}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: calcW(0.9),
                }}>
                <OTPInputView
                  style={{ width: calcW(0.8), height: calcH(0.3) }}
                  pinCount={4}
                  editable
                  code={digitOne} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                  onCodeChanged={code => {
                    setDigitOne(code);
                  }}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={code => {
                    console.log(`Code is ${code}, you are good to go!`);
                  }}
                />


              </View>
              <TouchableOpacity
                // onPress={() => navigation.navigate('documentUpload')}
                onPress={() => handlesubmit()}
                style={{ width: calcW(0.9) }}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity>
              <CountDown

                key={new Date().getTime().toString()}
                until={counter}
                size={15}
                onFinish={() => { setDisabled(() => false), setCounter(0) }}
                // onFinish={() => exipry_otp()}

                separatorStyle={{ color: 'black' }}
                digitStyle={{ backgroundColor: '#FFF' }}
                digitTxtStyle={{ color: 'black' }}
                timeToShow={['M', 'S']}
                showSeparator
                timeLabels={{ m: '', s: '' }}
              />

              {disabled ? null : (
                <TouchableOpacity style={{ width: calcW(0.9) }} disabled={disabled} onPress={() => resendOtp()}>
                  <Text
                    style={[
                      styles.subText,
                      { fontSize: RFValue(18), marginVertical: calcH(0.03) },
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
    color: colors.textHeader,
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
    width: calcW(0.18),
    height: calcH(0.12),
    borderWidth: 1,
    color: '#000000',
    borderRadius: 10,
    fontSize: RFValue(40),
    borderColor: '#DDDDDD',
  },

  underlineStyleHighLighted: {
    borderColor: '#000000',
  },
});
