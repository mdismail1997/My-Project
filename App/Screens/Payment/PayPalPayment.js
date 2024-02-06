import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {RFValue} from 'react-native-responsive-fontsize';

import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import {postApiCall} from '../../Services/Network';
import DropDownPicker from 'react-native-dropdown-picker';

const {width, height} = Dimensions.get('window');

const PayPalPayment = props => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cardNumberRef = useRef();
  const expMonthRef = useRef();
  const expYearRef = useRef();
  const cvvRef = useRef();
  const amountRef = useRef();

  //const dropDownRef = useRef();

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [number, setNumber] = useState('');
  const [expYear, setExpYear] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');

  const [errorMsg, setErrorMsg] = useState({
    isFName: true,
    isLName: true,
    isNumber: true,
    isExpYear: true,
    isExpMonth: true,
    isCvv: true,
    isAmount: true,
    isCurrency: true,
  });

  const [shownFName, setShownFName] = useState(false);
  const [shownLName, setShownLName] = useState(false);
  const [shownNumber, setShownNumber] = useState(false);
  const [shownExpYear, setShownExpYear] = useState(false);
  const [shownExpMonth, setShownExpMonth] = useState(false);
  const [shownCvv, setShownCvv] = useState(false);
  const [shownAmount, setShownAmount] = useState(false);
  const [shownCurrency, setShownCurrency] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'USD', value: 'USD'},
    {label: 'Euro', value: 'Euro'},
    {label: 'Dinari', value: 'Dinari'},
  ]);

  const fNameHandler = value => {
    setFName(value);
    setShownFName(true);
    setErrorMsg({...errorMsg, isFName: true});
    // console.log(name);
  };

  const lNameHandler = value => {
    setLName(value);
    setShownLName(true);
    setErrorMsg({...errorMsg, isLName: true});
    // console.log(name);
  };

  const numberHandler = value => {
    setNumber(value);
    setShownNumber(true);
    setErrorMsg({...errorMsg, isNumber: true});
    // console.log(name);
  };
  const expMonthHandler = value => {
    setExpMonth(value);
    setShownExpMonth(true);
    // console.log(name);
  };
  const expYearHandler = value => {
    setExpYear(value);
    setShownExpYear(true);
    // console.log(name);
  };

  const cvvHandler = value => {
    setCvv(value);
    setShownCvv(true);
    setErrorMsg({...errorMsg, isCvv: true});
    // console.log(name);
  };

  const amountHandler = value => {
    setAmount(value);
    setShownAmount(true);
    // console.log(name);
  };
  const currencyHandler = value => {
    setCurrency(value);
    setShownCurrency(true);
    console.log('currency==>', currency);
  };

  const payoutFunc = async () => {
    if (fName.trim() == '') {
      return setErrorMsg({...errorMsg, isFName: false});
    } else if (lName.trim() == '') {
      return setErrorMsg({...errorMsg, isLName: false});
    } else if (number.trim() == '') {
      return setErrorMsg({...errorMsg, isNumber: false});
    } else if (expMonth.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter valid expire month of the card',
      });
      return setErrorMsg({...errorMsg, isExpMonth: false});
    } else if (expYear.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter valid expire year of the card',
      });
      return setErrorMsg({...errorMsg, isExpYear: false});
    } else if (cvv.trim() == '') {
      return setErrorMsg({...errorMsg, isCvv: false});
    } else if (amount.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter amount to be paid',
      });
      return setErrorMsg({...errorMsg, isAmount: false});
    } else if (currency.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter amount Currency',
      });
      return setErrorMsg({...errorMsg, isCurrency: false});
    } else {
      const customerData = {
        firstName: fName,
        lastName: lName,
        number: number,
        expiryMonth: expMonth,
        expiryYear: expYear.length === 2 ? '20' + expYear : expYear,
        cvv: cvv,
        amount: amount,
        //currency: currency,
      };

      Hud.showHud();
      console.log('customerData==>', customerData);
      await postApiCall('addpaypalwallet', customerData, {})
        .then(async response => {
          console.log('addpaypalwallet response===>', response.data);
          Hud.hideHud();
          if (response.status == 200) {
            console.log('addpaypalwallet ====>', response.data);
            props.navigation.replace('PaymentSuccess', {
              type: 'PayPal',
              amount: currency + ' ' + amount,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error while using Paypal Payment',
            });
          }
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            Hud.hideHud();
            console.log('error in response==>', error.response.data);

            Toast.show({
              type: 'error',
              text1: error.response.data.message,
            });
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error in request===>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('other error ===>', error.message);
          }
        });
    }
  };
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.87,
          marginTop: height * 0.02,
          alignItems: 'center',
          alignSelf: 'center',
          //backgroundColor: 'red',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            source={require('../../Assets/Icon/back.png')}
            style={{
              height: 18,
              width: 10,
              tintColor: 'black',
              marginLeft: 10,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: '#151143',
            fontWeight: '500',
            fontSize: RFValue(20),
            //fontFamily: 'Roboto-Medium',
          }}>
          Paypal
        </Text>

        <View
          style={{
            height: height * 0.05,
            width: width * 0.06,
            //marginHorizontal: '5%',
          }}
        />
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
            marginBottom: height * 0.05,
            alignSelf: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={shownFName ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={firstNameRef}
                onChangeText={value => fNameHandler(value)}
                placeholder="First Name"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  lastNameRef.current.focus();
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
                  shownFName
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isFName && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter Your First Name
            </Text>
          )}

          <View style={shownLName ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={lastNameRef}
                onChangeText={value => lNameHandler(value)}
                placeholder="Last Name"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  cardNumberRef.current.focus();
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
                  shownLName
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isLName && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter Your Last Name
            </Text>
          )}

          <View style={shownNumber ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={cardNumberRef}
                onChangeText={value => numberHandler(value)}
                placeholder="Card Number"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={16}
                returnKeyType="next"
                onSubmitEditing={() => {
                  expMonthRef.current.focus();
                }}
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
                source={require('../../Assets/Icon/cardImg.png')}
                style={
                  shownNumber
                    ? {...styles.imagesty, tintColor: 'black'}
                    : styles.imagesty
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isNumber && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter valid Card number
            </Text>
          )}

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              //backgroundColor: 'red',
              //height: 50,
              marginTop: height * 0.025,
            }}>
            <View
              style={
                shownExpMonth ? styles.minDivisionSelect : styles.minDivision
              }>
              <TextInput
                ref={expMonthRef}
                onChangeText={value => expMonthHandler(value)}
                placeholder="Exp Month"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={2}
                returnKeyType="next"
                onSubmitEditing={() => {
                  expYearRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            <View
              style={
                shownExpYear ? styles.minDivisionSelect : styles.minDivision
              }>
              <TextInput
                ref={expYearRef}
                onChangeText={value => expYearHandler(value)}
                placeholder="Exp Year"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                maxLength={2}
                returnKeyType="next"
                onSubmitEditing={() => {
                  cvvRef.current.focus();
                }}
                style={styles.input}
              />
            </View>
          </View>

          <View style={shownCvv ? styles.divisionSelect : styles.division}>
            <View style={styles.input}>
              <TextInput
                ref={cvvRef}
                onChangeText={value => cvvHandler(value)}
                placeholder="CVV"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                //maxLength={3}
                returnKeyType="next"
                onSubmitEditing={() => {
                  amountRef.current.focus();
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
                source={require('../../Assets/Icon/cardImg.png')}
                style={
                  shownCvv
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </View>
          {!errorMsg.isCvv && (
            <Text
              style={{
                color: 'red',
                fontSize: RFValue(15),
                textAlign: 'center',
                width: '100%',
              }}>
              Please enter Your CVV number
            </Text>
          )}

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              //backgroundColor: 'red',
              //height: 50,
              marginTop: height * 0.025,
            }}>
            <View
              style={
                shownAmount ? styles.minDivisionSelect : styles.minDivision
              }>
              <TextInput
                ref={amountRef}
                onChangeText={value => amountHandler(value)}
                placeholder="Amount"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="next"
                //   onSubmitEditing={() => {
                //     expYearRef.current.focus();
                //   }}
                style={styles.input}
              />
            </View>

            <View style={{alignSelf: 'center', justifyContent: 'center'}}>
              <DropDownPicker
                placeholder="Currency"
                placeholderStyle={{color: '#8E7B85'}}
                disableBorderRadius={true}
                showTickIcon={false}
                // controller={instance => (dropDownRef.current = instance)}
                open={open}
                value={currency}
                items={items}
                setOpen={setOpen}
                setValue={value => {
                  currencyHandler(value);
                }}
                setItems={setItems}
                style={
                  shownCurrency ? styles.minDivisionSelect : styles.minDivision
                }
                zIndexInverse={2000}
                listMode="SCROLLVIEW"
                dropDownContainerStyle={{
                  //backgroundColor: 'red',
                  width: '100%',
                  //borderRadius: 20,
                }}
                textStyle={{
                  color: '#000',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  textAlign: 'center',
                  //paddingHorizontal: width / 40,
                  fontSize: RFValue(15),
                }}
              />
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
              onPress={() => payoutFunc()}>
              <Text
                style={{
                  fontSize: 19,
                  color: '#FFFFFF',
                  //fontFamily: 'Roboto-Bold',
                }}>
                Payout
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
    </SafeAreaView>
  );
};

export default PayPalPayment;

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

  minDivision: {
    width: width * 0.35,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
  },

  minDivisionSelect: {
    width: width * 0.35,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,

    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  imagesty: {width: '100%', height: '100%'},
});
