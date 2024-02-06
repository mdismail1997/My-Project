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
  Modal,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
//import OTPInputView from '@twotalltotems/react-native-otp-input';
import CodeInput from 'react-native-code-input';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Toast from 'react-native-toast-message';

import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const Otp = props => {
  const [shown, setShown] = useState(false);
  const [number, setNumber] = useState('+91 987 456 1234');
  const [newNumber, setNewNumber] = useState('');

  const [otpNumber, setOtpNumber] = useState('');
  const [shownModal, setShowModal] = useState(false);

  const handleOtp = () => {
    console.log('otp Number--->', otpNumber);
    props.navigation.navigate('Login');
  };

  const resend = () => {
    console.log('resend Code');
  };

  const enterOtp = code => {
    console.log(code);
    console.log(typeof code);
    setOtpNumber(code);
    console.log('otp--->', otpNumber);
  };

  const editNumberHandel = value => {
    setNewNumber(value);
    console.log(newNumber.length);
    if (newNumber.length === 10) {
      setNumber(newNumber);
      setShowModal(false);
      console.log(newNumber);
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
          <View
            style={{
              height: height * 0.3,
              width: width * 0.45,
              alignSelf: 'center',
              marginTop: height * 0.05,
            }}>
            <Image
              source={require('../../Assets/Icon/otp.png')}
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
            <Text
              style={{
                fontSize: RFValue(30),
                fontWeight: '600',
                color: '#151143',
                //fontFamily: 'Roboto-Medium',
              }}>
              OTP Verification
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: width * 0.75,
              justifyContent: 'center',
              marginVertical: height * 0.02,
            }}>
            <Text
              style={{
                color: '#151143',
                fontSize: RFValue(18),
                //fontFamily: 'Roboto-Regular',
                fontWeight: '400',
              }}>
              Mobile No.
            </Text>
            <Text
              style={{
                color: '#151143',
                fontSize: RFValue(18),
                //fontFamily: 'Roboto-Regular',
                fontWeight: '400',
              }}>
              {number}
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={{
                height: height * 0.025,
                width: width * 0.05,
                marginLeft: width * 0.02,
                // backgroundColor: 'red',
              }}>
              <Image
                source={require('../../Assets/Icon/pen.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Modal visible={shownModal} transparent={true}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                flex: 1,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: width * 0.8,
                  height: height * 0.3,
                  alignItems: 'center',
                  marginTop: height * 0.25,
                  borderRadius: 20,
                }}>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Image
                    source={require('../../Assets/Icon/close.png')}
                    style={{
                      width: 25,
                      height: 25,
                      marginLeft: width * 0.65,
                      marginTop: 10,
                    }}
                  />
                </TouchableOpacity>

                <View>
                  <Text
                    style={{
                      fontSize: RFValue(20),
                      fontWeight: '600',
                      color: '#151143',
                      //fontFamily: 'Roboto-Medium',
                    }}>
                    Enter Your Number
                  </Text>
                  <View style={styles.divisionSelect}>
                    <TextInput
                      //ref={passwordRef}
                      onChangeText={value => editNumberHandel(value)}
                      placeholder={number}
                      keyboardType="numeric"
                      //secureTextEntry={true}
                      style={{
                        flex: 1,
                        color: '#151143',
                      }}
                      placeholderTextColor={'#8E7B85'}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <View
            style={{
              //marginTop: 2,
              //backgroundColor: 'red',
              height: height * 0.13,
            }}>
            <CodeInput
              //ref="codeInputRef2"
              // secureTextEntry
              keyboardType="numeric"
              codeLength={4}
              activeColor="#151143"
              inactiveColor="#EBE0E5"
              autoFocus={false}
              inputPosition="center"
              size={50}
              onFulfill={code => enterOtp(code)}
              containerStyle={{marginTop: 10, marginBottom: 10}}
              codeInputStyle={{
                borderWidth: 1,
                borderColor: '#E92D87',
                borderRadius: 7,
              }}
            />
          </View>

          <View
            style={{width: width * 0.8, height: 50, marginTop: height * 0.03}}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => handleOtp()}>
              <Text style={{fontSize: 19, color: '#FFFFFF'}}>OTP Verify</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{alignSelf: 'center', margin: height * 0.07}}
            onPress={() => resend()}>
            <Text
              style={{
                fontSize: RFValue(20),
                fontWeight: '400',
                color: '#151143',
              }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
  },

  imagesty: {width: '100%', height: '100%'},
});
