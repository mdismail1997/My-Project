import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import RadioForm from 'react-native-simple-radio-button';
import CustomRadio from '../Common/CustomRadio';

const {width, height} = Dimensions.get('window');

const Payment = props => {
  const [value, setValue] = useState(null);
  var choice = [
    {label: 'Stripe', value: 0},
    {label: 'Paypal', value: 1},
  ];
  const userHandler = val => {
    setValue(val);
  };

  const paymentPage = () => {
    if (value === 0) {
      props.navigation.replace('StripePayment');
    } else if (value === 1) {
      props.navigation.replace('PayPalPayment2');
    } else {
      Alert.alert('Please enter your Payment type');
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: height,
          width: width,
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

        {/* <View
        style={{
          //flex: 1,
          alignItems: 'center',
          backgroundColor: '#ffffff',
          width: width * 0.9,
          //backgroundColor: 'red',
          alignSelf: 'center',
        }}> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: width * 0.85,
            marginVertical: height * 0.03,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              source={require('../../Assets/Icon/back.png')}
              style={{
                height: 18,
                width: 10,
                tintColor: 'black',
                //marginLeft: 10,
              }}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#ffffff',
            width: width * 0.9,
          }}>
          <View
            style={{
              width: '100%',
              marginBottom: height * 0.05,
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {/* <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 100,
            backgroundColor: '#F0D8EE',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: height * 0.04,
          }}>
          <Image
            source={require('../../Assets/Icon/crown.png')}
            style={{
              height: 40,
              width: 50,
              resizeMode: 'cover',
              tintColor: '#E92D87',
            }}
          />
        </View> */}

            <View
              style={{
                height: height * 0.3,
                width: width * 0.45,
                alignSelf: 'center',
                // marginTop: height * 0.05,
              }}>
              <Image
                source={require('../../Assets/Icon/walleticon.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginBottom: height * 0.05,
                //marginTop: height * 0.04,
              }}>
              <Text
                style={{
                  fontSize: RFValue(22),
                  color: '#3F3D3F',
                  fontWeight: '500',
                  //fontFamily: 'Roboto-Medium',
                }}>
                Payment
              </Text>
              <Text
                style={{
                  marginTop: height * 0.01,
                  fontSize: RFValue(16),
                  color: '#7B7B7B',
                  fontWeight: '400',
                  //fontFamily: 'Roboto-Reqular',
                }}>
                Use gateway to make the payment.
              </Text>
            </View>

            {/* <View
              style={{
                width: '90%',
                //backgroundColor: 'grey',
                alignSelf: 'center',
              }}>
              <RadioForm
                radio_props={choice}
                initial={value}
                onPress={val => userHandler(val)}
                buttonSize={17}
                buttonOuterSize={25}
                buttonColor={'#EBE0E5'}
                selectedButtonColor={'#E92D87'}
                //buttonInnerColor={'#EBE0E5'}
                labelHorizontal={true}
                labelStyle={{
                  fontSize: RFValue(18),
                  marginRight: width * 0.2,
                  color: '#151143',
                }}
                disabled={false}
                formHorizontal={true}
              />
            </View> */}

            <View
              style={{
                marginTop: height * 0.01,
                width: '75%',
                alignSelf: 'flex-start',
                //backgroundColor: 'red',
                //height: 50,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: width * 0.05,
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
                  Stripe
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
                  PayPal
                </Text>
              </View>
            </View>

            <View
              style={{width: width * 0.8, height: 50, marginTop: height * 0.1}}>
              <TouchableOpacity
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#E92D87',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => paymentPage()}>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#FFFFFF',
                    //fontFamily: 'Roboto-Bold',
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: width * 0.8,
                height: 50,
                marginTop: height * 0.03,
                marginBottom: height * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E92D87',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#E92D87',
                    //fontFamily: 'Roboto-Medium',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingScrollView>

        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};

export default Payment;

const styles = StyleSheet.create({});
