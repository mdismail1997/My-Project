import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
  RefreshControl, Modal, Animated
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Selector from '../../../components/MakeAppointment';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import { IconButton, Paragraph } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { RFValue } from 'react-native-responsive-fontsize';
import CountDown from 'react-native-countdown-component';
import { DotIndicator, BallIndicator, } from 'react-native-indicators';
import Entypo from 'react-native-vector-icons/Entypo'
import * as RNLocalize from 'react-native-localize';
let timerStart = false;
const StartChat = (props) => {
  const [animationValue, setAnimationValue] = useState(new Animated.Value(1))
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const HEIGHT = Dimensions.get('screen').height;
  const WIDTH = Dimensions.get('screen').width;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [chipData, setChipData] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [starttime, setStarttime] = React.useState('');
  const [endtime, setEndtime] = React.useState('');
  const [date, setDate] = React.useState('');
  const [day, setDay] = React.useState('');
  const [patientname, setPatient] = React.useState('');
  const [age, setAge] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [fees, setFees] = React.useState('');
  const [allData, setAllData] = React.useState();
  const [dayNight, setDayNight] = React.useState('am');
  const [refreshing, setRefreshing] = React.useState(false);
  const [patientimage, SetPatientImage] = React.useState('');
  const [doctorid, SetDoctorId] = React.useState('');
  const [patientid, SetPatientId] = React.useState('');
  const [countrycode, SetCountrycode] = React.useState('');
  const [counter, setCounter] = useState(60);
  const [showcounter, setShowCounter] = useState(false);
  const [istimeover, setIsTimeOver] = useState();
  const [visible, SetIsVisible] = useState(false);
  const setIntervalref = useRef(null);
  const onRefresh = async () => {
    setRefreshing(true);

    getdoctordata();
    setRefreshing(false);
  };
  const handlePress = (event, value) => {
    setSelectedValue(value);
    console.log(value);
  };
  const getdoctordata = async () => {
    const data = {
      booking_id: props.route.params?.bookingid,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.bookingdetailspatient(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);
        setAllData(response.data.response);
        setName(response.data.response.doctor);
        setAbout(response.data.response.consultation_type);
        SetImage(response.data.response.doctor_image);
        setStarttime(response.data.response.slot_start);
        setEndtime(response.data.response.slot_end);
        setDate(response.data.response.date);
        setDay(response.data.response.day);
        setPatient(response.data.response.patient_name);
        setAge(response.data.response.patient_age);
        setPhone(response.data.response.patient_phone);
        setFees(response.data.response.fee);
        setDayNight(response.data.response.slot_end_p);
        SetPatientImage(response.data.response.patient_image);
        SetDoctorId(response.data.response.doctor_id);
        SetPatientId(response.data.response.patient_id);
        SetCountrycode(response.data.response.patient_code)
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const sendNotification = async () => {
    const data = {
      booking_id: props.route.params?.bookingid,
      doctor_id: doctorid,
      patient_id: patientid,
    };
    console.log('notification===', data)
    setLoding(true);
    await Apis.doctornotificationbeforestart(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);

      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    getdoctordata();

  }, [props.route.params?.bookingid, props.route.params?.starttime]);

  useEffect(() => {
    setIntervalref.current = setInterval(() => {
      console.log(
        'time----',
        Date.now(),
        props.route.params?.starttime - 120000,
        Date.now() > props.route.params?.starttime - 30000 &&
        Date.now() <= props.route.params?.starttime
        &&
        !timerStart
      );

      // if (
      //   Date.now() > props.route.params?.endTime - 120000 &&
      //   Date.now() <= props.route.params?.endTime &&
      //   !modalClosed
      // ) {
      //   SetIsModal(true);
      // }
      if (
        Date.now() > props.route.params?.starttime - 60000 &&
        Date.now() <= props.route.params?.starttime
        &&
        !timerStart
      ) {
        setShowCounter(true);
      }
      if (Date.now() >= props.route.params?.starttime) { setIsTimeOver(true) }
      else {
        setIsTimeOver(false);
      }
      // if (Date.now() >= props.route.params?.endTime) {
      //   setIsTimeOver(true);
      //   twilioVideo.current.disconnect();
      //   {
      //     checkregister === 'registered'
      //       ? SetIsEndModalVisible(true)
      //       : SetIsEndVisible(true);
      //   }
      // } else {
      //   setIsTimeOver(false);
      // }
    }, 1000);
    return () => {
      if (setIntervalref.current !== null) {
        clearInterval(setIntervalref.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ShowmessagePatient = async () => {
    const role = await AsyncStorage.getItem('role');
    //   setUserRole(role);
    // console.log('role-=====', userRole);
    const data = {
      booking_id: props.route.params?.bookingid,
    };
    console.log('data------', data);

    await Apis.showmessagedoctor(data)

      .then(async (response) => {
        console.log('message===>>>', response.data);
        if (response.data.success === "1" && props.route.params.app_type != 'Q') { SetIsVisible(true); }
        else if (props.route.params.app_type === 'Q') {
          let mil_time = new Date(
            `${date},${starttime}`
          ).getTime();
          let Seconds = Math.max(
            Math.floor((mil_time - Date.now()) / 1000),
            0
          );
          // Seconds == 0
          //   ?
          const userid = await AsyncStorage.getItem('userid');
          console.log('ppppp==', patientname, patientimage)
          props.navigation.navigate('BeforeConsult', {
            endDate: date,
            endTime: endtime,
            seconds: JSON.parse(Seconds),
            booking_id: props.route.params?.bookingid,
            endtime: new Date(`${date},${endtime}`).getTime(),
            // not sure, data of "patient_id", "pname", "pimage" is correct please check from AddMode.js 
            patient_id: +userid,
            dname: name,
            dimage: image,
            type: about,
            doctor_id: allData.doctor_id,
            sender_pic: patientimage,


            chat_id: props.route.params?.bookingid,
            reciever_id: allData.doctor_id,
          })

        }
        else {
          sendNotification();
          if (about === 'Audio') {
            props.navigation.navigate('Voicecall', {
              booking_id: props.route.params?.bookingid,
              endtime: new Date(`${date},${endtime}`).getTime(),
              dimage: image,
              pname: patientname,
              pimage: patientimage,
              dname: name,
            });
          } else if (about === 'Chat' && props.route.params.app_type != 'Q') {
            console.log("sender_img", patientimage)
            // console.log("reciever_img",image)
            // console.log("sender_name",patientname)
            // console.log("reciever_name",name)
            console.warn(allData.doctor_id)
            const userid = await AsyncStorage.getItem('userid');
            const id = allData.doctor_id
            props.navigation.navigate('ChatMessage', {
              reciever_id: allData.doctor_id,
              sender_id: +userid,
              booking_id: props.route.params?.bookingid,
              profile_Pic: patientname,
              endTime: new Date(`${date},${endtime}`).getTime(),
              chat_id: id + userid,
              reciever_Pic: image,
              sender_name: patientname,
              sender_pic: patientimage,
              reciever_name: name,
              role: "patient",
            });
          }

          else if (about === 'Chat' && props.route.params.app_type === 'Q') {
            props.navigation.navigate('ChatMessage',
              {
                reciever_id: allData.doctor_id,
                sender_id: props.route.params?.bookingid,
                booking_id: props.route.params?.bookingid,
                chat_id: props.route.params?.bookingid,
                sender_name: 'Chatbot Patient',
                reciever_name: name,
                reciever_Pic: image,
                sender_pic:
                  patientimage,
                endTime: new Date(`${date},${endtime}`).getTime(),
                role: 'chatPat',
              })
          } else {
            props.navigation.navigate('VideoCall', {
              booking_id: props.route.params?.bookingid,
              endtime: new Date(`${date},${endtime}`).getTime(),
              dimage: image,
              pname: patientname,
              pimage: patientimage,
              dname: name,
            });
          }
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={name} navProps={props.navigation} />
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
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: 'white', height: HEIGHT, width: WIDTH }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <View
          style={{
            marginTop: 10,
            backgroundColor: 'white',
            width: '90%',
            borderRadius: 15,
            elevation: 5,
            alignSelf: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: image }}
              style={{ width: 80, height: 100, borderRadius: 15, margin: 10, borderColor: '#ddd', borderWidth: 1 }}
              resizeMode={'cover'}
            />
            <View style={{ justifyContent: 'space-around', marginLeft: 5 }}>
              <Text style={{ fontSize: 13, marginTop: 5, color: '#000' }}>
                {name}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: -10 }}>
                <Paragraph style={{ color: '#000' }}>
                  {about}
                  <Text
                    style={{
                      color: 'blue',

                      width: '10%',
                    }}
                  >
                    {''}: Schedule
                  </Text>
                </Paragraph>
              </View>
              <Text style={{ fontSize: 11, marginTop: -10, color: '#000' }}>
                {starttime}-{endtime}
              </Text>
            </View>

            {/* <Image
              source={require('../../../Assets/heart2.png')}
              style={{
                width: 20,
                height: 20,
                position: 'absolute',
                right: 10,
                top: 3,
              }}
              resizeMode={'contain'}
            /> */}
          </View>
        </View>

        {/* <View
          style={{
            marginTop: 20,
            width: '95%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderWidth: 1,
              marginLeft: '5%',
              borderRadius: 25,
            }}
          >
            <Image
              source={require('../../../Assets/user.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              5553+
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Patients
            </Text>
          </View>

          <View
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderRadius: 25,
              borderWidth: 1,
            }}
          >
            <Image
              source={require('../../../Assets/user2.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              3 Years
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Experience
            </Text>
          </View> */}

        {/* <View
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderWidth: 1,
              borderRadius: 25,
            }}
          >
            <Image
              source={require('../../../Assets/chaticon.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              120+
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Reviews
            </Text>
          </View>
        </View> */}

        <View style={{ marginTop: 15, marginRight: '5%' }}>
          <Text
            style={{
              color: 'black',
              marginLeft: '5%',
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            Visit Time
          </Text>
          {/* <View style={{marginTop:10,marginLeft:"5%"}}>
      <View style={{height:40,width:120,borderColor:"#dce7e8",borderRadius:12,backgroundColor:"white",elevation:10,justifyContent:"center",borderWidth:0.5}}>
        <Text style={{alignSelf:"center",fontSize:11}}>Oral surgary</Text>
      </View>
    </View> */}
          {/* <FlatList
            data={skillData}
            renderItem={renderData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
          />*/}
          <Text
            style={{
              marginLeft: '5.5%',
              color: '#000',
            }}
          >
            {date}
          </Text>
          <Text
            style={{
              marginLeft: '5.5%',
              color: '#000',
              marginTop: 8
            }}
          >
            {day}, {starttime}-{endtime}
          </Text>
        </View>
        {/*<View style={{ marginTop: 20, marginLeft: '5%' }}>
          <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
            Working Time
          </Text>

          <Text style={{ color: '#616a6b', fontSize: 12, marginTop: 10 }}>
            Mon-Fri 09:00 AM-02:00 PM
          </Text>
        </View>*/}
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 10,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Patient Information
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Name
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {patientname}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Age
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {age}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Phone No.
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {countrycode} {phone}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Fees
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            $ {fees}
          </Text>
        </View>
        {props.route.params?.app_type === 'Q' ?
          <View
            style={{
              marginTop: 20,
              width: '85%',
              height: 55,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              // marginBottom: 30,
              backgroundColor: '#2173A8'
            }}
            activeOpacity={0.7}
          >

            <TouchableOpacity
              onPress={async () => {
                console.log('kkkkk====>>>>>', new Date(date).getTime());

                // if (istimeover === true) {
                ShowmessagePatient()
                //   }
                //   else { alert(`Your call will start in ${starttime}`) }
              }
              }

            // loading
            // disabled={
            //   !(Date.now() >= new Date(`${date},${starttime}`).getTime())
            // }
            >
              {about === 'Chat' ? (
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 53,
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: RFValue(16),
                    fontFamily: 'Rubik',
                    letterSpacing: 0.4,
                  }}
                >
                  Chat Now (Start at {starttime})
                </Text>

              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 53,
                    //  color: istimeover ? 'red' : '#fff',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: 18,
                    fontFamily: 'Rubik',
                    letterSpacing: 0.4,
                  }}
                >
                  Call now (Start at {starttime})
                </Text>
                // <DotIndicator color="#ffff" size={10} />
              )}
            </TouchableOpacity>

          </View>
          : <View
            style={{
              marginTop: 20,
              width: '85%',
              height: 55,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              // marginBottom: 30,
              backgroundColor: Date.now() > props.route.params?.starttime ? '#2173A8' : '#a4cdf5',
            }}
            activeOpacity={0.7}
          >

            <TouchableOpacity
              onPress={async () => {
                console.log('kkkkk====>>>>>', new Date(date).getTime());

                if (istimeover === true) {
                  ShowmessagePatient()
                }
                else { alert(`Your consultation will start at ${starttime}`) }
              }
              }

            // loading
            // disabled={
            //   !(Date.now() >= new Date(`${date},${starttime}`).getTime())
            // }
            >
              {about === 'Chat' ? (
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 53,
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: RFValue(16),
                    fontFamily: 'Rubik',
                    letterSpacing: 0.4,
                  }}
                >
                  Chat Now (Start at {starttime})
                </Text>

              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 53,
                    //  color: istimeover ? 'red' : '#fff',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: 18,
                    fontFamily: 'Rubik',
                    letterSpacing: 0.4,
                  }}
                >
                  Call now (Start at {starttime})
                </Text>
                // <DotIndicator color="#ffff" size={10} />
              )}
            </TouchableOpacity>

          </View>}
        {showcounter ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: RFValue(15), color: '#000', alignItems: 'center' }}>Your call will be start within
              <CountDown
                //key={random}
                until={counter}
                size={10}
                // style={{ alignSelf: 'flex-end', marginRight: '10%', marginTop: 70 }}
                onFinish={() => setShowCounter(false)}
                // onFinish={() => {

                // }}
                separatorStyle={{ color: '#fff' }}
                digitStyle={{
                  // backgroundColor: '#2173A8',
                }}
                digitTxtStyle={{ color: '#2173A8', marginTop: 15 }}
                // style={{ marginTop: -40 }}
                timeToShow={['S']}
                showSeparator
                timeLabels={{ s: '' }}
              />
              sec
            </Text>
          </View>
        ) : null}
      </ScrollView>
      {/* <Modal
        visible={visible}
        transparent
        animationType="none"
      // onRequestClose={onClose}
      // onShow={handleOpen}
      >

        <TouchableOpacity activeOpacity={1}
        // onPress={handleClose}
        >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: "center", justifyContent: "center", alignSelf: 'center' }}>
            {/* <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
                backgroundColor: 'white',
                width: "90%",
                padding: 20,
                borderRadius: 10,
              }}
            > */}

      {/* <Image
              source={require('../../../Assets/doctorappicon2.png')}
              style={{ width: 80, height: 80, borderRadius: 20, alignSelf: "center" }}
            />
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
              <Text style={{ alignSelf: "center", fontSize: 16, color: "red" }}>Please Wait for doctor</Text>
              <Exclamation name="exclamation" size={25} color="red" />
            </View> */}
      {/* <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, height: 40, width: "85%", backgroundColor: "#E9F1F6", borderRadius: 5, borderColor: "#2b68e6", borderWidth: 1 }}
                  onPress={() => {
                    props.navigation.replace('PatientPrescription', {
                      bookingid: props.route.params.booking_id
                    });
                  }}>
                  <Text style={{ color: "#000" }}>Generate Prescription</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, height: 40, width: "85%", backgroundColor: "#E9F1F6", borderRadius: 5, borderColor: "#2b68e6", borderWidth: 1 }}
                  onPress={() => { props.navigation.replace('Dashboard'); }}>
                  <Text style={{ color: "#000" }}>Later</Text>
                </TouchableOpacity> */}




      {/* </Animated.View> */}

      {/* <View style={{ width: '85%', alignSelf: 'center', marginTop: 15 }}>
              <DotIndicator color="#2173A8" size={10} />
            </View>
          </View>
        </TouchableOpacity>


      </Modal> */}

      <Modal
        transparent
        animationType="none"

        visible={visible}
      // onRequestClose={() => {
      //   SetIsEndModalVisible(!isendModalVisible);
      // }}
      //style={{ width: 400, backgroundColor: '#fff' }}

      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            //   alignItems: 'center',
            backgroundColor: '#ffff',
            // justifyContent: 'center',
            marginTop: 150,
            padding: 10,
            alignSelf: 'center',
            // elevation: 5,
            borderRadius: 15,
            borderColor: '#ddd',
            borderWidth: 1,
            width: 300,
            height: 370,
          }}
        >
          {/* <View
            style={{
              // alignItems: 'center',
              //justifyContent: 'center',
              borderRadius: 15,
              // marginTop: -30,

            }}
          > */}
          {/* <Entypo
            name="circle-with-cross"
            size={40}
            color="#2173A8"
            style={{ alignSelf: 'flex-end' }}
            onPress={() => SetIsVisible(false)}
          /> */}
          <IconButton
            icon="close"
            size={26}
            color="red"
            style={{ alignSelf: 'flex-end' }}
            onPress={() => SetIsVisible(false)}
          />
          <View style={{ alignSelf: 'center' }}>


            <Image
              source={require('../../../Assets/doctorappicon2.png')}
              style={{ width: 70, height: 70, borderRadius: 20 }}
            />

          </View>
          {/* <Text
              style={{
                fontSize: RFValue(13),
                marginTop: 15,
                color: '#2173A8',
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              Thank You for Consultation
            </Text> */}
          <Text style={{
            fontSize: RFValue(15),
            marginTop: 35,
            color: '#2173A8',
            //  fontStyle: 'italic',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Please wait for doctor to join</Text>
          {/* <View style={{ width: '85%', alignSelf: 'center', }}> */}
          {/* <DotIndicator color="#2173A8" size={10} /> */}
          {/* < BallIndicator color="#2173A8" size={50} /> */}
          <Image source={require('../../../Assets/Loader.gif')}
            style={{ width: '50%', height: '50%', borderRadius: 40, alignSelf: 'center', }} />
          {/* </View> */}
        </View>
        {/* </View> */}
      </Modal>
    </SafeAreaView>


  );
};

export default StartChat;
const styles = StyleSheet.create({
  app: {
    marginHorizontal: 20,

    maxWidth: 800,
    flexDirection: 'row',
    marginTop: 20,
  },
});
