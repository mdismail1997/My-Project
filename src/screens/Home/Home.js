import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  RefreshControl,
  Pressable,
  PanResponder
} from 'react-native';
import {
  Card,
  Paragraph,
  Title,
  Button,
  Badge,
  Caption,
  Avatar,
} from 'react-native-paper';
import { Header3, Header4 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as RNLocalize from 'react-native-localize';
import { ScrollView } from 'react-native-gesture-handler';

export const Home = (props) => {
  React.useEffect(() => {
    getdata();
    getunseennotification();
  }, []);

  const [name, setName] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [loading, setLoding] = React.useState(false);
  const [alldata, setAlldata] = useState([]);
  const [urgentdata, setUrgentdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [id, setId] = React.useState();
  const [enabled, setEnabled] = useState(true);
  const [docId, setDocId] = React.useState('')
  const [pName, setPname] = useState('')
  const [unseencount, SetUnseenCount] = React.useState();
  const [counrtyname, setCountryname] = useState('');
  const onRefresh = async () => {
    setRefreshing(true);
    GetRequest();
    getdata();
    GetUrgent();
    getunseennotification();
    setRefreshing(false);
  };


  const scrollViewRef = useRef(null);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: () => false,
    })
  ).current;

  const getunseennotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      doctor_id: user_id,
    };

    setLoding(true);
    await Apis.doctorunseenNotification(data)

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

  const getdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    setDocId(user_id)
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.doctorprofileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setId(response.data.response.id);
        SetImage(response.data.response.profile_image);
        setCountryname(response.data.response.country)
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
      doctor_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.bookinglisthomepage(data)

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
  const GetUrgent = async () => {
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
    await Apis.quickvisitappoinment(data)

      .then((response) => {
        console.warn('--000', response.data);
        setLoding(false);
        console.log(response.data.data);
        setUrgentdata(response.data.data);
        // setPname(response.data.data[0])
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        console.log(response.data.data);
        // console.log(id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  useEffect(() => {
    reRenderSomething = props.navigation.addListener('focus', async () => {
      GetRequest()
    });
  }, [])
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();
      GetUrgent();
      getunseennotification();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView
        style={{ marginBottom: 10, backgroundColor: '#fff' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 50, }}>


          <TouchableOpacity
            style={{
              marginLeft: 10,

              borderRadius: 55,
              height: 85,
              width: 85,

              borderColor: '#000',
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => props.navigation.navigate('EditProfile', { counrtyname: counrtyname })}
          >
            <Image
              style={{
                borderRadius: 40,
                height: 80,
                width: 80,
                alignSelf: 'center',
                resizeMode: 'contain'
                // marginTop: -10,
              }}
              source={{ uri: image }}
            />

            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                borderRadius: 20,
                position: 'absolute',
                left: 60,
                top: 45,
              }}
              onPress={() => props.navigation.navigate('EditProfile', { counrtyname: counrtyname })}
            >
              <Image
                source={require('../../Assets/edit.png')}
                resizeMode={'contain'}
                style={{
                  height: '75%',
                  width: '75%',
                  borderRadius: 10,
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <Text
            style={{
              marginRight: 5,
              // position: 'absolute',

              marginLeft: 8,
              color: '#000',
              fontSize: 20,
              fontWeight: 'bold',
              width: "52%"
            }}
          >
            {name}

          </Text>
          <View
            style={{
              flexDirection: 'row',


            }}
          >
            <TouchableOpacity
              style={{ width: 30 }}
              onPress={() => props.navigation.navigate('DoctorFavourite')}
            >
              <AntDesign name="heart" size={30} color="#2173A8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => props.navigation.navigate('Notification')}
            >
              <MaterialCommunityIcons
                name="bell"
                color="#2173A8"
                size={30}
                solid
                style={{ marginTop: -30, }}
              />
              {/* <Badge
              style={{ backgroundColor: '#fff', marginTop: -27 }}
              size={15}
            >
              1
            </Badge> */}
              <Badge
                style={{
                  backgroundColor: 'red',
                  marginTop: -27,
                  //flexWrap: 'wrap',
                  // alignSelf: 'flex-start',
                  //  alignItems: 'flex-start',
                  // alignContent: 'flex-start',
                  color: '#fff',
                  //justifyContent: 'flex-start',
                  fontWeight: 'bold',
                  // marginRight: "40%"
                }}
                size={15}
              >
                {unseencount}
              </Badge>

            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginTop: -20,
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: '5%' }}
            onPress={() => props.navigation.navigate('Video')}
          >
            <Image source={require('../../Assets/consultation.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() => props.navigation.navigate('Chat')}
          >
            <Image source={require('../../Assets/group1751.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: '5%' }}
            onPress={() => props.navigation.navigate('Voice')}
          >
            <Image source={require('../../Assets/group1752.png')} />
          </TouchableOpacity>
        </View>
        {/* <Caption
          style={{
            margin: 5,
            marginLeft: 20,
            color: '#000',
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Slot Timing
        </Caption> */}

        <Card
          style={{
            marginHorizontal: 10,
            borderColor: '#2173A8',
            borderWidth: 1,
            width: '80%',
            alignSelf: 'center',
            backgroundColor: '#fff',
            marginTop: 10
          }}
        >
          <Card.Content>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => props.navigation.navigate('Slot')}
            >
              <Title style={{ color: '#000' }}> Booking Details</Title>
            </TouchableOpacity>
          </Card.Content>
        </Card>
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', marginLeft: 10, marginTop: 20 }}>Quick Visit Booking List</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ marginRight: 20, paddingBottom: 10 }}
            showsHorizontalScrollIndicator={false}
          >
            {/* <Caption
              style={{
                margin: 5,
                marginLeft: 20,
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Urgent Patient
            </Caption> */}
            {
              urgentdata?.length < 1 || urgentdata == null ?
                (
                  <Text style={{ color: '#000', marginTop: 20, marginBottom: 20, marginLeft: 12 }}>No Data Available</Text>
                ) : (
                  urgentdata?.map((el) => (
                    <TouchableOpacity
                      style={styles.container}
                      onPress={() => {
                        el.consultation_type === 'Video'
                          ? // console.log(new Date(`${el.date},${el.slot_end}`).getTime());
                          // props.navigation.navigate('VideoCall', {
                          //   booking_id: el.booking_id,
                          //   endTime: new Date(
                          //     `${el.date},${el.slot_end}`
                          //   ).getTime(),
                          // })
                          props.navigation.navigate('ShowQuickVisitData', {
                            bookingid: el.booking_id,
                          })
                          :
                          props.navigation.navigate('ShowQuickVisitData', {
                            bookingid: el.booking_id,
                          });
                        //    props.navigation.navigate('ChatMessage',{
                        //       sender_id: docId,
                        //       // patient_id: 0,
                        //       booking_id: el.booking_id,
                        //       chat_id:el.booking_id,
                        //       endTime: new Date(
                        //         `${el.date},${el.slot_end}`
                        //       ).getTime(),
                        //       reciever_Pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                        //       sender_pic: image,
                        //       reciever_name: el.patient_name,
                        //       sender_name: name
                        // });
                        console.log('sender_id', docId);
                        console.log('sender_pic', image);
                        console.log('booking_id', el.booking_id);
                        console.log('sender_name', name);
                        // eslint-disable-next-line no-console
                        console.log('reciever_name', el.patient_name);
                        // console.log(new Date(`${el.date},${el.slot_end}`).getTime())
                        // eslint-disable-next-line prettier/prettier
                        el.consultation_type === 'Audio'
                          ?
                          //  props.navigation.navigate('Voicecall', {
                          //   booking_id: el.booking_id,
                          //   endTime: new Date(
                          //     `${el.date},${el.slot_end}`
                          //   ).getTime(),
                          //   dname: name,
                          //   dimage: image,
                          // })
                          props.navigation.navigate('ShowQuickVisitData', {
                            bookingid: el.booking_id,
                          })
                          : null;
                      }}
                    >
                      <Card style={{ backgroundColor: '#fff' }}>
                        <Image
                          source={{ uri: el.profile_image }}
                          style={{
                            width: '40%',
                            height: 50,
                            resizeMode: 'contain',
                            marginTop: 5,
                            borderRadius: 150,
                            alignSelf: 'center',
                          }}
                        />
                        <Title style={{ textAlign: 'center', marginTop: -5, color: '#000' }}>
                          {el.patient_name}
                        </Title>
                        <Paragraph style={{ textAlign: 'center', marginTop: -5, color: '#000' }}>
                          {el.date}
                        </Paragraph>
                        <Paragraph style={{ textAlign: 'center', marginTop: -5, color: '#000' }}>
                          {el.slot_start}
                        </Paragraph>
                      </Card>
                    </TouchableOpacity>
                  )))}
          </ScrollView>
        </View>
        <View>
          <Text style={{ color: '#000', fontWeight: 'bold', marginLeft: 10, marginTop: 20 }}>Booking List</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            ref={scrollViewRef}
            {...panResponder.panHandlers}
            contentContainerStyle={{ marginRight: 20, paddingRight: 20, paddingBottom: 10 }}
            showsHorizontalScrollIndicator={false}
          >

            <View style={{ flexDirection: 'row' }}>
              {
                alldata?.length < 1 || alldata == null ?
                  (
                    <Text style={{ color: '#000', marginTop: 20, marginBottom: 20, marginLeft: 12 }}>No Data Available</Text>
                  ) : (
                    alldata?.map((el) => (
                      <TouchableOpacity
                        style={styles.container}
                        onPress={() =>
                          props.navigation.navigate('Acceptreq', {
                            bookingid: el.booking_id,
                            starttime: new Date(`${el.date},${el.slot_start}`).getTime(),
                          })
                        }
                      >
                        <Card style={{ backgroundColor: '#fff' }}>
                          <Image
                            source={{ uri: el.profile_image }}
                            style={{
                              width: '40%',
                              height: 50,
                              resizeMode: 'contain',
                              marginTop: 5,
                              borderRadius: 150,
                              alignSelf: 'center',
                            }}
                          />
                          <Title
                            style={{
                              textAlign: 'center',
                              marginTop: -5,
                              color: '#000',
                              // backgroundColor: 'red',
                              width: '80%',
                              alignSelf: 'center'
                            }}
                          >
                            {el.patient_name}
                          </Title>
                          <Paragraph
                            style={{
                              textAlign: 'center',
                              marginTop: -5,
                              color: '#000',
                            }}
                          >
                            {el.date}
                          </Paragraph>
                          <Paragraph
                            style={{
                              textAlign: 'center',
                              marginTop: -5,
                              color: '#000',
                            }}
                          >
                            {el.slot_start}
                          </Paragraph>
                        </Card>
                      </TouchableOpacity>
                    )))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 0,
    backgroundColor: '#fff',
    marginLeft: 20,
    width: 120,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    // marginRight: 10,
    elevation: 5, borderColor: "#ddd"
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
});
