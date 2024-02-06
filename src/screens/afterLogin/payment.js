/* eslint-disable prettier/prettier */
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
  ActivityIndicator,
  Platform,
  Switch,
  Alert,
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
} from '../../utils/comon';

import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hud from '../../utils/hud';
import axios from 'axios';
import commonToast from '../../utils/commonToast';
import {
  StripeProvider,
  CardForm,
  useStripe,
  initStripe,
  BillingDetails,
  CardField,
  useConfirmPayment,
  createPaymentMethod,
  PaymentSheetError,
} from '@stripe/stripe-react-native';
import {BASE_URL} from '../../utils/Api/apiName';
import {Button, HStack} from 'native-base';

// interface Props {
//   paymentMethod?: string;
//   onInit?(): void;
// }
const appearance = {
  font: {
    scale: 1.1,
  },
  colors: {
    light: {
      primary: '#F8F8F2',
      background: '#272822',
      componentBackground: '#E6DB74',
      componentBorder: '#FD971F',
      componentDivider: '#FD971F',
      primaryText: '#F8F8F2',
      secondaryText: '#75715E',
      componentText: '#AE81FF',
      placeholderText: '#E69F66',
      icon: '#F92672',
      error: '#F92672',
    },
    dark: {
      primary: '#272822',
      background: '#F8F8F2',
      componentBackground: '#E6DB74',
      componentBorder: '#FD971F',
      componentDivider: '#FD971F',
      primaryText: '#272822',
      secondaryText: '#75715E',
      componentText: '#AE81FF',
      placeholderText: '#E69F66',
      icon: '#F92672',
      error: '#F92672',
    },
  },
  shapes: {
    borderRadius: 10,
    borderWidth: 1,
    shadow: {
      opacity: 1,
      color: '#ffffff',
      offset: {x: -5, y: -5},
      blurRadius: 1,
    },
  },
  primaryButton: {
    colors: {
      background: '#000000',
      text: '#ffffff',
      border: '#ff00ff',
    },
    shapes: {
      borderRadius: 10,
      borderWidth: 2,
      shadow: {
        opacity: 1,
        color: '#80ffffff',
        offset: {x: 5, y: 5},
        blurRadius: 1,
      },
    },
  },
};

export default function Payment({onInit, navigation}) {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  //const {confirmPayment, loading} = useConfirmPayment();

  const [name, setName] = useState('');
  const [focusName, setFocusName] = useState(false);
  const [cardDetails, setCardDetails] = useState();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [setupIntenetId, setSetupIntentId] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      const publishableKey =
         //'pk_live_51JrLUyIbBYxsmF2R2ivegheBziXV9FjkWfTGCOgamqU0fUdFYBzVL0DPPUw8Uogr2xdO0id2HUA5ctzYMFZjrAFL00Eufay4is';
        'pk_test_51JrLUyIbBYxsmF2RT1ioZpqoTqm9keiDTErHSIUoGD1P3R0oylqSpvAd4B1SxObCLHY3QuVh70QuEOwTGx5nXpq200AvuEYfH5';
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.identifier',
        });
        setLoading(true);
        initializePaymentSheet();
      }
    }
    initialize();
  }, []);

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  // const getProfile = async () => {
  //   const token = JSON.parse(await AsyncStorage.getItem('userToken'));
  //   const letToken = token.data.data.token;
  //   console.log('{token}', token.data.data.token);
  //   Hud.showHud();
  //   axios({
  //     method: 'get',
  //     url: 'https://kabou.us/api/rider/card-details',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       authorization: 'Bearer ' + letToken,
  //     },
  //   })
  //     .then(response => {
  //       console.log(response.data);
  //       Hud.hideHud();
  //       //setcardNumber(response.data.data.card_number);
  //     })
  //     .catch(err => {
  //       console.log('err', err);
  //       Hud.hideHud();
  //       Alert.alert(err);
  //     });
  // };
  // const cardenter = async () => {
  //   const {paymentMethod, error} = await createPaymentMethod({
  //     paymentMethodType: 'Card',
  //     paymentMethodData: {
  //       billingDetails: {
  //         name: name,
  //       },
  //     },
  //   });

  //   const token = JSON.parse(await AsyncStorage.getItem('userToken'));
  //   console.log('{token}', token.data.data.token);
  //   if (name === '') {
  //     commonToast({
  //       type: 'error',
  //       text: 'Please input Name',
  //       position: 'top',
  //     });
  //     return;
  //   }
  //   console.log('cardDetails api', cardDetails);
  //   const bankdata = {
  //     account_holder_name: name,
  //     card_number: cardDetails.number,
  //     exp_month: cardDetails.expiryMonth,
  //     exp_year: cardDetails.expiryYear,
  //   };
  //   console.log('bankdate===========>>>>>>', bankdata);

  //   //Hud.showHud();
  //   const api = `${BASE_URL}add-card-in-stripe`;
  //   await axios({
  //     url: api,
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${token.data.data.token}`,
  //     },
  //     data: bankdata,
  //   })
  //     .then(function (response) {
  //       Hud.hideHud();
  //       console.log('response =====>', response);
  //       commonToast({
  //         type: 'success',
  //         text: response.data.message,
  //         position: 'top',
  //       });
  //       if (error) {
  //         // Handle error
  //       } else if (paymentMethod) {
  //         const paymentMethodId = paymentMethod.id;
  //         console.log('payementMethodId', paymentMethodId);
  //         // Send the ID of the PaymentMethod to your server for the next step
  //         // ...
  //       }
  //       openPaymentSheet();
  //       //navigation.navigate('bookingStep2');
  //     })
  //     .catch(function (error) {
  //       console.log('error =====>', error);
  //       Hud.hideHud();
  //       commonToast({
  //         type: 'error',
  //         text: error.response.data.message,
  //         position: 'top',
  //       });
  //     });
  // };

  const fetchPaymentSheetParams = async () => {
    console.warn("======Payment=============")
    try {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      const letToken = token.data.data.token;
      console.log('{token}', token.data.data.token);
      const response = await fetch(
        'https://kabou.us/api/rider/add-card-in-stripe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + letToken,
          },
        },
      );
      console.log('response stripe', response);
      const {setupIntent, ephemeralKey, customer, setupIntent_id} =
        await response.json();
      console.log(
        'paymentIntent, ephemeralKey, customer',
        setupIntent,
        ephemeralKey,
        customer,
        setupIntent_id,
      );
      setClientSecret(setupIntent);
      setSetupIntentId(setupIntent_id);
      return {
        setupIntent,
        ephemeralKey,
        customer,
        setupIntent_id,
      };
    } catch (error) {
      console.log('==========error=========', error);
    }
  };

  const initializePaymentSheet = async () => {
    const {setupIntent, ephemeralKey, customer, setupIntent_id} =
      await fetchPaymentSheetParams();
    console.log('setupIntent', setupIntent);

    const billingDetails = {
      name: 'Jane Doe',
      email: 'foo@bar.com',
      phone: '555-555-555',
      // address: address,
    };

    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      customFlow: false,
      merchantDisplayName: 'Example Inc.',
      applePay: true,
      merchantCountryCode: 'US',
      style: 'automatic',
      googlePay: true,
      testEnv: true,
      defaultBillingDetails: billingDetails,
      allowsDelayedPaymentMethods: true,
      appearance,
    });
    if (!error) {
      console.log('paymentOption', paymentOption);
      setLoading(false);
      setPaymentSheetEnabled(true);
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(
        `PaymentSheet init failed with error code: ${error.code}`,
        error.message,
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      Alert.alert(
        `PaymentSheet init was canceled with code: ${error.code}`,
        error.message,
      );
    }
  };
  const duplicateCard = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const letToken = token.data.data.token;
    console.log('{token}', JSON.stringify(setupIntenetId));
    const data = {
      setupIntentId: setupIntenetId,
      // stripE : setupIntenetId
    };

    await axios({
      method: 'POST',
      url: 'https://kabou.us/api/rider/remove-duplicate-card',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + letToken,
      },
      data: {
        setupIntentId: setupIntenetId,
        // stripE : setupIntenetId
      },
    })
      .then(res => {
        console.log('&&&&&&&&&&&&&', res);
      })
      .catch(err => console.log('err==================', err.response));
    //  await fetch(
    //     'https://kabou.us/api/rider/remove-duplicate-card',
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         authorization: 'Bearer ' + letToken,
    //       },
    //       body: data
    //     },

    //   ).then(res=> {
    //           console.log("&&&&&&&&&&&&&", res)

    //         })
    //         .catch(err=> console.log("err==================", err.response))
  };

  const openPaymentSheet = async value => {
    console.log('payment Value=======',value);
    if (!clientSecret) {
      return;
    }
    console.log('============clientSecret=======',clientSecret);
    const {error, paymentOption} = await presentPaymentSheet();
    console.log('=====================================', error, paymentOption);

    if (!error) {
      // Alert.alert('Success', 'The payment was confirmed successfully');
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      const letToken = token.data.data.token;
      console.log('{token}', token.data.data.token);
      await fetch('https://kabou.us/api/rider/remove-add-card-in-stripe-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + letToken,
        },
      });
      AsyncStorage.setItem('KabouRiderCardSaveStatus', value);
      console.log('*****************', setupIntenetId);

      Alert.alert('Success', 'The payment method added successfully', [
        {
          text: 'OK',
          onPress: () => {
            duplicateCard(), navigation.navigate('bookingStep2');
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            duplicateCard(), initializePaymentSheet();
          },
          // style: 'cancel',
        },
      ]);
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(error.code, error.message);
    } else if (error.code === PaymentSheetError.Canceled) {
      Alert.alert(error.code, error.message);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   initializePaymentSheet();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <SafeAreaView style={{flex: 1, padding: 10}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowIcon}
            source={require('../../../assets/images/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.instruction}>Add card</Text>
      </View>
      <View style={{backgroundColor: colors.background, alignItems: 'center'}}>
        <Button
          width={calcW(0.9)}
          variant="solid"
          isLoading={loading}
          disabled={!paymentSheetEnabled}
          onPress={() =>
            Alert.alert('', 'Do you want to save your card for future use?', [
              {text: 'Yes', onPress: () => openPaymentSheet('false')},
              {
                text: 'No',
                onPress: () => openPaymentSheet('true'),
                style: 'cancel',
              },
            ])
          }>
          Checkout
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardField: {
    width: '100%',
    ...Platform.select({
      ios: {
        height: 250,
      },
      android: {
        height: 260,
      },
    }),
    marginTop: calcH(0.01),
  },
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
  headerContainer: {
    // width: calcW(0.9),
    // height: calcH(0.05),
    flex: 0.08,
    flexDirection: 'row',
    // marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
    padding: 12,
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: colors.textHeader,
  },
  inActiveBorder: {
    width: calcW(0.9),
    borderColor: '#DCDCDC',
    borderWidth: 1,
    //borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: calcW(0.9),
    borderColor: '#DCDCDC',
    borderWidth: 1,
    //borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: RFValue(28),
    color: colors.headerText,
    fontWeight: 'bold',
    // marginVertical: ,
  },
  subText: {
    fontSize: RFValue(19),
    color: colors.subHeader,
    marginVertical: calcH(0.03),
    textAlign: 'center',
    // marginVertical: calcH(0.035)
  },
  textInput: {
    fontSize: RFValue(18),
    flex: 1,
    paddingLeft: calcW(0.03),
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: calcH(0.05),
  },
  buttonTextStyle: {
    fontSize: RFValue(20),
    color: colors.white,
    // marginVertical: 10,
    textAlign: 'center',
  },
  twoContainer: {
    width: calcW(0.9),
    flexDirection: 'row',
  },
  expiryContainer: {
    width: calcW(0.63),
  },
  cvvContainer: {
    left: calcW(0.03),
    width: calcW(0.24),
  },
});

const inputStyles = {
  backgroundColor: colors.background,
  textColor: '#A020F0',
  borderColor: '#000000',
  borderWidth: 0,
  borderRadius: 10,
  cursorColor: colors.activeBorder,
  fontSize: RFValue(18),
  placeholderColor: '#A020F0',
  textErrorColor: '#ff0000',
};
