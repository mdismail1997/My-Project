import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentIcon } from 'react-native-payment-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import Octicons from 'react-native-vector-icons/Octicons';
import * as RNLocalize from 'react-native-localize';

const { width, height } = Dimensions.get('window');


export const AccountDetails = (props) => {
  const [loading, setLoding] = useState(false);
  const [alldata, setAlldata] = useState([]);
  const [cardnumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirymonth, setExpiryMounth] = useState('');
  const [expiryyear, setExpiryYear] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const [select, setSelect] = useState(false);
  const [index, setIndex] = useState();
  const [stripetoken, setToken] = useState('');
  const [card_no, setCard_No] = useState('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  let isActionInProgress = false;
  useEffect(() => {
    GetcardDetails();

  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetcardDetails();
      console.log("======Booking date=========", props.route.params?.name)
      console.log("======Booking date=========", props.route.params?.img)
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  const GetcardDetails = async (values) => {
    // setLoding(true);
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      const Fees = {
        patient_id: user_id,
      };
      console.log('Fees----------', Fees);
      setLoding(true);
      const response = await Apis.listcarddetails(Fees);
      setLoding(false);
      console.log("================", response.data);
      setAlldata(response.data.data);
      // setIndex(response.data.data.default);
      console.log('uid==', response.data.user_id);
    } catch (err) {
      console.error(err);
      setLoding(false);
      // setError((dat) => ({
      //   ...dat,
      //   iserror: true,
      //   message: err.response,
      // }));
    }
  };
  //console.log('pp', index)

  const DefaultCard = async (_id) => {
    // setLoding(true);
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      const Fees = {
        card_id: _id,
      };
      console.log('Fees----------', Fees);
      const response = await Apis.defaultcard(Fees);
      setLoding(false);
      console.log(response.data);
      setErr((dat) => ({
        ...dat,
        iserr: true,
        message: response.data.message,
      }));
      GetcardDetails();
      // setTimeout(() => {
      //   props.navigation.goBack();
      // }, 2500);

      // setIndex(response.data.data.default);
      console.log('uid==', response.data.user_id);
    } catch (err) {
      console.error(err);
      setLoding(false);
      // setError((dat) => ({
      //   ...dat,
      //   iserror: true,
      //   message: err.response,
      // }));
    }
  };
  const Payment = async (_) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    if (!isButtonPressed && !isActionInProgress) {
      setIsButtonPressed(true);
      isActionInProgress = true;
      const data = {
        // stripeToken: stripetoken,
        amount: props.route.params.price,
        booking_id: props.route.params.booking_id,
        card_no: card_no,

      };
      console.log(data);
      //  setLoding(true);
      Apis.paynow(data)

        .then((response) => {
          console.warn(response.data);
          if (response.data.success === '0') {
            setError((data) => ({
              ...data,
              iserror: true,
              message: response.data.message,
            }));
          } else {
            props.navigation.navigate('Payment', { app_type: response.data.app_type });
            SendNotification();
            SendPatientNotification();
            setTimeout(() => {
              console.log(response.data.app_type);
              if (response.data.app_type === "B") {
                // props.navigation.navigate('DoctorProfile', {
                //   id: response.data.doctor_id,
                // });

                props.navigation.navigate('PatientTabNavigator');
              }
              else {
                props.navigation.navigate("AddReport", {
                  symptomid: props.route.params.symptomid,
                  gender: props.route.params.gender,
                  userid: props.route.params?.userid,
                  mail: props.route.params.mail,
                  birthyear: props.route.params.birthyear,
                  name: props.route.params.name
                })
              }
            }, 3500);
          }

          setLoding(false);
        })
        .catch((error) => {
          console.error(error.response.data);
          setLoding(false);
          isActionInProgress = false;
          setIsButtonPressed(false);
        });
    }
  };
  const SendNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', token);
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
      booking_id: props.route.params.booking_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data--------', data);
    //   setLoding(true);
    await Apis.notificationdoctor(data)

      .then((response) => {
        console.warn(response.data);

        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };
  const SendPatientNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', token);
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
      booking_id: props.route.params.booking_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data--------', data);
    //  setLoding(true);
    await Apis.notificationpatient(data)

      .then((response) => {
        console.warn(response.data);

        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        // SetIsSubmit(false);
      });
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', }}>
      {/* <Header title="Account Details" navProps={props.navigation} /> */}
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
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: 'green', zIndex: 1000 }}
      >
        {err.message}
      </Snackbar>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <ScrollView

        showsVerticalScrollIndicator={false}>

        <View style={{ marginBottom: height * 0.02 }}>
          <View
            style={{
              backgroundColor: '#2173A8',
              //marginTop: height * .025,
              width: width * 0.99,
              height: height * 0.35,
              //backgroundColor: 'red',
              // height: '28%',
              // width: '95%',
              //alignSelf: 'center',
              borderRadius: 10,
              // marginTop: 20,
              //  justifyContent: 'flex-end',
              // alignItems: 'flex-end'

            }} >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
                <Image
                  source={require('../../Assets/back.png')}
                  style={{ marginLeft: width * 0.05, tintColor: '#fff' }} />
              </TouchableOpacity>
              {/* <Octicons
                name="arrow-left"
                size={30}
                color={'#fff'}
                style={{ marginLeft: width * 0.05 }}
                onPress={() => props.navigation.goBack(null)}
              /> */}
              <Text style={{ color: '#fff', textAlign: 'center', }}>MAKE A PAYMENT</Text>
              <View style={{ width: 30 }} />
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
              <Image
                source={{ uri: props.route.params?.img }}
                style={{ height: 50, width: 50, borderRadius: 55, marginLeft: 20, resizeMode: 'contain' }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, marginLeft: 20 }}>
                {props.route.params?.doctorname}
              </Text>
              <View style={{ width: 150 }} />
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                //backgroundColor: 'blue',
                width: width * 0.80,
                height: height * 0.25,
                // height: '60%',
                // width: '85%',
                alignSelf: 'center',
                borderTopLeftRadius: 10,
                borderBottomEndRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopEndRadius: 10,
                justifyContent: 'center',
                //  alignItems: 'flex-end'
                marginTop: height * 0.045,
                borderColor: '#ddd',
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  //marginTop: 15,
                  fontSize: RFValue(14),
                  textAlign: 'center',
                  marginHorizontal: 5,
                }}
              >
                Total Payment For {props.route.params?.type} Consultation
              </Text>
              <Text
                style={{
                  color: '#000',
                  marginTop: 15,
                  fontSize: RFValue(18),
                  textAlign: 'center',
                }}
              >
                ${props.route.params.price}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{ color: '#2173A8', marginTop: 10, marginLeft: 45 }}
                >
                  Date
                </Text>
                <Text
                  style={{ color: '#2173A8', marginTop: 10, marginRight: 45 }}
                >
                  Time
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: '#000', marginTop: 10, marginLeft: 20 }}>
                  {props.route.params?.date}
                </Text>
                <Text style={{ color: '#000', marginTop: 10, marginRight: 20 }}>
                  {props.route.params?.time}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                // Addcard();
                props.navigation.navigate('StripPayment', {
                  price: props.route.params.price,
                  booking_id: props.route.params.booking_id,
                });
              }}
              style={styles.checkborder}
            >
              <Image
                style={styles.img}
                source={require('../../Assets/googlepay.png')}
              />

              <Text style={styles.text}>Add New Card</Text>
            </TouchableOpacity>
          </View>
          {alldata.length == '' ?
            null :
            (<Text
              style={{
                color: '#333333',
                marginTop: 30,
                //  marginLeft: 30,
                fontSize: RFValue(18),
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Pay from your default account
            </Text>)}


          {alldata?.length < 1 || alldata == null ? (
            <Text style={{ color: '#000', textAlign: 'center', marginTop: 40 }}>
              No Cards Available
            </Text>
          ) : (
            alldata?.map((el, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  backgroundColor:
                    el.default === 1
                      ? '#2173A8'
                      : index === i
                        ? 'blue'
                        : '#fff',
                  marginHorizontal: 30,
                  //height: 75,
                  marginTop: 30,
                  borderRadius: 10,
                  alignItems: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                }}
                onPress={() => {
                  console.log(i);
                  setIndex(i);
                  DefaultCard(el.id);
                  setToken(el.token);
                  setCard_No(el.card_no);
                }}
              >

                {/* <View
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  marginLeft: 10,
                  marginTop: 13,
                }}
              >
                <Text
                  style={{
                    color: '#2274A9',
                    textAlign: 'center',
                    marginTop: 15,
                  }}
                >
                  SBI
                </Text>
              </View> */}

                <View
                  style={{
                    flexDirection: 'row',
                    width: '80%',
                    marginLeft: 0,
                    marginTop: 10,
                  }}
                >
                  <PaymentIcon type={el.brand.toLowerCase()} />
                  <View
                    style={{
                      width: '75%',
                      justifyContent: 'center',
                      marginLeft: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(15),
                        color:
                          el.default === 1
                            ? '#fff'
                            : index === i
                              ? '#fff'
                              : '#2173A8',
                        fontWeight: 'normal',

                      }}
                      numberOfLines={1}
                    >
                      xxxx xxxx xxxx {el.card_no}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '80%',
                    marginLeft: 0,
                    marginTop: 20,
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      //  marginLeft: 50,
                      // marginTop: 10,
                      marginBottom: 20,
                      color:
                        el.default === 1
                          ? '#fff'
                          : index === i
                            ? '#fff'
                            : '#2173A8',
                    }}
                  >
                    {el.name}
                  </Text>

                  {/* <Text
                  style={{
                    color: '#fff',
                    marginLeft: 100,
                    color: '#000'
                    //alignSelf: 'flex-end',
                    // marginRight: 50,
                    //  marginTop: 20,
                    //   position: 'absolute',
                  }}
                >
                  Expires
                </Text> */}


                  <Text
                    style={{
                      color: '#fff',
                      //    marginLeft: -40,
                      //  marginTop: 20,
                      marginBottom: 20,
                      // eslint-disable-next-line no-dupe-keys
                      color:
                        el.default === 1
                          ? '#fff'
                          : index === i
                            ? '#fff'
                            : '#2173A8',
                      //   alignSelf: 'flex-end',


                      // marginRight: 40,
                      //width: '50%'
                      //   position: 'absolute',
                    }}
                  >
                    {el.month}/{el.year}
                  </Text>
                </View>
                {/* <Image
                style={{
                  width: 20,
                  height: 22,
                  resizeMode: 'contain',
                  tintColor: '#fff',
                  alignSelf: 'flex-end',
                  // marginTop: -50,
                  marginRight: 20,
                  marginBottom: 10,
                }}
                source={require('../../Assets/tick.png')}
              /> */}
              </TouchableOpacity>
            ))
          )}

          {alldata?.length < 1 || alldata == null ? null : (

            <TouchableOpacity
              onPress={() => {
                Payment()
                // Addcard();
                //  
                // props.navigation.navigate('StripPayment');
              }}
              disabled={isButtonPressed}
              style={{
                borderColor: '#2173A8',
                borderWidth: 1,

                marginTop: 25,
                borderRadius: 10,
                height: 55,
                width: '85%',
                backgroundColor: '#2173A8',
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: RFValue(18),
                  textAlign: 'center',
                  marginTop: 15,
                }}
              >
                Pay Now
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#2173A8',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: height * 0.14,
    borderRadius: 10,
    height: 55,
    width: '85%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'center',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',

  },
  selectcard: {
    backgroundColor: '#2173A8',
    marginHorizontal: 30,
    //height: 75,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  unselectcard: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    //height: 75,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  img: {
    width: 35,
    height: 47,
    resizeMode: 'contain',
  },
  text: {
    color: '#2173A8',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Rubik',
  },
});
