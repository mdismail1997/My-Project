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
import React, {useState, useEffect, useRef, useContext} from 'react';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Hud from '../Common/Hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {postApiCall} from '../../Services/Network';
import Toast from 'react-native-toast-message';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import {base_url} from '../../Services/constants';
import {WebView} from 'react-native-webview';
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const PayPalPayment2 = props => {
  const [amount, setAmount] = useState('');
  const {profileContextData} = useContext(ProfileContext);

  const [shownAmount, setShownAmount] = useState(false);
  const [showWebView, setshowWebView] = useState(false);

  const webViewRef = useRef(null);

  console.log('=====profileContextData=====>', profileContextData.id);

  const paypalUrl =
    base_url +
    `addwalletmoneypaypal?userId=${profileContextData.id}&amount=${amount}`;

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
    if (amount.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter amount to be paid',
      });
    } else {
      console.log('card Details===>', amount);
      setshowWebView(true);
      // paymentFunc();
      //Linking.openURL(paypalUrl);
    }
  };

  const onNavigationStateChange = webViewState => {
    // const {PayerID, paymentId} = webViewState.url;
    console.log('==webViewState===>', webViewState);
    if (webViewState.title.includes('paypalsuccess')) {
      props.navigation.replace('PaymentSuccess', {
        type: 'Paypal',
        amount: 'USD ' + amount,
      });
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
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: height,
          width: width,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        }}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

        {showWebView ? (
          <>
            <WebView
              ref={webViewRef}
              style={{height: height, width: width}}
              source={{uri: paypalUrl}}
              onNavigationStateChange={onNavigationStateChange}
              javaScriptEnabled={true}
              startInLoadingState={true}
              renderLoading={Loader}
              //   javaScriptEnabled={true}
              //   domStorageEnabled={true}
              //   startInLoadingState={false}
              // style={{ marginTop: 20 }}
            />
          </>
        ) : (
          <>
            <HeaderwithTitle navProps={props.navigation} title={'Paypal'} />
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

                <View
                  style={shownAmount ? styles.divisionSelect : styles.division}>
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
                    <Text style={{fontSize: 19, color: '#FFFFFF'}}>
                      Proceed
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PayPalPayment2;

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
