import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Pressable
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Searchbar,
  Card,
  Paragraph,
  Snackbar,
  Modal,
  Portal,
  Provider,
  IconButton,
  DataTable,
} from 'react-native-paper';
import { Header, Header2 } from '../../components/Header/Header';

import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useIntl } from 'react-intl';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import {
  useStripe,
  createToken,
  initStripe,
  CardField,
  CardFieldInput,
} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

export const StripPayment = (props) => {
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [loading, setLoding] = useState(false);
  const [caerdnumber, setCardNumber] = useState('');
  const [expirymonth, setExpiryMounth] = useState('');
  const [expiryyear, setExpiryYear] = useState('');
  const [cvc, setCVC] = useState('');
  const [cardvalue, setCardvalue] = useState(null);
  const [cardvalid, setCardvalid] = useState(false);
  const [brand, setBrand] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  let isActionInProgress = false;
  // stripe.setOptions({

  //   publishableKey: 'pk_test_51MmHexI0cD0FsbEBd7UC6SnB0JyFCuC4P70JxXq8onuvSuuGzpFTGOS8MXQdJQeAYLcTCU1ITVRuqADKRQeieeJ600gvdJmUz8'
  // })

  // useEffect(() => {
  //   console.log(props.route.params.price, props.route.params.booking_id);
  //   getcarddetails();
  // }, [props.route.params.price, props.route.params.booking_id]);


  // const getcarddetails = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');
  //   const userid = await AsyncStorage.getItem('userid');
  //   const user_id = JSON.parse(userid);
  //   const data = {
  //     user_id: user_id,
  //   };
  //   console.log(data);
  //   setLoding(true);
  //   Apis.getdefaultcard(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       setBrand(response.data.response.brand)
  //       setCardNumber(response.data.response.card_no)
  //       setLoding(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setLoding(false);
  //     });
  // };

  // const _onChange = form => {
  //   console.log('card', form)
  //   setCardvalue(form.values)
  //   setCardvalid(form.valid)
  // }



  const getStripeToken = async () => {
    if (!isButtonPressed && !isActionInProgress) {
      setIsButtonPressed(true);
      isActionInProgress = true;
      try {
        initStripe({
          publishableKey: 'pk_test_51MmHexI0cD0FsbEBd7UC6SnB0JyFCuC4P70JxXq8onuvSuuGzpFTGOS8MXQdJQeAYLcTCU1ITVRuqADKRQeieeJ600gvdJmUz8',
        });

        const { token, error } = await createToken({
          type: 'Card',
          address: {
            country: 'US',
            // ...
          },
          name: 'card_name'
        });
        console.log('token', token);
        console.log('id==', token.id);
        console.log('type====', typeof (token), typeof (token.id), token.id.length)

        if (
          typeof token === 'object' &&
          typeof token.id === 'string' &&
          token.id.length
        ) {
          props.route.params.Type != 'New' ?
            await getmsghistory(token.id) : await getAddNew(token.id);
          return;
        }

        //  this.setState({ loading: false });

        Alert.alert('Alert', 'Unable to add card.', [{ text: 'OK', onPress: () => { } }]);
        return;


      }

      catch (e) {
        Alert.alert('Alert', 'Please enter card details', [{ text: 'OK' }]);
      }
      isActionInProgress = false;
      setIsButtonPressed(false);
    }
  }


  const getmsghistory = async (_id) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      stripeToken: _id,
      amount: props.route.params.price,
      booking_id: props.route.params.booking_id,
      card_no: caerdnumber,
      month: expirymonth,
      year: expiryyear,
      brand: brand,
    };
    console.log(data);
    setLoding(true);
    Apis.payment(data)

      .then((response) => {
        console.warn(response.data);
        if (response.data.success === "0") {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        } else {
          setErr((data) => ({
            ...data,
            iserr: true,
            message: response.data.message,
          }));
          setTimeout(() => {
            props.navigation.goBack({ id: response.data.doctor_id });
            // props.navigation.navigate('DoctorProfile', { id: response.data.doctor_id });
          }, 2500);
        }

        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const getAddNew = async (_id) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      stripeToken: _id,
      //amount: props.route.params.price,
      user_id: props.route.params.userid,
      card_no: caerdnumber,
      month: expirymonth,
      year: expiryyear,
      brand: brand,
    };
    console.log(data);
    setLoding(true);
    Apis.cardadd(data)

      .then((response) => {
        console.warn(response.data);
        if (response.data.success === "0") {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        } else {
          setErr((data) => ({
            ...data,
            iserr: true,
            message: response.data.message,
          }));
          setTimeout(() => {
            props.navigation.goBack(null);
            // props.navigation.navigate('DoctorProfile', { id: response.data.doctor_id });
          }, 2500);
        }

        setLoding(false);
      })
      .catch((error) => {
        console.error('err==', error.response.data);
        setLoding(false);
      });
  };
  const onDismissSnack = () => {
    setErr((data) => ({ ...data, iserr: false, message: '' }));
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  // const _onChange = form => {
  //   // console.log('card',form)
  //   setCardvalue(form.values)
  //   setCardvalid(form.valid)
  // }
  // const doCardValidation = async () => {
  //   if (cardvalid == true) {

  //     const params = {
  //       // mandatory
  //       number: cardvalue.number,
  //       expMonth: parseInt(cardvalue.expiry.substring(0, 2)),
  //       expYear: parseInt(cardvalue.expiry.substring(3, 5)),
  //       cvc: cardvalue.cvc,
  //       // optional
  //       name: cardvalue.name
  //     }
  //     console.log('params', params)
  //     try {
  //       const token = await stripe.createTokenWithCard(params);
  //       console.log('token', token);
  //     } catch (error) {
  //       console.log('handleCardPayPress Error ', error)

  //     }
  //   } else {
  //     Alert.alert('Sorry', 'Please provide a valid card')
  //   }
  // }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>

      <Header title="Payment" navProps={props.navigation} />

      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <Snackbar
        visible={err.iserr}
        onDismiss={onDismissSnack}
        style={{ backgroundColor: 'green', zIndex: 100 }}
      >
        {err.message}
      </Snackbar>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnack}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <CreditCardInput
          requiresName
          requiresCVC
          labels={{
            name: 'Card Holder Name',
            number: 'Card Number',
            expiry: 'Expiry Date',
            cvc: 'CVV',
          }}
          placeholders={{
            name: 'Full Name',
            number: '1234 5678 1234 5678',
            expiry: 'MM/YY',
            cvc: 'CVV',
          }}
          invalidColor={'red'}
          onChange={_onChange}
        /> */}
        <Text style={{ color: '#000', marginTop: 13, marginLeft: 20 }}>
          Enter your card details
        </Text>
        <View style={styles.container}>
          <CardField
            postalCodeEnabled={false}
            autofocus
            // eslint-disable-next-line no-const-assign
            cardDetails={
              console.log(brand)

            }

            placeholders={{
              number: 'xxxx xxxx xxxx xxxx',
              postalCode: '12345',
              cvc: 'CVC',
              expiration: 'MM|YY',
            }}
            onCardChange={(cardDetails) => {

              console.log('cardDetails', cardDetails);
              console.log('cardDetails', cardDetails.expiryMonth);
              setExpiryMounth(cardDetails.expiryMonth);
              setExpiryYear(cardDetails.expiryYear);
              setCardNumber(cardDetails.last4);
              setBrand(cardDetails.brand)
            }}
            onFocus={(focusedField) => {
              console.log('focusField', focusedField);
            }}

            cardStyle={{
              // borderWidth: 1,
              backgroundColor: '#d4aca9',
              //  borderColor: 'red',
              //   borderRadius: 8,
              fontSize: 18,
              placeholderColor: '#fffffc',
              textColor: '#fffffc',
              textErrorColor: '#e61c40',

            }}
            style={{
              width: '90%',
              height: 200,
              alignSelf: 'center',
              backgroundColor: 'red',
              marginTop: 20,
            }}
          />
        </View>
        {/* <CardForm
   onFormComplete={(cardDetails) => {
   console.log('card details', cardDetails);
     setCard(cardDetails);
   }}
   style={{height: 200}}
 /> */}
        <Pressable
          disabled={isButtonPressed}
          style={{
            backgroundColor: '#2173A8',
            marginHorizontal: 30,
            height: 50,
            marginTop: 60,
          }}
          onPress={() => {
            getStripeToken()
          }}
        >
          {({ pressed }) => (
            <Text style={{ textAlign: 'center', color: '#fff', marginTop: 13, opacity: pressed ? 0.2 : 1 }}>
              Add Card
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',

    alignSelf: 'center',
    elevation: 5,
    height: 60,
    marginTop: 15,
    borderRadius: 15,
    width: '90%',
    marginBottom: 10,
  },
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 500,
    flexDirection: 'row',
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
