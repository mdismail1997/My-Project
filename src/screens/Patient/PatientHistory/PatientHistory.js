import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Text, TextInput, Button, Searchbar } from 'react-native-paper';
import { Header3 } from '../../../components/Header/Header';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
export const PatientHistory = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [alldata, setAlldata] = React.useState([]);
  const [dataall, setDataall] = React.useState([]);
  const [datavoice, setDataVoice] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [msg, setMsg] = React.useState(true);
  const [video, setVideo] = React.useState(false);
  const [voice, setVoice] = React.useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [unseencount, SetUnseenCount] = React.useState();
  const getunseennotification = async () => {
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

  const getmsghistory = async () => {
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
    console.log(data);
    setLoding(true);
    Apis.patientmsghistory(data)

      .then((response) => {
        console.warn(response.data);
        setAlldata(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };

  const getvideohistory = async () => {
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
    console.log(data);
    setLoding(true);
    Apis.patientvideohistory(data)

      .then((response) => {
        console.warn(response.data);
        setDataall(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  console.log('select----', dataall);
  const getavoicehistory = async () => {
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
    console.log(data);
    setLoding(true);
    Apis.patientvoicehistory(data)

      .then((response) => {
        console.warn(response.data);
        setDataVoice(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getmsghistory();
      getvideohistory();
      getavoicehistory();
      getunseennotification();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.navigation]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3
        title="History"
        navProps={props.navigation}
        unseencount={unseencount?.toString()}
      />

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
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            bottom: 10,
            //  width: 120,
            borderRadius: 5,
            width: '27%',
            borderColor: '#2173A8',
            borderWidth: 1,
          }}
        >
          <Button
            mode="contained"
            // color="#2173A8"
            uppercase={false}
            style={{ alignItems: 'center' }}
            icon="message-text"
            onPress={() => (setMsg(true), setVideo(false), setVoice(false))}
            contentStyle={{ height: 40, justifyContent: 'center' }}
            color={msg ? '#2173A8' : '#fff'}
            labelStyle={msg ? styles.selecttext : styles.selectnottext}
          >
            Chat
          </Button>
        </View>
        <View
          style={{
            marginTop: 20,
            borderColor: '#2173A8',
            borderWidth: 1,
            bottom: 10,
            // width: 115,
            borderRadius: 5,
            width: '27%',
          }}
        >
          <Button
            mode="contained"
            uppercase={false}
            icon="phone-forward"
            // onPress={() => props.navigation.navigate('PatientVoicecall')}
            onPress={() => (setMsg(false), setVideo(false), setVoice(true))}
            contentStyle={{ height: 40 }}
            color={voice ? '#2173A8' : '#fff'}
            labelStyle={voice ? styles.selecttext : styles.selectnottext}
          >
            Audio
          </Button>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            borderColor: '#2173A8',
            borderWidth: 1,
            bottom: 10,
            // width: 115,
            borderRadius: 5,
            width: '27%',
          }}
        >
          <Button
            mode="contained"
            uppercase={false}
            icon="video-outline"
            // onPress={() => props.navigation.navigate('VoiceCallEnd')}
            onPress={() => (setMsg(false), setVideo(true), setVoice(false))}
            contentStyle={{ height: 40 }}
            color={video ? '#2173A8' : '#fff'}
            labelStyle={video ? styles.selecttext : styles.selectnottext}
          >
            Video
          </Button>
        </View>
      </View>
      <ScrollView style={{ marginBottom: 10 }}>
        {msg === true && video === false && voice === false
          ? alldata?.length < 1 || alldata == null ?
            (
              <Text style={{ color: '#000', textAlign: 'center', marginTop: 20 }}>No History Available</Text>
            ) : (
              alldata?.map((el, i) => (
                <View style={styles.uncheckborder}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('CompletedChat', {
                        bookingid: el.id,
                        id: el.doctor_id,
                      })
                    }
                  >
                    <Image
                      style={styles.imgtick}
                      source={{ uri: el.doctor_image }}
                    />
                    {/* // source={el.profile_image} */}
                    <Text
                      style={{
                        color: '#333333',
                        marginLeft: 100,
                        marginTop: 10,
                        //  position: 'absolute',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}
                    >
                      {el.doctor_name}
                    </Text>
                    <Text
                      style={{
                        color: '#333333',
                        marginLeft: 100,
                        marginTop: 5,
                        fontSize: 10,
                      }}
                    >
                      {el.slot_start} - {el.slot_end}
                    </Text>
                    <Text
                      style={{
                        color: '#333333',
                        marginLeft: 100,
                        marginTop: 5,
                        fontSize: 10,
                      }}
                    >
                      {el.date}
                    </Text>
                    <Text
                      style={{
                        color: '#333333',
                        marginLeft: 100,
                        marginTop: 5,
                        fontSize: 10,
                        marginBottom: 10,
                      }}
                    >
                      {el.speciality}
                    </Text>
                    {/* <View>
                    <Image
                      style={{
                        width: 40,
                        height: 42,
                        resizeMode: 'contain',
                        alignSelf: 'flex-end',
                        marginTop: -50,
                        marginRight: 20,
                      }}
                      source={require('../../../Assets/rightarrow.png')}
                    />
                  </View> */}
                  </TouchableOpacity>
                </View>
              )))
          : msg === false && video === true && voice === false
            ?
            dataall?.length < 1 || dataall == null ?
              (
                <Text style={{ color: '#000', textAlign: 'center', marginTop: 20 }}>No History Available</Text>
              ) : (
                dataall?.map((el, i) => (
                  <View style={styles.uncheckborder}>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('CompletedChat', {
                          bookingid: el.id,
                          id: el.doctor_id,
                        })
                      }
                    >
                      <Image
                        style={styles.imgtick}
                        source={{ uri: el.doctor_image }}
                      />
                      {/* // source={el.profile_image} */}
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 10,
                          //    position: 'absolute',
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}
                      >
                        {el.doctor_name}
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}
                      >
                        {el.slot_start} - {el.slot_end}
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}
                      >
                        {el.date}
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 5,
                          fontSize: 10,
                          marginBottom: 10,
                        }}
                      >
                        {el.speciality}
                      </Text>
                      {/* <View>
                    <Image
                      style={{
                        width: 40,
                        height: 42,
                        resizeMode: 'contain',
                        alignSelf: 'flex-end',
                        marginTop: -50,
                        marginRight: 20,
                      }}
                      source={require('../../../Assets/rightarrow.png')}
                    />
                  </View> */}
                    </TouchableOpacity>
                  </View>
                )))
            :
            datavoice?.length < 1 || datavoice == null ?
              (
                <Text style={{ color: '#000', textAlign: 'center', marginTop: 20 }}>No History Available</Text>
              ) : (
                datavoice?.map((el, i) => (
                  <View style={styles.uncheckborder}>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('CompletedChat', {
                          bookingid: el.id,
                          id: el.doctor_id,
                        })
                      }
                    >
                      <Image
                        style={styles.imgtick}
                        source={{ uri: el.doctor_image }}
                      />
                      {/* // source={el.profile_image} */}
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 10,
                          //  position: 'absolute',
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}
                      >
                        {el.doctor_name}
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}
                      >
                        {el.slot_start} - {el.slot_end}
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}
                      >
                        {el.date}
                      </Text>
                      {/* <Text
                    style={{
                      color: '#333333',
                      marginLeft: 100,
                      marginTop: 5,
                      fontSize: 10,
                      //  marginBottom: 20,
                    }}
                  >
                    {el.speciality}
                  </Text> */}
                      <Text
                        style={{
                          color: '#333333',
                          marginLeft: 100,
                          marginTop: 5,
                          fontSize: 10,
                          paddingBottom: 10
                        }}
                      >
                        {el.speciality}
                      </Text>
                      {/* <View>
                    <Image
                      style={{
                        width: 35,
                        height: 40,
                        resizeMode: 'contain',
                        position: "absolute",
                        bottom: 10,
                        right: 15
                      }}
                      source={require('../../../Assets/rightarrow.png')}
                    />
                  </View> */}
                    </TouchableOpacity>
                  </View>
                ))
              )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({

  uncheckborder: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'center',
    // elevation: 5,
    // height: 100,
    marginTop: 10,
    borderRadius: 10,
    width: '90%',
    // justifyContent: 'center',
    // alignItems: 'center'
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
    marginVertical: 10,
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
  selecttext: { color: '#fff', fontSize: RFValue(10), right: 3, bottom: 1 },
  selectnottext: {
    color: '#2173A8',
    fontSize: RFValue(10),
    right: 3,
    bottom: 1,
  },
});
