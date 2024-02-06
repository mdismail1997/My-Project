import React, { useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
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
import Hud from '../../utils/hud';
import { RFValue } from 'react-native-responsive-fontsize';
import axios from 'axios';
import { BASE_URL } from '../../utils/Api/apiName';

export default function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const [focusEmail, setFocusEmail] = useState(false);
  const [buttondisable, setButtonDisable] = useState(false)

  // const showHidePasswordFun = () => {
  //   setShowHide(!showHide);
  //   setShowHidePassword(!showHidePassword);
  // };

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  const handlesubmit = async () => {

    if (email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your email ',
      });
    } else {
      const body = {
        email: email,
      };
      console.log("========Body========", body)
      Hud.showHud()
      await axios({
        method: 'post',
        url: BASE_URL + 'forgot-password',
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      })
        .then(response => {
          //setIsLoading(false);
          console.log('=======Success==============', response.data);
          Hud.hideHud();
          navigation.navigate('otp', { userEmail: email });
          if (response.data.success === true) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            // setButtonDisable(false)
            // navigation.navigate('otp', { userEmail: email });
          } else {

            Toast.show({
              type: 'error',
              text1: response.data.message,
            });
            // setButtonDisable(false)
          }
        })
        .catch(err => {
          //setIsLoading(false);
          // setButtonDisable(false)
          Hud.hideHud();
          console.log('err', err);

          Toast.show({
            type: 'error',
            text1: err.response.message,
          });
        });
    }
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
              onPress={() => navigation.navigate('signUp')}
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
                marginTop: calcH(0.02),
                alignItems: 'center',
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
              <Text style={styles.headerText}>Forget Password</Text>
              <Text style={styles.subText}>
                Enter your registered email address
              </Text>
              <View
                style={
                  focusEmail === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusEmail === true ? (
                  <Image
                    source={require('../../asserts/email.png')}
                    style={{
                      width: calcW(0.055),
                      height: calcH(0.022),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../asserts/email.png')}
                    style={{
                      width: calcW(0.055),
                      height: calcH(0.022),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  value={email}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setEmail(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>

              <TouchableOpacity
                style={{ width: calcW(0.9) }}
                disabled={buttondisable}
                // onPress={() => navigation.navigate('otp')}>
                onPress={() => { handlesubmit() }}>
                <View style={[styles.buttonStyle, { backgroundColor: buttondisable ? colors.buttonAnothercolor : colors.buttonColor }]}>
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
                <Text
                  style={[
                    styles.subText,
                    { fontSize: RFValue(18), marginVertical: calcH(0.04) },
                  ]}>
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
    width: calcW(0.9),
    flex: Platform.OS === 'ios' ? 0.15 : null,
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.025),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    // paddingVertical: calcH(0.001),
  },
  activeBorder: {
    width: calcW(0.9),
    flex: Platform.OS === 'ios' ? 0.15 : null,
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.025),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    //paddingVertical: calcH(0.001),
  },
  headerText: {
    fontSize: RFValue(24),
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: calcH(0.02),
  },
  subText: {
    fontSize: RFValue(17),
    color: colors.subHeader,
    marginVertical: calcH(0.02),
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(16),
    flex: 1,
    paddingLeft: calcW(0.03),
    color: colors.activeBorder,
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.03),
  },
  buttonTextStyle: {
    fontSize: RFValue(18),
    color: colors.white,
    // marginVertical: 10,
    textAlign: 'center',
  },
});
