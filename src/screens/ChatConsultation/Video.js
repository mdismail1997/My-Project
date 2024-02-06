import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, Searchbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import * as RNLocalize from 'react-native-localize';
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
export const Video = (props) => {
  const [loading, setLoding] = React.useState(false);
  const [alldata, setAlldata] = useState([]);

  const [dataall, setdataAll] = useState([]);
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
      type: 'Video',
    };

    setLoding(true);
    await Apis.bookinglistwithtype(data)

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
        console.log(alldata);
        // console.log(id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log('ll', alldata?.length);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetRequest();

      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title="Video
      Consultation"
        navProps={props.navigation}
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
      {/* <FlatList
        data={data}
        renderItem={renderdata}
        keyExtractor={(item, index) => item.id}
      /> */}
      {/* {alldata?.length < 1 && <Text>ssss</Text>} */}
      {alldata?.length < 1 || alldata == null ?

        (
          <Text style={{ color: '#000', textAlign: 'center', marginTop: 40 }}>No Booking Available</Text>
        ) : (
          alldata?.map((el) => (
            <TouchableOpacity
              style={styles.uncheckborder}
              onPress={() =>
                props.navigation.navigate('Acceptreq', {
                  bookingid: el.booking_id,
                  starttime: new Date(`${el.date},${el.slot_start}`).getTime(),
                })
              }
            >
              <View style={{ justifyContent: 'center', width: '22%' }}>
                <Image
                  style={styles.imgtick}
                  source={{ uri: el.profile_image }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  width: '78%',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#333333',
                    marginLeft: 15,
                    fontSize: RFValue(13),
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}
                >
                  {el.patient_name}
                </Text>
                <Text
                  style={{
                    marginLeft: 15,
                    marginTop: 3,
                    color: '#737373',
                    fontSize: 10,
                  }}
                >
                  {el.date}
                </Text>
                <Text
                  style={{
                    marginLeft: 15,
                    marginTop: 3,
                    color: '#737373',
                    fontSize: 10,
                  }}
                >
                  {el.slot_start} - {el.slot_end}
                </Text>
                {/* <View
              style={{
                flexDirection: 'row',
                width: '50%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 15,
                  height: 20,
                  marginTop: 10,
                  marginLeft: 20,
                }}
              >
                <Button
                  mode="contained"
                  color="#fff"
                  uppercase={false}
                  onPress={() => console.log('Pressed')}
                  contentStyle={{ height: 24 }}
                  labelStyle={{
                    width: 50,
                    color: 'red',
                    fontSize: 10,
                    height: 15,
                  }}
                >
                  Reject
                </Button>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 15,
                  alignSelf: 'flex-end',
                  height: 20,
                  marginLeft: 20,
                }}
              >
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  onPress={() => props.navigation.navigate('Acceptreq')}
                  contentStyle={{ height: 24 }}
                  labelStyle={{
                    width: 50,
                    alignSelf: 'center',
                    color: '#fff',
                    fontSize: 10,
                    height: 15,
                  }}
                >
                  Accept
                </Button>
              </TouchableOpacity>
            </View>*/}
              </View>
              {/* <View
            style={{
              justifyContent: 'space-between',
              // marginLeft: 35,
              alignItems: 'flex-end',
            }}
          >
            <Image
              style={{
                width: 40,
                height: 42,
                resizeMode: 'contain',
                alignSelf: 'flex-end',
                marginTop: 10,
              }}
              source={require('../../Assets/videocall.png')}
            />
          </View> */}
            </TouchableOpacity>
          ))
        )}
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
    // justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'center',
    elevation: 10,
    // height: 95,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
    flexDirection: 'row',
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
    width: '95%',
    height: 80,
    resizeMode: 'contain',
    borderRadius: 10,
    // position:'absolute',
    marginLeft: 5,
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
