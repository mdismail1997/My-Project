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
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Hud from '../Common/Hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {postApiCall} from '../../Services/Network';
import Toast from 'react-native-toast-message';
import HeaderwithTitle from '../Common/HeaderwithTitle';
//import Stripe from 'react-native-stripe-api';
import {stripeApiKey} from '../../Services/constants';
import stripe from 'tipsi-stripe';
import {WebView} from 'react-native-webview';
const {width, height} = Dimensions.get('window');

const AddMoney = props => {
  useEffect(() => {
    setAmount('');
    setShownAmount(false);

    // handleProfile();

    const unsubscribe = props.navigation.addListener('focus', async () => {
      // handleProfile();
      setAmount('');
      setShownAmount(false);
    });
    return unsubscribe;
  }, [props.route.params.cardData]);
  const cardData = props.route.params.cardData;
  const [amount, setAmount] = useState('');

  const [shownAmount, setShownAmount] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const webViewRef = useRef(null);

  // console.log('==props.route.params.cardData===>', props.route.params.cardData);

  const amountHandler = value => {
    setAmount(value);
    if (value.trim() == '') {
      setShownAmount(false);
    } else {
      setShownAmount(true);
    }

    //console.log(amount);
  };

  const handleProceed = async () => {
    console.log('Handle Proceed Function');

    if (amount.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter amount to be paid',
      });
    } else {
      console.log('card Details===>', cardData, amount);
      paymentFunc();
    }
  };

  // const StripePayment = async () => {
  //   Hud.showHud();
  //   //Hud.hideHud();
  //   const client = new Stripe(stripeApiKey);
  //   console.log('card_no===>', cardData.card_no);

  //   const token = await client.createToken({
  //     number: cardData.card_no,
  //     exp_month: cardData.exp_month,
  //     exp_year: cardData.exp_year,
  //     cvc: cardData.cvv,
  //   });
  //   console.log('token--->', token.id);
  //   const customerData = {
  //     card_id: cardData.id,
  //     name: cardData.name,
  //     email: cardData.email,
  //     card_no: cardData.card_no,
  //     exp_month: cardData.exp_month,
  //     exp_year: cardData.exp_year,
  //     cvv: cardData.cvv,
  //     token: '',
  //     line1: cardData.address_line1,
  //     line2: cardData.address_line2,
  //     city: cardData.city,
  //     state: cardData.state,
  //     postal_code: cardData.postal_code,
  //     country: cardData.country,
  //     amount: amount,
  //     currency: cardData.currency,
  //   };
  //   await postApiCall('addwallet', customerData, {})
  //     .then(async response => {
  //       console.log('addwallet response===>', response.data);
  //       Hud.hideHud();
  //       if (response.status == 200) {
  //         // const canOpen = await Linking.canOpenURL(response.data.auth_url);
  //         // if (canOpen) {
  //         //   Linking.openURL(response.data.auth_url)
  //         //     .then(res => {
  //         //       console.log('url response==>', res);

  //         //       successPage('Stripe');
  //         //     })
  //         //     .catch(err => {
  //         //       console.error("Couldn't load page", err);
  //         //       Toast.show({
  //         //         type: 'error',
  //         //         text1: "Couldn't load page",
  //         //       });
  //         //     });
  //         // }

  //         props.navigation.jumpTo('PaymentSuccess1', {
  //           type: cardData.payment_method,
  //           amount: 'currency' + ' ' + amount,
  //         });
  //       } else {
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error while using Stripe Payment',
  //         });
  //       }
  //     })
  //     .catch(function (error) {
  //       if (error.response) {
  //         // Request made and server responded
  //         Hud.hideHud();
  //         console.log('error==>', error.response.data);

  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error while adding Money.',
  //         });
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         console.log('error request===>', error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.log(error.message);
  //       }
  //     });
  // };

  const successPage = async cardType => {
    setTimeout(() => {
      props.navigation.jumpTo('PaymentSuccess1', {
        type: 'Stripe',
        amount: cardData.currency + ' ' + amount,
      });
    }, 2000);
  };

  const paymentFunc = async () => {
    Hud.showHud();
    const customerData = {
      card_id: cardData.stripe_card_id,
      name: cardData.name,
      email: cardData.email,
      token: '',
      line1: cardData.address_line1,
      line2: cardData.address_line2,
      city: cardData.city,
      state: cardData.state,
      postal_code: cardData.postal_code,
      //country: cardData.country,
      amount: amount,
      //currency: cardData.currency,
    };

    console.log('===customerData===>', customerData);
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
            props.navigation.jumpTo('PaymentSuccess1', {
              type: 'Stripe',
              amount: amount,
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

          Toast.show({
            type: 'error',
            text1: 'Error while adding Money.',
            text2: error.response.data.message,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request===>', error.request);
          console.log('Error request status==>', error.request.status);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error in setting==>', error.message);
        }
      });
  };
  const onNavigationStateChange = webViewState => {
    // const {PayerID, paymentId} = webViewState.url;
    console.log('==PayerID===>', webViewState);
    if (
      webViewState.title ==
      'https://hooks.stripe.com/3d_secure/complete/tdsrc_complete'
    ) {
      //successPage();
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
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <HeaderwithTitle navProps={props.navigation} title={'Add Money'} />

      {showWebView ? (
        <>
          <WebView
            ref={webViewRef}
            style={{height: height * 0.9, width: width}}
            source={{uri: webUrl}}
            onNavigationStateChange={onNavigationStateChange}
            javaScriptEnabled={true}
            startInLoadingState={true}
            renderLoading={Loader}
            onLoadEnd={() => {
              props.navigation.jumpTo('PaymentSuccess1', {
                type: 'Stripe',
                amount: cardData.currency + ' ' + amount,
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
          style={{backgroundColor: '#ffffff', width: width * 0.9}}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              marginBottom: height * 0.01,
            }}>
            <View
              style={{
                height: height * 0.3,
                width: width * 0.45,
                alignSelf: 'center',
                marginTop: height * 0.05,
              }}>
              <Image
                source={require('../../Assets/Icon/walleticon.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>

            <View style={shownAmount ? styles.divisionSelect : styles.division}>
              <View style={styles.input}>
                <TextInput
                  value={amount}
                  onChangeText={value => amountHandler(value)}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            <View
              style={{
                width: width * 0.8,
                height: 50,
                marginTop: height * 0.05,
              }}>
              <TouchableOpacity
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#E92D87',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => handleProceed()}>
                <Text style={{fontSize: 19, color: '#FFFFFF'}}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </SafeAreaView>
  );
};

export default AddMoney;

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
    width: width * 0.8,
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
    color: '#151143',
  },

  imagesty: {width: '100%', height: '100%'},
});
