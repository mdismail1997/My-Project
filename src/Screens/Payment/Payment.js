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
import {  CheckBox } from 'react-native-elements';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, PostRequest, PutRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import ButtonDark from '../../Component/Common/ButtonDark';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import { Input } from '@rneui/themed';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


export default function Payment(props) {
  const [cardNo, setcardNo] = useState('');
  const [cardName, setcardName] = useState('');
  const [exDate, setexDate] = useState('');
  const [cvv, setcvv] = useState('');
  const [selected, setSelected] = useState(false);
  const [loder, setLoder] = useState(false);
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
  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(true);
  const [addcard, setaddcard] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState();
  const [indexx, setIndex] = useState(null);
  const [itemm, setItemm] = useState({});
  const [options, setoptions] = useState('');
  const [mail, setmail] = useState('');
  const [contact, setcontact] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [amount, setamount] = useState('');
  const [currency, setcurrency] = useState('');
  const [orderquoteid, setorderquoteid] = useState('');
  const [rzporderid, setrzporderid] = useState('');
  const [image, setimage] = useState(false);
  const [indexxx, setIndexxx] = useState(false);
  const [itemmm, setitemmm] = useState(false);
  const [url, setURL] = useState('');
  const [refundamount, setRefundAmount] = useState('');
  const [number, setNumber] = useState('');


 

  const [creditAmount, setCreditAmount] = useState('');

  const [totalAmount, settotalAmount] = useState('');
  
  useEffect(() => {
    // console.warn('propssssss', props.route.params.storeCredit);
    let storeAmount = ''
    props.route.params.storeCredit.map((i) => {

        if (i.code == 'amstorecredit') {
          storeAmount = i.value
        }
        // console.log("jjjjjjjjjjjjjj",storeAmount)
        setCreditAmount(Math.abs(storeAmount))
    })



    let grandTotal = ''
    props.route.params.storeCredit.map((i) => {

        if (i.code == 'grand_total') {
          grandTotal = i.value
        }
        // console.log("============",grandTotal)
        settotalAmount(grandTotal)
    })
    setLoder(true);
    selectedLng();
    paymentInfotn();
    
  }, []);

  const applyStore = async() => {
    setLoder(true);
    let AccessToken = await AsyncStorage.getItem('traderToken');
    // console.warn('Customer Token', AccessToken);
    const cartid = await AsyncStorage.getItem('cartToken');
    // console.log('Cart ID ', cartid);
    // this.setState({loder: true});
   const data = {
    
      cartId:cartid,
      amount:number,
  
    };
    // console.log('by later  ===========', data);

    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/carts/mine/amstorecredit/apply`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        setLoder(false);
        // console.log('Apply store credit Amount ', response.data);
        setCreditAmount(response.data)
        let myData = ''
        props.route.params.storeCredit.map((i) => {
    
            if (i.code == 'grand_total') {
              myData = i.value
            }
            console.log("============",myData)
            settotalAmount(myData)
        })
        // if (response) {
        //   Alert.alert('Product', 'Product was added in Buy later.', [
        //     {text: ''},
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         this.cartItemDetails();
        //       },
        //     },
        //   ]);
        // }
      })
      .catch(err => {
        setLoder(false);
      
        Alert.alert('', 'Please Enter Amount.', [
              {text: ''},
              {text: 'OK' },
            ]);
            console.log('Buy later errorr ------------------ ', err);
      });
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
    // console.warn("selected Language data==>>>", lngData)
  }

  handleMMYYYY = text => {
    // setexDate(text),
    setdateerr1(false);
    if (text.length === 2) {
      text = text + '/';
    } else if (text.length === 3 && text.charAt(2) === '/') {
      text = text.replace('/', '');
    }
    setexDate(text);
  };
  profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(response => {
        console.warn('profile', response);
        if (response.email) {
          setID(response.id);
          setLoder(false);
          saveCardLists(response.id);
          saveDebitLists(response.id);
          setmail(response.email);
          setcontact(response.addresses[0].telephone);
          setFname(response.firstname);
          setLname(response.lastname);
        }
      })
      .catch(error => {
        console.warn('profile', error);
      });
  };

  profileData2 = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(response => {
        console.warn('profile', response);
        if (response.email) {
          setID(response.id);
          setLoder(false);
          setmail(response.email);
          setcontact(response.addresses[0].telephone);
          setFname(response.firstname);
          setLname(response.lastname);
          setimage(
            response.custom_attributes
              ? response.custom_attributes[0]?.value
              : '',
          );
        }
      })
      .catch(error => {
        console.warn('profile', error);
      });
  };

  const paymentInfotn = async() => {
    let storeAmount = await AsyncStorage.getItem('storeAmount');
    //  console.log('Amount =====> ', storeAmount);
    setRefundAmount(JSON.parse(storeAmount))
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

  saveCard = async () => {
    console.warn('gggg', cardNo, exDate, cardName, cvv);
    if (cardNo == '') {
      setnoerr1(true);
      setnoerr(strings.ENTER_CARD_NO);
    } else if (cardName == '') {
      setnameerror1(true);
      setnameerror(strings.ENTER_CARD_NAME);
    } else if (exDate == '') {
      setdateerr1(true);
      setdateerr(strings.ENTER_EXPIRY_DATE);
    } else if (cvv == '') {
      setcvverr1(true);
      setcvverr(strings.ENTER_CVV);
    } else {
      if (focus1 == true) {
        setLoder(true);
        console.warn('id', cardName, cardNo, exDate, cvv, id);
        const data = {
          data: {
            id: id,
            name: cardName,
            card_number: cardNo,
            expire_date: exDate,
            cvv: cvv,
          },
        };
        PostRequest('debitcarddata/save/', data, {}, 'self')
          .then(async res => {
            setLoder(false);
            console.warn('resss,', res);
            saveDebitLists(id);
            setcardNo('');
            setcardName('');
            setexDate('');
            setcvv('');
          })
          .catch(error => {
            setLoder(false);

            console.warn('r=err', error);
          });
      } else {
        setLoder(true);
        console.warn('id', cardName, cardNo, exDate, cvv, id);
        const data = {
          data: {
            id: id,
            name: cardName,
            card_number: cardNo,
            expire_date: exDate,
            cvv: cvv,
          },
        };
        PostRequest('creditcarddata/save/', data, {}, 'self')
          .then(async res => {
            setLoder(false);
            console.warn('resss,', res);
            saveCardLists(id);
            setcardNo('');
            setcardName('');
            setexDate('');
            setcvv('');
          })
          .catch(error => {
            setLoder(false);

            console.warn('r=err', error);
          });
      }
    }
  };

  saveCardLists = async id => {
    setLoder(true);
    let data = {
      id: id,
    };
    console.warn('idddddd', data);

    await PostRequest('creditcarddata/list/', data, {}, 'self')
      .then(async res => {
        console.warn('creditcarddata,', res);
        setLoder(false);
        setData1(res);
      })
      .catch(error => {
        setLoder(false);
        console.warn('r=creditcarddata', error);
      });
  };

  saveDebitLists = async id => {
    setLoder(true);
    const data = {
      id: id,
    };
    await PostRequest('debitcarddata/list/', data, {}, 'self')
      .then(async res => {
        console.warn('debitcarddata,', res);
        setLoder(false);
        setData2(res);
      })
      .catch(error => {
        setLoder(false);
        console.warn('r=debitcarddata', error);
      });
  };

  onPress = (item, index) => {
    console.warn('index', index, item);
    setIndex(index), setItemm(item);
    if (item.code == 'ccavenue') {
      setoptions(3);
    } else if (item.code == 'msp_cashondelivery') {
      setoptions(4);
    }
  };

  orderList = () => {
    setcardNo('');
    setcardName('');
    setexDate('');
    setcvv('');
    setFocus1(!focus1);
    setFocus2(false);
  };

  PreviousList = () => {
    setcardNo('');
    setcardName('');
    setexDate('');
    setcvv('');
    setFocus2(!focus2);
    setFocus1(false);
  };
  
  // console.warn('trueeeeee',refundamount)
  // removecart = async () => {
  //     props.navigation.navigate('DashBoard')

  //     try {
  //         await AsyncStorage.removeItem('cartToken');
  //         console.warn('trueeeeee')
  //     }
  //     catch (exception) {
  //         console.warn('false')
  //     }

  //     PostRequest("carts/mine", {}, {})
  //         .then(async res => {
  //             // setLoader(false)
  //             console.warn("res ", res);
  //             await AsyncStorage.setItem('cartToken', `${res}`);
  //         })
  //         .catch(error => {
  //             // setLoader(false)
  //             console.warn("cart err ", error);

  //         })
  // }

 const PayCCavenue = res => {
    setLoder(true);
    const data = {
      data: {
        order_id: res,
        payemtn_method: 'ccavenue',
      },
    };
    PostRequest('ccavenue/mine/payment-information', data, {}, 'admin')
      .then(async res => {
        setLoder(false);
        console.warn('ccavenue respone for payment information', res);
        setURL(res[0].url);
        props.navigation.navigate('PayCC', { url: res[0] });
      })
      .catch(error => {
        setLoder(false);

        console.warn('ccavenueerrrrr', error.response);
      });
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
      console.warn('Send data Cash on delivery => ', data, AccessToken);
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
      console.warn('Send data ccavenue => ', data, AccessToken);
      PutRequest('carts/mine/order', data, {}, 'self')
        .then(async res => {
          setLoder(false);
          // props.navigation.navigate('SuccessScreen', { res: res })

          console.warn('placeOrderavenueee responce => ', res);
          try {
            await AsyncStorage.removeItem('cartToken');
            console.log('trueeeeee');
            PayCCavenue(res);
          } catch (exception) {
            console.log('false');
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

  onPress2 = (item, index) => {
    console.warn('item', item);
    setIndexxx(index), setitemmm(item);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#C4C4C4',
        }}>
        <View style={{ alignSelf: 'center' }}>
          <RadioButton 
            color='black'
            value={'item.method_code'}
            status={indexxx == index ? 'checked' : 'unchecked'}
            onPress={() => this.onPress2(item, index)}
          />
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 10,
            borderColor: '#47474B',
            width: 260,
          }}
          onPress={() => { }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={{ alignSelf: 'flex-end', fontSize: 12 }}>
              Ex- {item.expire_date}
            </Text>
          </View>
          <Text style={{ fontSize: 15, marginTop: 10 }} numberOfLines={1}>
            {item.card_number}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem2 = ({ item, index }) => {
    // console.log("hhhhhhhhhhhhhhhhhhh",item)
    return (
      // <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, marginTop: 10, borderColor: '#47474B' }} onPress={() => { navigation.navigate('PayNow') }}>
      <>
        {item.code == 'stripe_payments' ? null : (
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

  

  
  const cancelStore = async() =>{
    
      let AccessToken = await AsyncStorage.getItem('traderToken');
      // console.warn('gggggggggg', AccessToken);
      setLoder(true);
      // data = {
      //   itemId: id,
      // };
      // console.log('by later  ===========', data);
  
      await axios({
        method: 'POST',
        url: `https://traders-platform.com/rest/V1/carts/mine/amstorecredit/cancel`,
        headers: {
          authorization: `Bearer ${AccessToken}`,
          'Content-Type': 'application/json',
        },
        // data: data,
      })
        .then(response => {
          setLoder(false);
          console.log('cancel store amount------------------ ', response.data);
          setCreditAmount(response.data)

          let lastData = ''
        props.route.params.storeCredit.map((i) => {
    
            if (i.code == 'grand_total') {
              lastData = i.value
            }
            console.log("11111111111111",lastData)
            settotalAmount(lastData)
        })
          // if (response) {
          //   Alert.alert('Product', 'Product was added in Buy later.', [
          //     {text: ''},
          //     {
          //       text: 'OK',
          //       onPress: () => {
          //         this.cartItemDetails();
          //       },
          //     },
          //   ]);
          // }
        })
        .catch(err => {
          setLoder(false);
          console.log('Buy later errorr ------------------ ', err);
        });
    }



// console.log("kkkkkkkkkkkkkkkkkk",refundamount)

  return (


    <View style={styles.container}>
    
      <Header title={strings.PAYMENT} navigation={props.navigation} icon="arrowleft" />
      <ScrollView  showsHorizontalScrollIndicator={false} >
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
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#5A5A5F',
                    fontSize: 13,
                    fontFamily: 'Roboto-bold',
                    marginTop: 10,
                  }}>
                 Store Credit
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
                <Text
                numberOfLines={2}
                style={{
                  color: '#5A5A5F',
                  fontSize: 13,
                  fontFamily: 'Roboto-bold',
                  marginTop: 10,
                }}>
                {props.route.params.code}{creditAmount}
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
                borderBottomWidth: 0.5,
              }}>
              
              </Text>
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
                    props.route.params.tax  -
                    creditAmount

                  }
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
                    orderList();
                  }}>
                  <View
                    style={{
                      width: 145,
                      backgroundColor: focus1 == true ? '#FDB833' : '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderColor: focus1 == true ? '#FDB833' : '#000',
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        padding: 10,
                        color: focus1 == true ? '#fff' : '#000',
                        fontSize: 13,
                        fontFamily: 'Roboto-Regular',
                        fontWeight: 'bold',
                      }}>
                      {strings.PAY_WITH_DEBIT}
                    </Text>
                  </View>
                </TouchableOpacity>
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

        {refundamount != 0 && 
        
         <View style={{}}>
        <Text style={{
          fontWeight: '600',
          fontFamily: 'Roboto-Regular',
          color: '#4F4F54',
          paddingVertical: 20,
          fontSize: 16}}>
        {strings.Apply_Store_Credit} :
        </Text>


        <Input
        placeholder={strings.Apply_Store_Credit_Amount}
        inputContainerStyle={{ borderWidth: 1 }}
        containerStyle={{ paddingHorizontal: 10,width:width*0.8, }}
        inputStyle={{
          fontSize: 16,
          fontFamily: 'Roboto-Regular',
          color: '#47474B',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
        placeholderTextColor="#47474B"
        leftIconContainerStyle={{ marginLeft: 10 }}
        errorStyle={{ display: 'none' }}
        onChangeText={e => setNumber(e)}
        value={number.replace(/\s/g, '')}
      />


      <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginTop: 12,
      }}>
      <TouchableOpacity>
        <Text
          onPress={ ()=>
          applyStore()
        }
          style={{
            color: '#ef7b4a',
            fontSize: 14,
            fontFamily: 'Roboto-Regular',
          }}>
          Apply Store Credit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          cancelStore();
        }}>
        <Text
          style={{
            color: '#df6175',
            fontSize: 14,
            fontFamily: 'Roboto-Regular',
            marginLeft: 10,
          }}>
          Cancel Store Credit
        </Text>
      </TouchableOpacity>
    </View>

      
       
       </View>
       
      }
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
    </View>
  );
}

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


















