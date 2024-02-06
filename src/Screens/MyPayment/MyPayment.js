import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  I18nManager
} from 'react-native';
import Header from '../../Component/Header/Header';
import { Input, CheckBox } from 'react-native-elements';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, PostRequest, PutRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import ButtonDark from '../../Component/Common/ButtonDark';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';


// import {
//   StripeProvider,
//   CardForm,
//   useStripe,
//   initStripe,
//   BillingDetails,
//   CardField,
//   useConfirmPayment,
//   createPaymentMethod,
//   PaymentSheetError,
// } from '@stripe/stripe-react-native';

const MyPayment = (props) => {

    const [loder, setLoder] = useState(false);
    const [options, setoptions] = useState('');
    const [paymentInfo, setPaymentInfo] = useState();
    const [focus1, setFocus1] = useState(false);
    const [focus2, setFocus2] = useState(true);
    const [indexx, setIndex] = useState(null);


    const [cardNo, setcardNo] = useState('');
    const [cardName, setcardName] = useState('');
    const [exDate, setexDate] = useState('');
    const [cvv, setcvv] = useState('');
    const [selected, setSelected] = useState(false);
    const [id, setID] = useState('');
    const [nameerror, setnameerror] = useState('');
    const [noerr, setnoerr] = useState('');
    const [dateerr, setdateerr] = useState('');
    const [cvverr, setcvverr] = useState('');
    const [nameerror1, setnameerror1] = useState(false);
    const [noerr1, setnoerr1] = useState(false);
    const [dateerr1, setdateerr1] = useState(false);
    const [cvverr1, setcvverr1] = useState(false);
    const [checked, setChecked] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [addcard, setaddcard] = useState(false);
    const [itemm, setItemm] = useState({});
    const [mail, setmail] = useState('');
    const [contact, setcontact] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [amount, setamount] = useState('');
    const [currency, setcurrency] = useState('');
    const [orderquoteid, setorderquoteid] = useState('');
    const [rzporderid, setrzporderid] = useState('');
    const [indexxx, setIndexxx] = useState(false);
    const [itemmm, setitemmm] = useState(false);
    // const [url, setURL] = useState('');
    // const [image, setimage] = useState(false);

    const { confirmPayment } = useStripe();

    useEffect(() => {
        console.warn('propssssss', props.route.params.method);9*
        setLoder(true);
        selectedLng();
        paymentInfotn();
      }, []);


    useEffect(() => {
        async function initialize() {
          const publishableKey =
            'pk_test_51Lk13sSEa83352j1YInc1Inwb8CDHCXknsh9D6lOtCsompECveReX4bR3hJoIfiI2gNViFPORtOL2oIascgIv7uN00U7wHsve0';
          if (publishableKey) {
            await initStripe({
              publishableKey,
              merchantIdentifier: 'merchant.identifier',
            });
            // setLoder(false);
            // initializePaymentSheet();
          }
        }
        initialize();
      }, []);
      const logout2 = async () => {
        setLoder(true)
        setTimeout(async () => {
          setLoder(false)
          props.navigation.navigate('signin');
          await AsyncStorage.removeItem('traderToken');
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }, 2000);
    
      };
      const selectedLng = async () => {
        const lngData = await getLng()
        if (lngData) {
          strings.setLanguage(lngData);
        }
        if (lngData === 'en') {
          I18nManager.forceRTL(false);
        }
        if (lngData === 'ar') {
          I18nManager.forceRTL(true)
        }
        // await setLoading(false);
        setLoder(false)
        console.warn("selected Language data==>>>", lngData)
      }
      onPress2 = (item, index) => {
        console.warn('item', item);
        setIndexxx(index), setitemmm(item);
      };

    //   profileData = () => {
    //     GetRequest('customers/me/', undefined, {}, 'self')
    //       .then(response => {
    //         // console.warn('profile', response);
    //         if (response.email) {
    //           setID(response.id);
    //           setLoder(false);
    //           saveCardLists(response.id);
    //           saveDebitLists(response.id);
    //           setmail(response.email);
    //           setcontact(response.addresses[0].telephone);
    //           setFname(response.firstname);
    //           setLname(response.lastname);
    //         }
    //       })
    //       .catch(error => {
    //         console.warn('profile', error);
    //       });
    //   };

      const paymentInfotn = () => {
        GetRequest('carts/mine/payment-information', undefined, {}, 'self')
          .then(response => {
            setLoder(false);
            console.warn('paymentInfo', response.payment_methods);
            setPaymentInfo(response.payment_methods);
          })
          .catch(error => {
            setLoder(false);
            console.warn('paymentInfo', error);
            if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
              Alert.alert(strings.SESSION, '', [
                { text: '' },
                {
                  text: strings.OK,
                  onPress: () => {
                    logout2();
                  },
                },
              ])
            }
          });
      };

      orderList = () => {
        setcardNo('');
        setcardName('');
        setexDate('');
        setcvv('');
        setFocus1(!focus1);
        setFocus2(false);
      };



      const renderItem2 = ({ item, index }) => {
        return (
          // <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, marginTop: 10, borderColor: '#47474B' }} onPress={() => { navigation.navigate('PayNow') }}>
          <>
            {item.code == 'stripe_payments' ? 
            {/* null  */}
            <
            <CardField
      postalCodeEnabled={true}
      placeholders={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />


            
            : (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: '#C4C4C4',
                  paddingVertical: 10,
                }}>
                <RadioButton
                  value={item.title}
                  status={indexx == index ? 'checked' : 'unchecked'}
                  onPress={() => onPress(item, index)}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    color: '#000',
                  }}
                  numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            )}
          </>
    
          // </TouchableOpacity>
        );
      };


      const StripePayment = async () => {
        const {setupIntent, ephemeralKey, customer} =
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


      const placeOrder = async () => {
    console.warn('ooprrrrrrrrrrr', options);
    let AccessToken = await AsyncStorage.getItem('userToken');
    setLoder(true);
    if (options == 4) {
      let data = {
        paymentMethod: { method: 'msp_cashondelivery' },
        shippingMethod: {
          additionalProperties: {},
          carrier_code: props.route.params.cmethod,
          method_code: props.route.params.method,
        },
      };
      console.warn('data => ', data, AccessToken);
      PutRequest('carts/mine/order', data, {}, 'self')
        .then(async res => {
          setLoder(false);
          props.navigation.navigate('SuccessScreen', { res: res });

          console.warn('placeOrder responce => ', res);
          try {
            await AsyncStorage.removeItem('cartToken');
            console.warn('trueeeeee');
          } catch (exception) {
            console.warn('false');
          }
        })
        .catch(error => {
          setLoder(false);
          // console.warn("data => ", data, AccessToken);
          console.warn('placeOrder error => ', error.response);
        });
    } else if (options == 3) {
      let data = {
        paymentMethod: { method: 'ccavenue' },
        shippingMethod: {
          additionalProperties: {},
          carrier_code: props.route.params.cmethod,
          method_code: props.route.params.method,
        },
      };
      console.warn('data => ', data, AccessToken);
      PutRequest('carts/mine/order', data, {}, 'self')
        .then(async res => {
          setLoder(false);
          // props.navigation.navigate('SuccessScreen', { res: res })

          console.warn('placeOrderavenueee responce => ', res);
          try {
            await AsyncStorage.removeItem('cartToken');
            console.warn('trueeeeee');
            PayCCavenue(res);
          } catch (exception) {
            console.warn('false');
          }
        })
        .catch(error => {
          setLoder(false);
          console.warn('placeOrderavenueee error => ', error.response);
        });
    } else {
      alert('Please select the Payment option')
      setLoder(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title={strings.PAYMENT} navigation={props.navigation} icon="arrowleft" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 30,
        }}>
        <View
          style={{
            elevation: 3,
            backgroundColor: '#fff',
            marginTop: 20,
            padding: 10,
          }}>
          <View>
            <Text
              numberOfLines={2}
              style={{
                color: '#5A5A5F',
                fontSize: 12,
                fontFamily: 'Roboto-bold',
              }}>
              {strings.PRICE_DET}{' '}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                color: '#5A5A5F',
                fontSize: 12,
                fontFamily: 'Roboto-bold',
                borderBottomColor: '#5A5A5F',
                borderBottomWidth: 0.2,
              }}></Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {strings.PRICE} ({props.route.params.length} {props.route.params.length == '1' ? strings.ITEM2 : strings.ITEMS2})
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {strings.DELIVERY_CHARGES}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {strings.TAX}
                </Text>
              </View>
              <View>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {props.route.params.code} {props.route.params.price}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#32cd32',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {props.route.params.dprice == '0'
                    ? strings.FREE
                    : props.route.params.dprice}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {props.route.params.tax}
                </Text>
              </View>
            </View>
            <Text
              numberOfLines={2}
              style={{
                color: '#5A5A5F',
                fontSize: 12,
                fontFamily: 'Roboto-bold',
                borderBottomColor: '#5A5A5F',
                borderBottomWidth: 0.2,
              }}></Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {strings.AMOUNT_PAYBLE}
                </Text>
              </View>
              <View>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                  {props.route.params.code}{' '}
                  {props.route.params.dprice +
                    props.route.params.price +
                    props.route.params.tax}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.txtStl, { fontSize: 20, fontWeight: 'bold' }]}>
            {strings.SELECT_PAY_METHOD}
          </Text>
          {options == 1 ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    PreviousList();
                  }}>
                  <View
                    style={{
                      width: 145,
                      marginLeft: 20,
                      backgroundColor: focus2 == true ? '#FDB833' : '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderColor: focus2 == true ? '#FDB833' : '#000',
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        padding: 10,
                        color: focus2 == true ? '#fff' : '#000',
                        fontSize: 13,
                        fontFamily: 'Roboto-Regular',
                        fontWeight: 'bold',
                      }}>
                      {strings.PAY_WITH_CREDIT}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {addcard == false ? (
                <ButtonDark
                  handleClick={() => {
                    setaddcard(true);
                  }}
                  title={strings.ADD_CARD}
                />
              ) : null}

              {addcard == true ? (
                <View style={{}}>
                  <Input
                    placeholder="xxxxxxxxxxxx1256"
                    inputContainerStyle={{ borderWidth: 1, marginTop: 5 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 14,
                      fontFamily: 'Roboto-Regular',
                      color: '#47474B',
                      height: 5,
                      marginLeft: 10,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    placeholderTextColor="#47474B"
                    onChangeText={e => {
                      setcardNo(e), setnoerr1(false);
                    }}
                    keyboardType="numeric"
                    maxLength={16}
                    errorMessage={noerr1 == true ? noerr : ''}
                    value={cardNo}
                  />
                  <Input
                    placeholder={strings.NAME_ON_CARD}
                    inputContainerStyle={{
                      borderWidth: 1,
                      marginTop: noerr1 == true ? 15 : -15,
                    }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 14,
                      fontFamily: 'Roboto-Regular',
                      color: '#47474B',
                      height: 5,
                      marginLeft: 10,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    placeholderTextColor="#47474B"
                    onChangeText={e => {
                      setcardName(e), setnameerror1(false);
                    }}
                    errorMessage={nameerror1 == true ? nameerror : ''}
                    value={cardName}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Input
                      placeholder={strings.ENTER_DATE}
                      inputContainerStyle={{
                        borderWidth: 1,
                        marginTop: nameerror1 == true ? 15 : -15,
                      }}
                      containerStyle={{ paddingHorizontal: 0, width: 145 }}
                      inputStyle={{
                        fontSize: 14,
                        fontFamily: 'Roboto-Regular',
                        color: '#47474B',
                        height: 5,
                        marginLeft: 10,
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                      }}
                      placeholderTextColor="#47474B"
                      keyboardType="numeric"
                      onChangeText={e => {
                        handleMMYYYY(e);
                      }}
                      errorMessage={dateerr1 == true ? dateerr : ''}
                      maxLength={5}
                      value={exDate}
                    />
                    <Input
                      placeholder="CVV"
                      inputContainerStyle={{
                        borderWidth: 1,
                        marginTop: nameerror1 == true ? 15 : -15,
                        borderColor: '#FF141D',
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                      }}
                      containerStyle={{ paddingHorizontal: 0, width: 145 }}
                      inputStyle={{
                        fontSize: 14,
                        fontFamily: 'Roboto-Regular',
                        color: '#47474B',
                        height: 5,
                        marginLeft: 10,
                      }}
                      placeholderTextColor="#47474B"
                      keyboardType="numeric"
                      errorMessage={cvverr1 == true ? dateerr : ''}
                      maxLength={3}
                      onChangeText={e => {
                        setcvv(e), setcvverr1(false);
                      }}
                      value={cvv}
                    />
                  </View>
                  <ButtonDark
                    handleClick={() => {
                      saveCard();
                    }}
                    title={strings.CONTINUE}
                  />
                </View>
              ) : null}
              <Text
                style={[
                  styles.txtStl,
                  {
                    fontWeight: '600',
                    borderBottomWidth: 1,
                    borderBottomColor: '#C4C4C4',
                  },
                ]}>
                Select card
              </Text>
              <View
                style={{
                  height: 270,
                  borderBottomWidth: 1,
                  borderBottomColor: '#C4C4C4',
                }}>
                {focus1 == true ? (
                  data2.length == 0 ? (
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#000',
                        alignSelf: 'center',
                        marginTop: 50,
                      }}>
                      There are no any debit card saved.
                    </Text>
                  ) : (
                    <FlatList
                      data={data2}
                      renderItem={renderItem}
                      extraData={checked}
                      keyExtractor={item => item.id.toString()}
                    />
                  )
                ) : data1.length == 0 ? (
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#000',
                      alignSelf: 'center',
                      marginTop: 50,
                    }}>
                    There are no any credit card saved.
                  </Text>
                ) : (
                  <FlatList
                    data={data1}
                    renderItem={renderItem}
                    extraData={checked}
                    keyExtractor={item => item.id.toString()}
                  />
                )}
              </View>
            </View>
          ) : null}
         

          {options == 4 ? <View></View> : null}
          <Text
            style={{
              fontWeight: '600',
              fontFamily: 'Roboto-Regular',
              color: '#4F4F54',
              paddingVertical: 20,
              fontSize: 16,
            }}>
            {strings.PAYMENT_OPT}
          </Text>
          <FlatList
            data={paymentInfo}
            renderItem={renderItem2}
            keyExtractor={(item, index) => item}
          />
        </View>
        <View style={{}}>
          <ButtonDark
            handleClick={() => {
              placeOrder();
            }}
            title={strings.PLACE_ORDER}
          />
        </View>
        {loder && <Loder />}
      </View>
    </ScrollView>
  )
}

export default MyPayment

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#fff',
      paddingVertical: 16,
      width: '100%',
      borderRadius: 2,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: '#47474B',
    },
    buttontext: {
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      color: '#47474B',
      // textAlign: "center"
      marginLeft: 15,
    },
    txtStl: {
      fontFamily: 'Roboto-Regular',
      color: '#4F4F54',
      paddingVertical: 20,
    },
  });