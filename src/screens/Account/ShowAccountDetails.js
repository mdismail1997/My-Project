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
} from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentIcon } from 'react-native-payment-icons'
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export const ShowAccountDetails = (props) => {
  const [loading, setLoding] = useState(false);
  const [alldata, setAlldata] = useState([]);

  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const [select, setSelect] = useState(false);
  const [index, setIndex] = useState();
  const [stripetoken, setToken] = useState('');
  const [card_no, setCard_No] = useState('');
  const [userid, setUserId] = useState('');
  useEffect(() => {
    GetcardDetails();
  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetcardDetails();

    });
    return unsubscribe;
  }, []);
  const GetcardDetails = async (values) => {
    setLoding(true);
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      // let token = usertoken;
      // console.log('user id =====>>>>', user_id);
      // console.log('token123=', token);
      setUserId(JSON.parse(userid));
      const Fees = {
        patient_id: user_id,
      };
      console.log('Fees----------', Fees);
      const response = await Apis.listcarddetails(Fees);
      setLoding(false);
      console.log(response.data);
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
  console.log('pp', index)


  const DefaultCard = async (_id) => {
    setLoding(true);
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
      //   GetcardDetails();
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
  const Choose = (_id) => {
    console.log('_id=======', _id);

    Alert.alert(
      'Choose', 'Are you sure you want to delete?',

      [
        { text: 'Yes', onPress: () => Delete(_id) },
        // { text: 'Gallery', onPress: () => GalleryPicker() },
        { text: 'No', onPress: () => null },
      ],
      { cancelable: true }
      //clicking out side of alert will not cancel
    );
  };
  const Delete = async (id) => {
    console.log('av id =====>>>>', id);

    const data = {
      card_id: id,
    };
    await Apis.cardDelete(data)

      .then((response) => {
        console.warn('responsedata=================>', response.data);
        // props.navigation.navigate('Account');
        setErr((dat) => ({
          ...dat,
          iserr: true,
          message: response.data.message,
        }));
        setAlldata((prevData) => prevData.filter((el) => el.id !== id));
      })

      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Account Details" navProps={props.navigation} />
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
        style={{ backgroundColor: 'green', zIndex: 100 }}
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
      <ScrollView>
        {/* <View
          style={{
            marginHorizontal: '7.5%',
            marginTop: '10%',
          }}
        >
          <TextInput
            mode="outlined"
            label="Account Holder name*"
            // placeholder="Card Holder name"
            outlineColor={'#2173A8'}
            placeholderTextColor="black"
            maxLength={20}
            style={{ backgroundColor: '#fff' }}
            //textColor="red"
            onChangeText={(text) => setName(text)}

            value={removeEmojis(name)}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
        </View> */}
        {/* <View style={{ marginHorizontal: '7.5%', marginTop: 20 }}>
          <TextInput
            mode="outlined"
            label="Card Number*"
            // placeholder="Card Number"
            outlineColor={'#2173A8'}
            placeholderTextColor="black"
            maxLength={16}
            style={{ backgroundColor: '#fff' }}
            //textColor="red"
            keyboardType='phone-pad'
            onChangeText={(text) => setCardNumber(text)}

            value={removeEmojis(cardnumber)}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
        </View>
        <View style={{ marginHorizontal: '7.5%', marginTop: 20 }}>
          <TextInput
            mode="outlined"
            label="CVV*"
            placeholder=""
            outlineColor={'#2173A8'}
            placeholderTextColor="black"
            maxLength={3}
            style={{ backgroundColor: '#fff' }}
            //textColor="red"
            onChangeText={(text) => setCvv(text)}
            keyboardType='phone-pad'
            value={removeEmojis(cvv)}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              marginTop: 25,
              borderRadius: 5,
              height: 40,
              width: '40%',
              marginRight: '5%',
              marginLeft: '7.5%',
            }}
          >
            <TextInput
              mode="outlined"
              label="Expiry Month*"
              keyboardType='phone-pad'
              placeholder=""
              outlineColor={'#2173A8'}
              placeholderTextColor="black"
              maxLength={2}
              style={{ backgroundColor: '#fff' }}
              //textColor="red"
              onChangeText={(text) => setExpiryMounth(text)}

              value={removeEmojis(expirymonth)}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            />
          </View>

          <View
            style={{
              marginTop: 25,
              borderRadius: 5,
              height: 40,
              width: '40%',


              // marginRight:'7.5%'
            }}
          >
            <TextInput
              mode="outlined"
              label="Expiry Year*"
              placeholder=""
              outlineColor={'#2173A8'}
              placeholderTextColor="black"
              keyboardType='phone-pad'
              maxLength={4}
              style={{ backgroundColor: '#fff' }}
              //textColor="red"
              onChangeText={(text) => setExpiryYear(text)}

              value={removeEmojis(expiryyear)}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            />
          </View>
        </View> */}
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
        <View>
          <TouchableOpacity
            onPress={() => {
              // Addcard();
              props.navigation.navigate('StripPayment', {
                Type: 'New',
                userid: userid
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
        <Text
          style={{
            color: '#333333',
            marginTop: 20,
            marginLeft: 30,
            fontSize: 18,
          }}
        >
          Select your default account
        </Text>

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
                  el.default === 1 ? '#2173A8' : index === i ? 'blue' : '#fff',
                marginHorizontal: 30,
                //height: 75,
                marginTop: 20,
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
                  width: '90%',
                  marginLeft: 0,
                  marginTop: 10,
                  justifyContent: 'space-around'
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
                <TouchableOpacity onPress={() => Choose(el.id)}>
                  {/* <Image
                    style={{
                      width: 20,
                      height: 22,
                      resizeMode: 'contain',
                      marginLeft: 5,
                      tintColor: '#fff'
                    }}
                    source={require('../../Assets/delete.png')}
                  /> */}
                  <MaterialCommunityIcons name='trash-can-outline' size={30} color={el.default === 1 ? '#fff' : '#2173A8'} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', width: '80%', marginLeft: 0, marginTop: 20, justifyContent: 'space-between' }}>
                <Text
                  style={{
                    color: '#fff',
                    //  marginLeft: 50,
                    // marginTop: 10,
                    marginBottom: 20,
                    color: el.default === 1 ? '#fff' : index === i ? '#fff' : '#2173A8',
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
                    color: el.default === 1 ? '#fff' : index === i ? '#fff' : '#2173A8',
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


        {/* <TouchableOpacity
          onPress={() => {
            Payment()
            // Addcard();
            //    props.navigation.navigate('StripePayment');
          }}
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
        ><Text style={{
          color: '#fff',
          fontWeight: '700',
          fontSize: RFValue(18),
          textAlign: 'center', marginTop: 15
        }}>
            Pay Now
          </Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#2173A8',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
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
    borderWidth: 1
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
