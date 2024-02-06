import React, {useState, useRef} from 'react';
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
  Linking,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {RFValue} from 'react-native-responsive-fontsize';

import {stripeApiKey} from '../../Services/constants';
import {postApiCall} from '../../Services/Network';

import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
//import Stripe from 'react-native-stripe-api';
import CountryPicker from 'react-native-country-picker-modal';
import stripe from 'tipsi-stripe';
import {WebView} from 'react-native-webview';

const {width, height} = Dimensions.get('window');

const StripePayment = props => {
  const firstNameRef = useRef();
  const emailRef = useRef();
  const address1Ref = useRef();
  const address2Ref = useRef();
  const postalCodeRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();

  const cardNumberRef = useRef();

  const amountRef = useRef();
  const currencyRef = useRef();

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');

  const [countryCode, setCountryCode] = useState(null);
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);

  const [errorMsg, setErrorMsg] = useState({
    isFName: true,
    isLName: true,
    isEmail: true,
    isNumber: true,
    isExpYear: true,
    isExpMonth: true,
    isCvv: true,
    isAddress: true,
    isAddress2: true,
    isPostalCode: true,
    isCity: true,
    isState: true,
    isCountry: true,
    isAmount: true,
    isCurrency: true,
  });

  const [shownFName, setShownFName] = useState(false);
  const [shownEmail, setShownEmail] = useState(false);
  const [shownAddress1, setShownAddress1] = useState(false);
  const [shownAddress2, setShownAddress2] = useState(false);
  const [shownPostalCode, setShownPostalCode] = useState(false);
  const [shownCity, setShownCity] = useState(false);
  const [shownState, setShownState] = useState('');
  const [shownCountry, setShownCountry] = useState('');
  const [shownAmount, setShownAmount] = useState(false);

  const [showWebView, setShowWebView] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const webViewRef = useRef(null);

  stripe.setOptions({
    publishableKey: stripeApiKey,
  });

  const fNameHandler = value => {
    setFName(value);
    setShownFName(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isFName: true});
    }
    // console.log(name);
  };

  const emailHandler = value => {
    setEmail(value);
    setShownEmail(true);
    // console.log(name);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isEmail: true});
    }
  };
  const address1Handler = value => {
    setAddress1(value);
    setShownAddress1(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isAddress: true});
    }
  };

  const address2Handler = value => {
    setAddress2(value);
    setShownAddress2(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isAddress2: true});
    }
  };

  const cityHandler = value => {
    setCity(value);
    setShownCity(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isCity: true});
    }
  };

  const stateHandler = value => {
    setState(value);
    setShownState(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isState: true});
    }
  };

  const postalCodeHandler = value => {
    setPostalCode(value);
    setShownPostalCode(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isPostalCode: true});
    }
  };

  const amountHandler = value => {
    setAmount(value);
    setShownAmount(true);
    // console.log(name);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isAmount: true});
    }
  };

  const onSelect = country => {
    console.log('country===>', country.currency[0]);
    setShownCountry(true);
    setCountryCode(country.cca2);
    setCountry(country.name);
    setWithCountryNameButton(true);
    setCurrency(country.currency[0]);
    console.log('Country Details===>', country);
  };
  const payoutFunc = async () => {
    if (fName.trim() == '') {
      return setErrorMsg({...errorMsg, isFName: false});
    } else if (email.trim() == '') {
      return setErrorMsg({...errorMsg, isEmail: false});
    } else if (address1.trim() == '') {
      return setErrorMsg({...errorMsg, isAddress: false});
    } else if (postalCode.trim() == '') {
      return setErrorMsg({...errorMsg, isPostalCode: false});
    } else if (city.trim() == '') {
      return setErrorMsg({...errorMsg, isCity: false});
    } else if (state.trim() == '') {
      return setErrorMsg({...errorMsg, isState: false});
    } else if (amount.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter amount to be paid',
      });
      return setErrorMsg({...errorMsg, isAmount: false});
    } else {
      stripePaymentFunc();
    }
  };

  const stripePaymentFunc = async () => {
    try {
      const token = await stripe.paymentRequestWithCardForm();
      console.log('Token from Card ', token);
      const customerData = {
        card_id: '',
        name: fName,
        email: email,
        token: token.tokenId,
        line1: address1,
        line2: address2,
        city: city,
        state: state,
        postal_code: postalCode,
        //country: country,
        amount: amount,
        //currency: currency,
      };

      console.log('=======>', customerData);
      Hud.showHud();
      await postApiCall('addwalletmoney', customerData, {})
        .then(async response => {
          console.log('addwalletmoney response===>', response.data);
          Hud.hideHud();
          if (response.data.success == true) {
            if (
              response.data.auth_url != null &&
              response.data.auth_url != undefined &&
              response.data.auth_url != ''
            ) {
              setWebUrl(response.data.auth_url);
              setShowWebView(true);
            } else {
              props.navigation.replace('PaymentSuccess', {
                type: 'Stripe',
                amount: currency + ' ' + amount,
              });
            }
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error while using Stripe Payment',
            });
          }
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            Hud.hideHud();
            console.log('error in response==>', error.response.data);
            console.log('error in response==>', error.response.status);

            if (
              error.response.data.message.includes(
                'The resource ID cannot be null or whitespace.',
              )
            ) {
              Toast.show({
                type: 'info',
                text1: 'Payment Unsuccessful',
                text2: 'Card is already added.Please pay from the list',
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error while adding Money.',
                text2: error.response.data.message,
              });
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error request===>', error.request);
            console.log('Error request status==>', error.request.status);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('error in setting==>', error.message);
          }
        });
    } catch (error) {
      Hud.hideHud();
      console.log('handleCardPayPress Error', error);
    }
  };

  const Loader = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 999,
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator size="large" color="#E92D87" />
      </View>
    );
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
          Stripe
        </Text>

        <View
          style={{
            height: height * 0.05,
            width: width * 0.06,
            //marginHorizontal: '5%',
          }}
        />
      </View>
      {showWebView ? (
        <>
          <WebView
            ref={webViewRef}
            style={{height: height * 0.9, width: width}}
            source={{uri: webUrl}}
            //onNavigationStateChange={onNavigationStateChange}
            javaScriptEnabled={true}
            startInLoadingState={true}
            renderLoading={Loader}
            onLoadEnd={() => {
              props.navigation.replace('PaymentSuccess', {
                type: 'Stripe',
                amount: currency + ' ' + amount,
              });
            }}
            //   domStorageEnabled={true}
            //   startInLoadingState={false}
            // style={{ marginTop: 20 }}
          />
        </>
      ) : (
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
            }}>
            <View style={shownFName ? styles.divisionSelect : styles.division}>
              <View style={styles.input}>
                <TextInput
                  ref={firstNameRef}
                  onChangeText={value => fNameHandler(value)}
                  placeholder="Name"
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
                Please enter Your Name
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
                  source={require('../../Assets/Icon/reg_message.png')}
                  style={
                    shownEmail
                      ? {...styles.imagesty, tintColor: 'black'}
                      : {...styles.imagesty, tintColor: '#B19DA7'}
                  }
                  resizeMode="contain"
                />
              </View>
            </View>
            {!errorMsg.isEmail && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(15),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Email
              </Text>
            )}

            <View
              style={shownAddress1 ? styles.divisionSelect : styles.division}>
              <TextInput
                ref={address1Ref}
                onChangeText={value => address1Handler(value)}
                placeholder="Address1"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                //multiline={true}
                returnKeyType="next"
                onSubmitEditing={() => {
                  address2Ref.current.focus();
                }}
                style={styles.input}
              />
            </View>
            {!errorMsg.isAddress && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(15),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Address
              </Text>
            )}

            <View
              style={shownAddress2 ? styles.divisionSelect : styles.division}>
              <TextInput
                ref={address2Ref}
                onChangeText={value => address2Handler(value)}
                placeholder="Address2"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                //multiline={true}
                returnKeyType="next"
                onSubmitEditing={() => {
                  postalCodeRef.current.focus();
                }}
                style={styles.input}
              />
            </View>

            {!errorMsg.isAddress2 && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(15),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Address
              </Text>
            )}

            <View
              style={shownPostalCode ? styles.divisionSelect : styles.division}>
              <TextInput
                ref={postalCodeRef}
                onChangeText={value => postalCodeHandler(value)}
                placeholder="Postal Code"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => {
                  cityRef.current.focus();
                }}
                style={styles.input}
              />
            </View>
            {!errorMsg.isPostalCode && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(15),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Postal Code
              </Text>
            )}

            <View style={shownCity ? styles.divisionSelect : styles.division}>
              <TextInput
                ref={cityRef}
                onChangeText={value => cityHandler(value)}
                placeholder="City"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                // multiline={true}
                returnKeyType="next"
                onSubmitEditing={() => {
                  stateRef.current.focus();
                }}
                style={styles.input}
              />
            </View>
            {!errorMsg.isCity && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(15),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your City
              </Text>
            )}

            <View style={shownState ? styles.divisionSelect : styles.division}>
              <TextInput
                ref={stateRef}
                onChangeText={value => stateHandler(value)}
                placeholder="State"
                //style={[styles.textInput]}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
                returnKeyType="next"
                // onSubmitEditing={() => {
                //   countryRef.current.focus();
                // }}
                style={styles.input}
              />
            </View>
            {!errorMsg.isState && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(15),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your State
              </Text>
            )}
            {/* {shownCountry ? (
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
            )} */}

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                //backgroundColor: 'red',
                //height: 50,
                //marginTop: height * 0.025,
              }}>
              <View
                style={shownAmount ? styles.divisionSelect : styles.division}>
                <TextInput
                  ref={amountRef}
                  onChangeText={value => amountHandler(value)}
                  placeholder="Amount"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  keyboardType="numeric"
                  //returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   expYearRef.current.focus();
                  // }}
                  style={styles.input}
                />
              </View>
              {/* <View style={styles.minDivision}>
                <TextInput
                  value={currency}
                  editable={false}
                  placeholder="Currency"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  keyboardType="numeric"
                  //returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   expYearRef.current.focus();
                  // }}
                  style={styles.input}
                />
              </View> */}
            </View>

            <TouchableOpacity
              style={{
                height: 50,
                width: width * 0.8,
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height * 0.03,
              }}
              onPress={() => {
                payoutFunc();
                //stripePaymentFunc();
              }}>
              <Text
                style={{
                  fontSize: 19,
                  color: '#FFFFFF',
                  //fontFamily: 'Roboto-Bold',
                }}>
                Payout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={{
                width: width * 0.8,
                height: 50,
                marginTop: height * 0.03,
                marginBottom: height * 0.05,
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
        </KeyboardAvoidingScrollView>
      )}
    </SafeAreaView>
  );
};

export default StripePayment;

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
