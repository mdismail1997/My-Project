import React, { Component, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Linking,
  Alert, ToastAndroid
} from 'react-native';
import { Text, TextInput, Button, Searchbar } from 'react-native-paper';
import { Header2, Header4 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import * as RNLocalize from 'react-native-localize';
import { onCreateTriggerNotification } from '../../components/GetNotification/index';
export const QuickVisitData = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookinglist, setBookingList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoding] = React.useState(false);
  const [alldata, setAlldata] = useState([]);
  const [upcoming, setUpcoming] = React.useState(true);
  const [completed, setCompleted] = React.useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [slotend, setSlotEnd] = useState('');
  const [dataall, setdataAll] = useState([]);
  const [isQuickVisit, setIsQuickVisit] = useState('QuickVisit');
  const onRefresh = async () => {
    setRefreshing(true);
    GetRequest();
    GetComplete();
    setRefreshing(false);
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
  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      doctor_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.quickvisitrequestdata(data)

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
        console.log('uupi=====', alldata);
        // console.log(id);
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
      doctor_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.quickvisitcompleteddata(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.response);
        setdataAll(response.data.data);
        // SetBookingid(response.data.data.booking_id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        console.log(dataall);
        // console.log(bookingid);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetRequest();
      GetComplete();

      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   clearInterval(autoendtimeref.current);
  //   autoendtimeref.current = setInterval(() => {
  //     if (Date.now() >= props.route.params?.endtime + 15000) {
  //       onCreateTriggerNotification();
  //       //props.navigation.navigate('Dashboard');
  //     }
  //   }, 5000);
  //   return () => {
  //     clearInterval(autoendtimeref.current);
  //   };
  // }, [props.navigation, props.route.params?.endtime]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header4 title="Request" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <View
        style={{
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
            onPress={() => {
              setCompleted(true), setUpcoming(false);
            }}
            // onPress={() => {
            //   props.navigation.navigate('Completed');
            // }}
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
            onPress={() => props.navigation.navigate('Rejected')}
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
            alldata?.map((el) => (
              <View style={styles.uncheckborder}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('ppp', el.booking_id),
                      props.navigation.navigate('ShowQuickVisitData', {
                        bookingid: el.booking_id,
                      });
                  }}
                >
                  <Image
                    style={styles.imgtick}
                    source={{
                      uri: el.profile_image,
                    }}
                  />

                  <Text
                    style={{
                      color: '#333333',
                      marginLeft: 90,
                      marginTop: 5,
                      //      position: 'absolute',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}
                  >
                    {el.patient_name}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text
                      style={{
                        color: '#333333',
                        marginLeft: 90,
                        //  marginTop: 33,
                        fontSize: 10,
                        //   position: 'absolute',
                      }}
                    >
                      {el.consultation_type}
                    </Text>
                    <Text
                      style={{
                        color: '#2173A8',
                        marginLeft: 10,
                        // marginTop: 33,
                        fontSize: 10,
                      }}
                    >
                      Schedule
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginLeft: 90,
                      marginTop: 5,
                      color: '#737373',
                      fontSize: 10,
                    }}
                  >
                    {el.date}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 90,
                      marginTop: 5,
                      color: '#737373',
                      fontSize: 10,
                    }}
                  >
                    {el.slot_start} - {el.slot_end}
                  </Text>
                  <View>
                    {el.consultation_type === 'Chat' ? (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                          marginTop: -47,
                          marginRight: 20,
                        }}
                        source={require('../../Assets/chatbox.png')}
                      />
                    ) : el.consultation_type === 'Audio' ? (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                          marginTop: -47,
                          marginRight: 20,
                        }}
                        source={require('../../Assets/voicecall.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                          marginTop: -47,
                          marginRight: 20,
                        }}
                        source={require('../../Assets/videocall.png')}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))
          :
          dataall?.length < 1 || dataall == null ?
            (
              <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>No Appointment Available</Text>
            ) :
            dataall.map((el) => (
              <View style={styles.uncheckborder}>
                <TouchableOpacity
                // onPress={() =>
                //   props.navigation.navigate('DoctorChat', {
                //     bookingid: el.booking_id,
                //   })
                // }
                >
                  <Image
                    style={styles.imgtick}
                    source={{
                      uri: el.profile_image,
                    }}
                  />

                  <Text
                    style={{
                      color: '#333333',
                      marginLeft: 90,
                      //  marginTop: 10,
                      //   position: 'absolute',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}
                  >
                    {el.patient_name}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text
                      style={{
                        color: '#333333',
                        marginLeft: 92,
                        // marginTop: 13,
                        fontSize: 10,
                        // position: 'absolute',
                      }}
                    >
                      {el.consultation_type}
                    </Text>
                    {/* <View style={{ flexDirection: 'row' }}> */}
                    <Text
                      style={{
                        color: '#2173A8',
                        marginLeft: 10,
                        //    marginTop: 13,
                        fontSize: 10,
                      }}
                    >
                      Schedule
                    </Text>
                  </View>
                  {/* <TouchableOpacity
                      style={{
                        color: '#333333',
                        marginLeft: 180,
                        // marginTop: 33,
                        fontSize: 10,
                        position: 'absolute',
                        backgroundColor: '#2173A8',
                        height: 23,
                        marginTop: 30,
                        width: 84,
                        borderRadius: 10,
                      }}
                      onPress={() =>
                        el.order === 'Order  Generated'
                          ? Linking.openURL(el.order_path)
                          : // : Linking.openURL(prescription)
                            props.navigation.navigate('Order', {
                              bookingid: el.booking_id,
                            })
                      }
                    >
                      <Text
                        style={
                          el.order === 'Order  Generated'
                            ? styles.textselect
                            : styles.textunselect
                        }
                      >
                        {el.order}
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                  <Text
                    style={{
                      marginLeft: 93,
                      marginTop: 5,
                      color: '#737373',
                      fontSize: 10,
                    }}
                  >
                    {el.date}
                  </Text>
                  {/* <Text
                  style={{
                    color: '#2173A8',
                    marginLeft: 120,
                    marginTop: 3,
                    fontSize: 10,
                  }}
                >
                  Schedule
                </Text> */}
                  <Text
                    style={{
                      marginLeft: 93,
                      marginTop: 5,
                      color: '#737373',
                      fontSize: 10,
                    }}
                  >
                    {el.slot_start} - {el.slot_end}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{
                        color: '#333333',
                        marginLeft: 90,
                        // marginTop: 33,
                        fontSize: 10,
                        //   position: 'absolute',
                        // backgroundColor: '#2173A8',
                        height: 23,
                        //  marginTop: 30,
                        //  width: 84,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        console.log('====>>', isQuickVisit);
                        el.status === 'Pending Prescription'
                          ? props.navigation.navigate('PatientPrescription', {
                            bookingid: el.booking_id,
                            quickvisit: isQuickVisit,
                          }) :
                          el.status === "Prescription: NA" ? ToastAndroid.showWithGravityAndOffset(
                            'Consultation not attempted',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                          )

                            : // : Linking.openURL(prescription)
                            GetPrescription(el.booking_id);
                      }}
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

                    {/* 
                    <TouchableOpacity
                      style={{
                        color: '#333333',
                        marginLeft: 180,
                        // marginTop: 33,
                        fontSize: 10,
                        position: 'absolute',
                        // backgroundColor: '#2173A8',
                        height: 23,
                        //  marginTop: 30,
                        //    width: 84,
                        borderRadius: 10,
                      }}
                      onPress={() =>
                        el.order === 'Order  Generated'
                          ? Linking.openURL(el.order_path)
                          : // : Linking.openURL(prescription)
                            props.navigation.navigate('Order', {
                              bookingid: el.booking_id,
                            })
                      }
                    >
                      <Text
                        style={
                          el.order === 'Order  Generated'
                            ? styles.textselect
                            : styles.textunselect
                        }
                      >
                        {el.order}
                      </Text>
                    </TouchableOpacity>*/}
                  </View>
                  <View>
                    {el.consultation_type === 'Chat' ? (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                          marginTop: -47,
                          marginRight: 20,
                        }}
                        source={require('../../Assets/chatbox.png')}
                      />
                    ) : el.consultation_type === 'Audio' ? (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                          marginTop: -47,
                          marginRight: 20,
                        }}
                        source={require('../../Assets/voicecall.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 40,
                          height: 42,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                          marginTop: -47,
                          marginRight: 20,
                        }}
                        source={require('../../Assets/videocall.png')}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        <View style={{ marginTop: 20 }}></View>
      </ScrollView>
    </SafeAreaView>
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

    alignSelf: 'flex-start',
    elevation: 5,
  },

  uncheckborder: {
    // justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignSelf: 'center',
    elevation: 5,
    // height: 100,
    marginTop: 10,
    borderRadius: 10,
    width: '90%',
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
    width: 50,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
    marginLeft: 20,
    marginTop: 10,
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
    //  marginLeft: 72,
    marginTop: 5,
    fontSize: 10,
    position: 'absolute',
    marginLeft: 3
  },
  unselect: {
    color: 'red',
    // marginLeft: 72,
    marginTop: 5,
    fontSize: 10,
    position: 'absolute',
    marginLeft: 3
  },
  textselect: {
    color: '#2173A8',
    marginLeft: 20,
    textAlign: 'center',
    fontSize: 10,
    // width: 90,
    //  marginTop: 5,
  },
  textunselect: {
    color: 'red',
    marginLeft: 20,
    textAlign: 'center',
    fontSize: 10,
    // width: 90,
    // paddingVertical: 3,
  },
});
