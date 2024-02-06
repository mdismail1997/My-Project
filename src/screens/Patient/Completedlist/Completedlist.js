import React, { useState, useEffect } from 'react';
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
import Spinner from 'react-native-loading-spinner-overlay';
import * as Apis from '../../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header2, Header3, Header5 } from '../../../components/Header/Header';
import * as RNLocalize from 'react-native-localize';
export const CompletedList = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query) => setSearchQuery(query);
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoding] = useState(false);
  const [bookingid, SetBookingid] = useState([]);
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

    setLoding(true);
    await Apis.completedlist(data)

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
        SetBookingid(response.data.data.booking_id);
        console.log(alldata);
        console.log('bid=====', bookingid);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    GetRequest();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3 title="Appointment" navProps={props.navigation} />
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
            marginTop: 50,
            bottom: 20,
            width: '40%',
            borderRadius: 10,
            marginLeft: 20,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={() => props.navigation.navigate('Appointment')}
            contentStyle={{ paddingVertical: 5 }}
            labelStyle={{ color: '#fff', fontSize: 13 }}
          >
            Upcoming
          </Button>
        </View>
        <View
          style={{
            marginTop: 50,
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
            color="#fff"
            uppercase={false}
            onPress={() => console.log('Pressed')}
            contentStyle={{ paddingVertical: 4 }}
            labelStyle={{ color: '#2173A8', fontSize: 13 }}
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
      <ScrollView>
        {alldata.map((el, i) => (
          <View style={styles.uncheckborder}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('CompletedChat', {
                  bookingid: el.booking_id,
                })
              }
            >
              <Image
                style={styles.imgtick}
                source={{ uri: el.profile_image }}
              />

              <Text
                style={{
                  color: '#333333',
                  marginLeft: 90,
                  marginTop: 10,
                  position: 'absolute',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                {el.doctor_name}
              </Text>
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 92,
                  marginTop: 33,
                  fontSize: 10,
                  position: 'absolute',
                }}
              >
                {el.consultation_type}
              </Text>
              <Text
                style={{
                  color: '#2173A8',
                  marginLeft: 120,
                  marginTop: 33,
                  fontSize: 10,
                }}
              >
                - Schedule
              </Text>
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
                  marginTop: 3,
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
                    source={require('../../../Assets/chatbox.png')}
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
                    source={require('../../../Assets/voicecall.png')}
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
                    source={require('../../../Assets/videocall.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
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
    elevation: 15,
    height: 90,
    marginTop: 20,
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
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
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
});
