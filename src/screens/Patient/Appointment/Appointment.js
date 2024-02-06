import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Linking, Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import { Text, TextInput, Button, Searchbar, Modal, IconButton, Snackbar, Badge } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Apis from '../../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header2, Header3, Header5 } from '../../../components/Header/Header';
import * as RNLocalize from 'react-native-localize';
import { RFValue } from 'react-native-responsive-fontsize';
//import { onCreateTriggerNotification } from '../../../components/GetNotification/index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export const Appointment = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshing, setRefreshing] = useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoding] = useState(false);
  const [bookingid, SetBookingid] = useState([]);
  const [upcoming, setUpcoming] = React.useState(true);
  const [completed, setCompleted] = React.useState(false);
  const [dataall, setdataAll] = useState([]);
  const [time, setTime] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [senderid, setSenderId] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [buttonvisible, setButtonVisible] = React.useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [loginSuccess, setLoginSuccess] = React.useState({
    visible: false,
    message: '',
  });
  const [unseencount, SetUnseenCount] = React.useState();
  const onRefresh = async () => {
    setRefreshing(true);
    GetRequest();
    setRefreshing(false);
    getunseennotification();
    GetComplete();
  };
  const getunseennotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      patient_id: user_id,
    };

    setLoding(true);
    await Apis.unseenNotification(data)

      .then((response) => {
        console.warn('unseencount', response.data);
        setLoding(false);
        SetUnseenCount(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      patient_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data==', data)
    setLoding(true);
    await Apis.acceptbooking(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.data);
        setAlldata(response.data.data);
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);

        const sss = Date.now();
        setTime(response.data.data.slot_start);
        SetBookingid(response.data.data.booking_id);
        console.log(alldata);
        console.log('time----', Date.now() + 20000);
        console.log('bid=====', sss);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const GetComplete = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      patient_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.completedlist(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.data);
        setdataAll(response.data.data);
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        SetBookingid(response.data.data.booking_id);
        console.log(dataall);
        // console.log('bid=====', bookingid);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const GetPrescription = async (bookingid) => {
    try {
      setLoding(true);
      const token = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      if (userid) {
        const user_id = JSON.parse(userid);

        console.log('user id =====>>>>', user_id);
        console.log('token123=', token);
        const data = {
          booking_id: bookingid,
        };
        console.log('id---', data);

        const response = await Apis.getprescription(data);
        console.warn(response.data);
        setLoding(false);
        const pres = response.data.prescription;
        Linking.openURL(pres);
      } else {
        setLoding(false);
      }
    } catch (error) {
      setLoding(false);
      console.log(error);
    }
  };
  const SendReason = async () => {
    // if(reason==='')
    { }
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: senderid,
      reason: reason
    };

    setLoding(true);
    await Apis.cancelbooking(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.data);
        setReason('');
        setLoginSuccess({
          visible: true,
          message: 'Booking Cancelled Successfully',
        });
        setVisible(false);
        setButtonVisible(true)
        GetRequest();
        // setTimeout(() => {


        // }, 2500);
      })
      .catch((error) => {
        console.error(error.response.data);
        setError((data) => ({
          ...data,
          iserror: true,
          message: error.response.data.errors.reason,
        }));
        setLoding(false);
      });
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' })),
      setLoginSuccess({ visible: false, message: '' });
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetRequest();
      GetComplete();
      getunseennotification()
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   onCreateTriggerNotification;
  // }, []);
  const Choose = (_id) => {

    Alert.alert(
      'Choose',
      //body
      'Are you sure you want to cancel appointment?',

      [
        { text: 'Yes', onPress: () => { setVisible(true), setSenderId(_id) } },
        // { text: 'Gallery', onPress: () => GalleryPicker() },
        { text: 'No', onPress: () => null },
      ],
      { cancelable: true }
      //clicking out side of alert will not cancel
    );
  };
  console.log('unseencount===>>', unseencount)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3
        title="Appointment"
        navProps={props.navigation}
        unseencount={unseencount?.toString()}
      />
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{ marginLeft: '-1%' }}
        >
          <Text
            style={{
              fontSize: 20,
              //  fontFamily: 'Roboto-Bold',
              color: '#333333',
            }}
          >
            Appointment
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginRight: '5%' }}>
          {/* <TouchableOpacity style={{ width: 30 }}>
        <AntDesign name="heart" size={30} color="#000" />
      </TouchableOpacity> */}

      {/* <TouchableOpacity
            style={{ alignSelf: 'flex-end', flexDirection: 'row' }}
            onPress={() => props.navProps.navigate('Notification')}
          >
            <MaterialCommunityIcons
              name="bell"
              color="#2173A8"
              size={30}
              solid
            //    style={{ marginTop: -5 }}
            />

            <Badge style={{
              backgroundColor: 'red',
              marginTop: -20,
              marginRight: 10,
              color: '#fff',
              fontWeight: 'bold',
            }} size={15}>
              {unseencount}
            </Badge>
          </TouchableOpacity>
        </View>
      </View> */}
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
        visible={loginSuccess.visible}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#30D13B', zIndex: 500, marginbottom: 20 }}
        duration={2000}
      >
        {loginSuccess.message}
      </Snackbar>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 500, marginbottom: 20 }}
      >
        {error.message}
      </Snackbar>
      <View
        style={{
          marginTop: -5,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}
      >
        <View
          style={{
            marginTop: 30,
            bottom: 20,
            width: '40%',
            borderRadius: 5,
            marginLeft: 20,
            borderColor: '#2173A8',
            borderWidth: 1,
          }}
        >
          <Button
            mode="contained"
            color={upcoming ? '#2173A8' : '#fff'}
            uppercase={false}
            onPress={() => {
              setCompleted(false), setUpcoming(true);
            }}
            contentStyle={{ paddingVertical: 5 }}
            labelStyle={upcoming ? styles.selecttext : styles.selectnottext}
          >
            Upcoming
          </Button>
        </View>
        <View
          style={{
            marginTop: 30,
            borderColor: '#2173A8',
            borderWidth: 1,
            bottom: 20,
            width: '40%',
            borderRadius: 5,
            marginRight: 20,
          }}
        >
          <Button
            mode="contained"
            color={completed ? '#2173A8' : '#fff'}
            uppercase={false}
            // onPress={() => props.navigation.navigate('CompletedList')}
            onPress={() => {
              setCompleted(true), setUpcoming(false);
            }}
            contentStyle={{ paddingVertical: 5 }}
            labelStyle={completed ? styles.selecttext : styles.selectnottext}
          >
            Completed
          </Button>
        </View>
        {/* <View
          style={{
            marginTop: 50,
            borderColor: 'red',
            borderWidth: 1,
            bottom: 20,
            width: '30%',
            borderRadius: 5,
          }}
        >
          <Button
            mode="contained"
            color="#fff"
            uppercase={false}
            onPress={() => console.log('Pressed')}
            contentStyle={{ paddingVertical: 3 }}
            labelStyle={{ color: '#2173A8', fontSize: 15 }}
          >
            Rejected
          </Button>
        </View> */}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {upcoming === true && completed === false
          ?
          alldata?.length < 1 || alldata == null ?
            (
              <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>No Appointment Available</Text>
            ) :
            alldata?.map((el, i) => (
              <View style={styles.uncheckborder}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('0000', el.status);
                    console.log(new Date(`${el.date},${el.slot_start}`).getTime())
                    el.status === 3 ? alert('Appointment Cancel')
                      :
                      el.payment_status != 2 ? props.navigation.navigate('Startchat', {
                        bookingid: el.booking_id,
                        starttime: new Date(`${el.date},${el.slot_start}`).getTime(),
                        app_type: el.app_type
                        //new Date(`${date},${endtime}`).getTime()
                      }) : alert('Payment not completed')
                  }

                  }
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Image
                    style={styles.imgtick}
                    source={{ uri: el.profile_image }}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '70%',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#333333',
                        paddingTop: 10,
                        fontSize: RFValue(14),
                        fontWeight: 'bold',
                        width: '70%',
                        marginLeft: 10,
                      }}
                    >
                      {el.doctor_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginTop: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: '#333333',

                          fontSize: RFValue(10),
                        }}
                      >
                        {el.consultation_type}
                      </Text>
                      <Text
                        style={{
                          color: '#2173A8',
                          fontSize: RFValue(10),
                        }}
                      >
                        - Schedule
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#737373',
                        fontSize: RFValue(10),
                        marginTop: 5,
                      }}
                    >
                      {el.date}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#737373',
                        fontSize: RFValue(10),
                        marginTop: 5,
                      }}
                    >
                      {el.slot_start} - {el.slot_end}
                    </Text>
                    {el.app_type === "Q" ?
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#2173A8',
                          fontSize: RFValue(10),
                          marginTop: 5,
                        }}
                      >
                        Quick Visit Booking
                      </Text>
                      : null}
                    <Text

                      style={el.payment_status === 1 ? styles.success : el.payment_status === 2 ? styles.falied : styles.pending}
                    >
                      {el.payment_status === 1 ? 'Payment Success' : el.payment_status === 2 ? "Payment Failed" : 'Free'}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      if (el.status === 3) { alert('Appointment already cancelled.') }
                      else if (
                        Date.now() > new Date(`${el.date},${el.slot_start}`).getTime() - 600000) { Alert.alert('Cancellation is not possible') }
                      else { Choose(el.booking_id) }
                    }}
                      style={{ backgroundColor: 'red', width: '55%', marginLeft: 10, borderRadius: 10, marginTop: 5, marginBottom: 10 }} >
                      {el.status === 3 ? <Text
                        style={{

                          color: '#fff',
                          fontSize: RFValue(10),
                          marginTop: 5,
                          paddingBottom: 5,
                          textAlign: 'center'
                        }}
                      >
                        Cancelled
                      </Text> :
                        el.payment_status != 2 ?
                          <Text
                            style={{

                              color: '#fff',
                              fontSize: RFValue(10),
                              marginTop: 5,
                              paddingBottom: 5,
                              textAlign: 'center'
                            }}
                          >
                            Cancel Appointment
                          </Text>
                          : null
                      }
                    </TouchableOpacity>

                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        right: 5,
                      }}
                    >
                      {el.consultation_type === 'Chat' ? (
                        <Image
                          style={{
                            width: 40,
                            height: 42,
                            resizeMode: 'contain',
                          }}
                          source={require('../../../Assets/chatbox.png')}
                        />
                      ) : el.consultation_type === 'Audio' ? (
                        <Image
                          style={{
                            width: 40,
                            height: 42,
                            resizeMode: 'contain',
                          }}
                          source={require('../../../Assets/voicecall.png')}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 40,
                            height: 42,
                            resizeMode: 'contain',
                          }}
                          source={require('../../../Assets/videocall.png')}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          :
          dataall?.length < 1 || dataall == null ?
            (
              <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>No Appointment Available</Text>
            ) :
            dataall.map((el, i) => (
              <View style={styles.uncheckborder}>
                <TouchableOpacity
                  // onPress={() =>
                  //   props.navigation.navigate('CompletedChat', {
                  //     bookingid: el.booking_id,
                  //   })
                  // }
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Image
                    style={styles.imgtick}
                    source={{ uri: el.profile_image }}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '70%',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#333333',
                        paddingTop: 10,
                        fontSize: RFValue(14),
                        fontWeight: 'bold',
                        marginLeft: 10,
                      }}
                    >
                      {el.doctor_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginTop: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: '#333333',

                          fontSize: RFValue(10),
                        }}
                      >
                        {el.consultation_type}
                      </Text>
                      <Text
                        style={{
                          color: '#2173A8',
                          fontSize: RFValue(10),
                        }}
                      >
                        - Schedule
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#737373',
                        fontSize: RFValue(10),
                        marginTop: 5,
                      }}
                    >
                      {el.date}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#737373',
                        fontSize: RFValue(10),
                        marginTop: 5,
                      }}
                    >
                      {el.slot_start} - {el.slot_end}
                    </Text>
                    {el.app_type === "Q" ?
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#2173A8',
                          fontSize: RFValue(10),
                          marginTop: 5,
                        }}
                      >
                        Quick Visit Booking
                      </Text>
                      : null}
                    <Text

                      style={el.payment_status === 1 ? styles.success : el.payment_status === 2 ? styles.falied : styles.pending}
                    >
                      {el.payment_status === 1 ? 'Payment Success' : el.payment_status === 2 ? "Payment Failed" : 'Free'}
                    </Text>
                    <TouchableOpacity
                      style={{
                        // backgroundColor: '#000',
                        color: '#2173A8',
                        marginTop: 5,
                        fontSize: 10,
                        marginLeft: 10,
                      }}
                      onPress={() =>
                        el.status === 'Pending Prescription'
                          ?
                          ToastAndroid.showWithGravityAndOffset(
                            'No prescription yet',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                          )
                          : // : Linking.openURL(prescription)
                          el.status === "Prescription: NA" ? ToastAndroid.showWithGravityAndOffset(
                            'Consultation not attempted',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                          )
                            :
                            GetPrescription(el.booking_id)
                      }
                    >
                      <Text
                        style={
                          el.status === 'Pending Prescription' || el.status === 'Prescription: NA'
                            ? styles.unselect
                            : styles.select
                        }
                      >
                        {el.status}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: 5,
                    }}
                  >
                    {el.consultation_type === 'Chat' ? (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                        }}
                        source={require('../../../Assets/chatbox.png')}
                      />
                    ) : el.consultation_type === 'Audio' ? (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                        }}
                        source={require('../../../Assets/voicecall.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                        }}
                        source={require('../../../Assets/videocall.png')}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}


      </ScrollView>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
      //  style={{ width: 400, }}
      >
        <View
          style={{
            // alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',

            // padding: 10,
            width: 300,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            // height: 300,
            paddingBottom: 20,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="#fff"
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#2173A8',
              borderRadius: 50,
            }}
            onPress={() => {
              setVisible(false);
            }}
          />
          {/* <View style={{flexDirection:'row'}}> */}
          {/* {alldata?.map((el, i) => (
            <View>

              <Text
                style={{
                  //  color: '#333333',
                  marginLeft: 20,
                  marginTop: 10,
                  // width: '68%',
                  alignSelf: 'flex-start',
                  color: '#2173A8',
                }}
              >
                <Text style={{ color: '#000', width: '10%' }}>Date{'    '}: </Text>
                {el.date}
              </Text>
              <Text
                style={{
                  //  color: '#333333',
                  marginLeft: 20,
                  marginTop: 10,
                  width: '68%',
                  alignSelf: 'flex-start',
                  color: '#2173A8',
                }}
              >
                <Text style={{ color: '#000', width: '5%' }}>Slot-Time : </Text>
                {el.slot_start} - {el.slot_end}
              </Text>
            </View>
          ))} */}
          <TextInput
            mode="outlined"
            outlineColor={'#2173A8'}
            label="Reason for cancel*"
            placeholder=""
            maxLength={60}
            value={reason}
            onChangeText={(text) =>
              setReason(text)
            }
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
            style={{
              marginTop: 20,
              borderRadius: 50,
              elevation: 0,
              marginHorizontal: 20,
              backgroundColor: '#fff',
            }} />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              width: '85%',
              backgroundColor: '#2173A8',
              marginTop: 20,
            }}
            onPress={() => SendReason()}
          >
            <Text
              style={{
                textAlign: 'center',
                padding: 20,
                fontSize: RFValue(15),
                color: '#fff',
              }}
            >
              Submit Reason
            </Text>
          </TouchableOpacity>
          {/* </View> */}
        </View>
      </Modal>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 20,
    borderRadius: 10,
    height: 50,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'flex-start',
    elevation: 15,
  },

  uncheckborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 5,
    // height: 90,
    marginTop: 10,
    borderRadius: 10,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1
  },
  img: {
    width: 25,
    height: 32,
    resizeMode: 'contain',
    right: 5,
    alignSelf: 'center',
    marginRight: 30,
  },
  text: {
    marginTop: 15,
    color: '#737373',
    fontSize: 15,
    marginRight: 150,
  },
  imgtick: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    // alignSelf: 'flex-start',
    borderRadius: 10,
    marginLeft: 10,
    alignSelf: 'center',
    borderWidth: 1, borderColor: '#ddd'
  },
  imgtick2: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 5,
  },
  text1: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 100,
    marginLeft: 30,
  },
  text2: {
    color: '#737373',
    fontSize: 15,
    marginTop: 20,
    marginLeft: 30,
  },
  selecttext: { color: '#fff', fontSize: 13 },
  selectnottext: { color: '#2173A8', fontSize: 13 },
  select: {
    color: 'blue',

    fontSize: RFValue(10),
    paddingBottom: 10,
  },
  unselect: {
    color: 'red',

    fontSize: RFValue(10),
    paddingBottom: 10,
  },
  pending: {
    marginLeft: 10,
    color: '#2173A8',
    fontSize: RFValue(12),
    marginTop: 5,
  },
  success: {
    marginLeft: 10,
    color: 'green',
    fontSize: RFValue(10),
    marginTop: 5,
  },
  falied: {
    marginLeft: 10,
    color: 'red',
    fontSize: RFValue(10),
    marginTop: 5,
  },
});
