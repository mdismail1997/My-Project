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
  Platform,
  Alert,
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
import IconFontisto from 'react-native-vector-icons/dist/Fontisto';
import IconMaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import IconFontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconIonicons from 'react-native-vector-icons/dist/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import CountryPicker from 'react-native-country-picker-modal';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hud from '../../utils/hud';
import {BASE_URL} from '../../utils/Api/apiName';

const AccountDetails = props => {
  const [countryCode, setCountryCode] = useState(null);
  const [country, setCountry] = useState(null);
  const [withFlag, setWithFlag] = useState(true);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);

  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ssnNumber, setSSNNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('');
  // const [country, setCountry] = useState('');

  const [focusName, setFocusName] = useState(false);
  const [focusAccountNumber, setFocusAccountNumber] = useState(false);
  const [focusSSNNumber, setFocusSSNNumber] = useState(false);
  const [focusRoutingNumber, setFocusRoutingNumber] = useState(false);
  const [focusPhoneNumber, setFocusPhoneNumber] = useState(false);
  const [focusCurrency, setFocusCurrency] = useState(false);
  const [focusCountry, setFocusCountry] = useState(false);
  const [id, setId] = useState('');
  const [uToken, setUToken] = useState(null);
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    getid();
    getAccountDetails();
  }, []);

  const getAccountDetails = async () => {
    try {
      const userId = JSON.parse(await AsyncStorage.getItem('userID'));
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('{token}', token);
      const response = await axios({
        url: `https://kabou.us/api/driver/account_details_data/${userId}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setName(response.data.account_details?.[0].account_holder_name);
      setAccountNumber(response.data.account_details?.[0].account_number);
      setRoutingNumber(response.data.account_details?.[0].routing_number);
      setCountry(response.data.account_details?.[0].country);
      setCurrency(response.data.account_details?.[0].currency);
    } catch (error) {
      console.error(error?.response);
     
    }
  };

  console.log('id=======>', id);
  console.log('token ======>', uToken);

  const onFocusTextInputName = () => {
    setFocusName(true);
    setFocusCountry(false);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
    setFocusCountry(false);
  };

  const onFocusTextInputAccountNumber = () => {
    setFocusAccountNumber(true);
    setFocusCountry(false);
  };

  const onBlurTextInputAccountNumber = () => {
    setFocusAccountNumber(false);
    setFocusCountry(false);
  };

  const onFocusTextInputSSNNumber = () => {
    setFocusSSNNumber(true);
    setFocusCountry(false);
  };

  const onBlurTextInputSSNNumber = () => {
    setFocusSSNNumber(false);
    setFocusCountry(false);
  };

  const onFocusTextInputRoutingNumber = () => {
    setFocusRoutingNumber(true);
    setFocusCountry(false);
  };

  const onBlurTextInputRoutingNumber = () => {
    setFocusRoutingNumber(false);
    setFocusCountry(false);
  };

  const onFocusTextInputPhoneNumber = () => {
    setFocusPhoneNumber(true);
    setFocusCountry(false);
  };

  const onBlurTextInputPhoneNumber = () => {
    setFocusPhoneNumber(false);
    setFocusCountry(false);
  };
  const onFocusTextInputCurrency = () => {
    setFocusCurrency(true);
    setFocusCountry(false);
  };

  const onBlurTextInputCurrency = () => {
    setFocusCurrency(false);
    setFocusCountry(false);
  };

  const onFocusTextInputCountry = () => {
    setFocusCountry(true);
  };

  const onBlurTextInputCountry = () => {
    setFocusCountry(false);
  };

  const getid = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const userId = JSON.parse(await AsyncStorage.getItem('userID'));
    console.log('{token}', userId, token);
    setUToken(token);
    Hud.showHud();
    const api = BASE_URL + `profile-details/${userId}`;
    await axios({
      url: api,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        Hud.hideHud();
        console.log('response =====>', response.data);
        setName(response.data.name);
        setId(response.data.id_stripe_account);
      })
      .catch(function (error) {
        console.log('error =====>', error);
      });
  };
  const handlesubmit = async () => {
    if (name === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input Name',
      });
      return;
    }
    if (accountNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input Account Number',
      });
      return;
    }
    if (ssnNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input SSN Number',
      });
      return;
    }
    if (routingNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input Routing Number',
      });
      return;
    }
    if (phoneNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input Phone Number',
      });
      return;
    }
    if (currency === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input Currency',
      });
      return;
    }
    if (country === '') {
      Toast.show({
        type: 'error',
        text1: 'Please input Country',
      });
      return;
    }
    let bankData = {
      account_holder_name: name,
      account_number: accountNumber,
      ssn: ssnNumber,
      routing_number: routingNumber,
      phone: phoneNumber,
      account_holder_type: 'individual',
      currency: currency === 'undefined' ? 'usd' : currency,
      country: countryCode,
    };
    console.log('=================>', bankData);
    setAccountData(bankData);
    if (id === null || id === '') {
      Hud.showHud();
      axios({
        url: BASE_URL + 'create-customer-in-stripe',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${uToken}`,
        },
      })
        .then(function (response) {
          console.log('response =====>', response.data);
          Hud.hideHud();
          setId(response.data.id);
          if (response.data.id === null || response.data.id === '') {
            //  Alert.alert('Sorry', 'Id is not created!');
          } else {
            Hud.hideHud();
            bankLink(bankData);
          }
        })
        .catch(function (error) {
          Hud.hideHud();
          //  console.log('error =====>', error);
          if (error.response) {
            // Request made and server responded
            console.log(
              'error in response of notInterested function ==>',
              error?.response?.data,
            );
            Alert.alert('Sorry', `${error?.response?.data?.message}`, [
              {text: 'Check documents', onPress: () => props.navigation.navigate('documentUpload')},
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]);
            // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error in request', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('else error==>', error.message);
          }
        });
    } else {
      bankLink(bankData);
      //  Alert.alert('Success', 'id is not null');
    }
  };

  const bankLink = adata => {
    Hud.showHud();
    axios({
      url: `${BASE_URL}add-bank-in-stripe-for-driver`,
      method: 'POST',
      data: adata,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${uToken}`,
      },
    })
      .then(function (response) {
        Hud.hideHud();
        console.log('response =====>', response);
        if (response.data.status === 'new') {
          Alert.alert('Success', 'New account details is added.');
          props.navigation.navigate('mainNavigation');
        } else {
          Alert.alert('Success', 'Account details is added.');
          props.navigation.navigate('mainNavigation');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        //  console.log('error =====>', error);
        if (error.response) {
          // Request made and server responded
          const errapi =Object.values(error.response.data.error)[0][0]

          if(typeof error.response.data.error=='string'){
            console.log(
              'error in response of handlesubmit function ==>',
              error.response.data.error,
             Alert.alert("Error",error.response.data.error)
            );
          }else{
            console.log(
              'error in response of handlesubmit function ==>',
              error.response.data.error,
             Alert.alert("Error",Object.values(error.response.data.error)[0][0])
            );
          }
         
         
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };
  const onSelect = country => {
    setCountryCode(country.cca2);
    setCountry(country.name);
    setCurrency(country.currency[0]);
    setWithCountryNameButton(true);
    setFocusCountry(true);
    setFocusRoutingNumber(false);
    console.log('------------>', country.name);
    console.log('------------>', country.currency[0]);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View
        style={{
          position: 'relative',
          left: calcW(0.02),
          top: 1,
          flexDirection: 'row',
          //alignItems: 'center',
          height: calcH(0.05),
          //width: calcW(1.5),
          borderColor: '#000',
          borderWidth: 0,
          //elevation: 1,
          //paddingLeft: allPadding,
        }}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#000',
            borderWidth: 0,
          }}>
          <IconAntDesign
            color={colors.textHeader}
            size={24}
            name={'arrowleft'}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{width: calcW(0.95), alignSelf: 'center'}}>
        <View style={styles.container}>
          {/* <View style={styles.viewOne}>
          </View> */}

          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                // marginTop: 5,
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: allPadding,
              }}>
              <Image
                style={{
                  height: logoHeight,
                  width: logoWidth,
                  resizeMode: 'contain',
                }}
                source={require('../../asserts/logo.png')}
              />
              <Text style={styles.headerText}>Account Details</Text>

              <View
                style={
                  focusName === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusName === true ? (
                  <IconAntDesign
                    color={colors.activeBorder}
                    size={24}
                    name={'user'}
                  />
                ) : (
                  <IconAntDesign
                    color={colors.inActiveBorder}
                    size={24}
                    name={'user'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Name"
                  value={name}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setName(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusAccountNumber === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusAccountNumber === true ? (
                  <IconMaterialCommunityIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'card-account-details-outline'}
                  />
                ) : (
                  <IconMaterialCommunityIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'card-account-details-outline'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Account Number"
                  keyboardType="numeric"
                  value={accountNumber}
                  onBlur={() => onBlurTextInputAccountNumber()}
                  onFocus={() => onFocusTextInputAccountNumber()}
                  onChangeText={text => setAccountNumber(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusSSNNumber === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusSSNNumber === true ? (
                  <IconMaterialCommunityIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'card-account-details-outline'}
                  />
                ) : (
                  <IconMaterialCommunityIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'card-account-details-outline'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter 4 digit SSN Number"
                  keyboardType="numeric"
                  value={ssnNumber}
                  onBlur={() => onBlurTextInputSSNNumber()}
                  onFocus={() => onFocusTextInputSSNNumber()}
                  onChangeText={text => setSSNNumber(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusRoutingNumber === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusRoutingNumber === true ? (
                  <IconMaterialCommunityIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'card-account-details-outline'}
                  />
                ) : (
                  <IconMaterialCommunityIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'card-account-details-outline'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Routing Number"
                  value={routingNumber}
                  onBlur={() => onBlurTextInputRoutingNumber()}
                  onFocus={() => onFocusTextInputRoutingNumber()}
                  onChangeText={text => setRoutingNumber(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusPhoneNumber === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusPhoneNumber === true ? (
                  <IconIonicons
                    color={colors.activeBorder}
                    size={24}
                    name={'call-outline'}
                  />
                ) : (
                  <IconIonicons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'call-outline'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onBlur={() => onBlurTextInputPhoneNumber()}
                  onFocus={() => onFocusTextInputPhoneNumber()}
                  onChangeText={text => setPhoneNumber(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                //   style={
                //     focusCurrency === true
                //       ? styles.activeBorder
                //       : styles.inActiveBorder
                //   }

                style={styles.inActiveBorder}>
                {/* {focusCurrency === true ? (
                <IconIonicons
                  color={colors.activeBorder}
                  size={24}
                  name={'ios-person-circle-outline'}
                />
              ) : (
                <IconIonicons
                  color={colors.inActiveBorder}
                  size={24}
                  name={'ios-person-circle-outline'}
                />
              )} */}
                <IconIonicons
                  color={colors.inActiveBorder}
                  size={24}
                  name={'ios-person-circle-outline'}
                />

                <TextInput
                  style={styles.textInput}
                  //value={'Individual'}
                  // secureTextEntry={showHidePassword}
                  editable={false}
                  placeholder="Individual"
                  //onChangeText={text => setPassword(text)}
                  // onBlur={() => onBlurTextInputPassword()}
                  // onFocus={() => onFocusTextInputPassword()}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusCountry === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusCountry === true ? null : (
                  <IconMaterialIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'outlined-flag'}
                  />
                )}
                <View style={{marginVertical: '4.8%', marginLeft: '2%'}}>
                  <CountryPicker
                    {...{
                      countryCode,
                      // withFilter,
                      withFlag,
                      withCountryNameButton,
                      // withAlphaFilter,
                      // withCallingCode,
                      // withEmoji,
                      onSelect,
                    }}
                    // visible
                  />
                </View>

                {/* <TextInput
                  style={styles.textInput}
                  value={country}
                  placeholder="Country"
                  onChangeText={text => setCountry(text)}
                  onBlur={() => onBlurTextInputCountry()}
                  onFocus={() => onFocusTextInputCountry()}
                /> */}
              </View>
              <View
                style={
                  focusCurrency === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusCurrency === true ? (
                  <IconFontAwesome5
                    color={colors.activeBorder}
                    size={22}
                    name={'coins'}
                  />
                ) : (
                  <IconFontAwesome5
                    color={colors.inActiveBorder}
                    size={22}
                    name={'coins'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  value={currency}
                  placeholder="Currency"
                  editable={false}
                  //  onChangeText={text => setCurrency(text)}
                  // onBlur={() => onBlurTextInputCurrency()}
                  // onFocus={() => onFocusTextInputCurrency()}
                  placeholderTextColor="#C9CCCF"
                />
              </View>

              <TouchableOpacity
                style={{width: '100%'}}
                // onPress={() => navigation.navigate('userVerification')}
                onPress={() => handlesubmit()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default AccountDetails;

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
    width: '100%',
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 5,
    flexDirection: 'row',
    // paddingHorizontal: allPadding,
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? allPadding : 5,
  },
  activeBorder: {
    width: '100%',
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? allPadding : 5,
  },
  headerText: {
    fontSize: 24,
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
    color: colors.activeBorder,
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
    marginVertical: 10,
    textAlign: 'center',
  },
});
