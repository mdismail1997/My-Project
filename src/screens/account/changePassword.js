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
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import Toast from 'react-native-toast-message';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../utils/Api/apiName';
import axios from 'axios';
import Hud from '../../utils/hud';
import { RFValue } from 'react-native-responsive-fontsize';
import CountDown from 'react-native-countdown-component';

export default function UserVerification({navigation}) {
  const [digitOne, setDigitOne] = useState('');

  const [userEmail, setUserEmail] = useState('');
  const [counter, setCounter] = useState(60);
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    useremail();
    setCounter(60)
    resendOtp();
  }, []);

  // -----------------------Validation and api implementation------------------------
  const useremail = async () => {
    const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
    console.log('userEmail', email);
    setUserEmail(email);
  };

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
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('toooooookkkkkk', token);
      Hud.showHud();
      await axios({
        method: 'post',
        url: BASE_URL + 'otp-verify-to-reset-password',
        headers: {
          Accept: 'application/json',
          authorization: 'Bearer ' + token,
        },
        data: body,
      })
        .then(response => {
          console.log(response.data);
          Hud.hideHud();
          //setProfileImg(response.data.profile_photo);
          if(response.data.success){
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            navigation.navigate('resetPassword', {
              userEmail: userEmail,
              isChangePassword: true,
            });
          }else{
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
    const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
    console.log('userEmail', email);
    const body = {
      email: email,
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
        }else{
          Toast.show({
            type: 'error',
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
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconAntDesign
                color={colors.textHeader}
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
                source={require('../../asserts/logo.png')}
              />
              <Text style={styles.headerText}>Verification Code</Text>
              <Text style={[styles.subText, {marginVertical: 0}]}>
                Please type verification code send to
              </Text>
              <Text
                style={[
                  styles.subText,
                  {marginVertical: 0, marginBottom: 15, fontWeight: 'bold'},
                ]}>
                {userEmail}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '100%',
                }}>
                <OTPInputView
                  style={{width: '80%', height: 200}}
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
                style={{width: '100%'}}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity>
              {!disabled ? null : (
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

              )}
             
                {disabled? null : (
                    <TouchableOpacity style={{width: calcW(0.9)}} disabled={disabled} onPress={()=> resendOtp()}>
                    <Text
                      style={[
                        styles.subText,
                        {fontSize: RFValue(18), marginVertical: calcH(0.03)},
                      ]}>
                      Resend
                    </Text>
                  </TouchableOpacity>
                )}
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => navigation.navigate('homeScreen')}>
                <Text
                  style={[styles.subText, {fontSize: 18, marginVertical: 3}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
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
    color: colors.textHeader,
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
    color: '#000',
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
    textAlign: 'center',
  },
  underlineStyleBase: {
    width: 65,
    height: 80,
    borderWidth: 1,
    color: '#000000',
    borderRadius: 10,
    fontSize: 40,
    borderColor: '#DDDDDD',
  },

  underlineStyleHighLighted: {
    borderColor: '#000000',
  },
});
