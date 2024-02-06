import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { supabase } from '../../supabase/supabaseClient';
import Icon from 'react-native-vector-icons/AntDesign';
import CountDown from 'react-native-countdown-component';
import * as RNLocalize from 'react-native-localize';
import { Appointment } from '../Patient/Appointment/Appointment';
import { RFValue } from 'react-native-responsive-fontsize';
let timerStart = false;
export const Acceptreq = (props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bllodp, setBloodp] = useState('');
  const [bloodsugar, setBloodsugar] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medicine, setMedicine] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [image, SetImage] = useState('');
  const [slotstart, SetSlotstart] = useState('');
  const [end, Setend] = useState('');
  const [bookingid, SetBookingid] = useState('');
  const [problem, SetProblem] = useState('');
  const [alldata, setAlldata] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [loading, setLoding] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  //const autoendtimeref = useRef(null);
  const [labresult, setLabresult] = useState('');
  const [labresultimg, setLabresultimg] = useState([]);
  const [surgicalhistory, setSurgicalhistory] = useState('');
  const [surgicalhistoryimg, setSurgicalhistoryimg] = useState([]);
  const [medicalhistory, setMedicalhistory] = useState('');
  const [DName, setDName] = useState('');
  const [dimage, SetDImage] = useState('');
  const [doctorid, SetDoctorId] = React.useState('');
  const [patientid, SetPatientId] = React.useState('');
  const setIntervalref = useRef(null);
  const [showcounter, setShowCounter] = useState(false);
  const [istimeover, setIsTimeOver] = useState();
  const [socialhistory, setSocialhistory] = useState('');
  const [counter, setCounter] = useState(60);
  const [expanded, setExpanded] = useState({
    allergy: false,
    medicine: false,
    labresult: false,
    surgicalhistory: false,
    medicalhistory: false,
    socialhistory: false,
  });
  const [viewimage, SetViewImage] = useState('');
  const [isImgVisible, SetIsImgVisible] = useState(false);
  const scrollviewref = useRef();
  const handlePress = (value) => {
    setExpanded((prevData) => ({ ...prevData, [value]: !prevData[value] }));
    //  scrollviewref.current?.scrollToEnd({ animated: true, index: -1 }, 200);
  };
  const sendNotification = async () => {
    const data = {
      booking_id: props.route.params?.bookingid,
      doctor_id: doctorid,
      patient_id: patientid,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.patientnotificationbeforestart(data)

      .then(async (response) => {
        console.warn('notification data=========', response.data);
        setLoding(false);

      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const onRefresh = async () => {
    setRefreshing(true);
    GetRequest();
    setRefreshing(false);
  };
  useEffect(() => {
    GetRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params.bookingid, slotstart]);
  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('id---', data);
    await Apis.bookingdetails(data)

      .then((response) => {
        console.warn('>>>>>>>>', response.data);
        setLoding(false);
        console.log(response.data.data);
        setAlldata(response.data.data);
        setName(response.data.data.patient_name);
        setPhone(response.data.data.phone);
        setAge(response.data.data.age);
        setDay(response.data.data.day);
        setEmail(response.data.data.email);
        setGender(response.data.data.sex);
        setHeight(response.data.data.height);
        setWeight(response.data.data.weight);
        setBloodp(response.data.data.blood_gr);
        setBloodsugar(response.data.data.blood_suger_level);
        SetDoctorId(response.data.data.doctor_id);
        SetPatientId(response.data.data.patient_id);
        setType(response.data.data.consultation_type);
        SetImage(response.data.data.profile_image);
        setDate(response.data.data.date);
        SetSlotstart(response.data.data.slot_start);
        Setend(response.data.data.slot_end);
        SetProblem(response.data.data.problem);
        SetBookingid(response.data.data.booking_id);
        setAllergy(response.data.data.allergy);
        setMedicine(response.data.data.medication);
        setLabresult(response.data.data.lab_result);
        setSocialhistory(response.data.data.social_history)
        // setLabresultimg(response.data.data.lab_result_images);
        setLabresultimg(
          response.data.data.lab_result_images[0]
            ? response.data.data.lab_result_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        //  setSurgicalhistoryimg(response.data.data.surgical_images);
        setSurgicalhistoryimg(
          response.data.data.surgical_images[0]
            ? response.data.data.surgical_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        // for (let i = 0; i <= surgicalhistoryimg.length; i++) {
        //   console.log(surgicalhistoryimg[i]);
        // }
        setSurgicalhistory(response.data.data.surgical_history);
        setMedicalhistory(response.data.data.medical_history);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  let getallergy = allergy.split(',');
  let getmedicine = medicine.split(',');
  let getlabresult = labresult.split(',');
  let getsurgicalhistory = surgicalhistory.split(',');
  let getmedicalhistory = medicalhistory.split(',');
  let getsocialhistory = socialhistory.split(',');
  console.log('alldata', alldata);
  // useEffect(() => {
  //   clearInterval(autoendtimeref.current);
  //   autoendtimeref.current = setInterval(() => {
  //     if (Date.now() >= end + 15000) {
  //       onCreateTriggerNotification();
  //       //props.navigation.navigate('Dashboard');
  //     }
  //   }, 5000);
  //   return () => {
  //     clearInterval(autoendtimeref.current);
  //   };
  // }, []);
  const getdoctordata = async () => {
    const data = {
      booking_id: props.route.params?.bookingid,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.bookingdetailspatient(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);

        setDName(response.data.response.doctor);

        SetDImage(response.data.response.doctor_image);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  useEffect(() => {
    getdoctordata();
  }, [props.route.params?.bookingid]);
  const ShowmessagePatient = async () => {
    const role = await AsyncStorage.getItem('role');
    //   setUserRole(role);
    // console.log('role-=====', userRole);
    const data = {
      booking_id: props.route.params?.bookingid,
      // time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data------', data);

    await Apis.showmessagepatient(data)

      .then(async (response) => {
        console.log('message===>>>', response.data);
      })
      .catch((error) => {
        console.error(error.response);
      });
  }
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Upcoming Appointment" navProps={props.navigation} />
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          // ref={(refff) => {
          //   scrollviewref.current = refff;
          // }}
          />
        }
      >
        {/* {showcounter ? (
          <CountDown
            //key={random}
            until={counter}
            size={15}
            style={{ alignSelf: 'flex-end', marginRight: '10%', }}
            onFinish={() => setShowCounter(false)}
            // onFinish={() => {

            // }}
            separatorStyle={{ color: '#fff' }}
            digitStyle={{
              backgroundColor: '#2173A8',
            }}
            digitTxtStyle={{ color: '#fff' }}
            //    style={{ marginTop: -40 }}
            timeToShow={['S']}
            showSeparator
            timeLabels={{ s: '' }}
          />
        ) : null} */}
        <View style={styles.checkborder}>
          <Image style={styles.img} source={{ uri: image }} />

          <View
            style={{
              flexDirection: 'column',
              paddingBottom: 8,
              marginLeft: '6%',
              width: '65%',
            }}
          >
            <Text
              style={{
                color: '#333333',
                // marginLeft: 100,
                marginTop: 5,
                //  position: 'absolute',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              {name}
            </Text>
            <Text style={{ color: '#333333', marginTop: 5 }}>{date}</Text>
            <Text
              style={{
                color: '#333333',
                // marginLeft: 100,
                marginTop: 5,
              }}
            >
              {day}
            </Text>
            <Text
              style={{
                color: '#333333',
                // marginLeft: 100,
                marginTop: 5,
              }}
            >
              {slotstart} - {end}
            </Text>
          </View>
          {/* <View>
            <Image
              style={{
                width: 40,
                height: 42,
                resizeMode: 'contain',
                alignSelf: 'flex-end',
                marginTop: -67,
                marginRight: 20,
              }}
              source={require('../../Assets/chatbox.png')}
            />
          </View> */}

          <View
            style={{ width: '5%', alignSelf: 'center', }}
          >
            {type === 'Chat' ? (
              <Image
                style={{
                  width: 35,
                  height: 40,
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/chatbox.png')}
              />
            ) : type === 'Audio' ? (
              <Image
                style={{
                  width: 35,
                  height: 40,
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/voicecall.png')}
              />
            ) : (
              <Image
                style={{
                  width: 35,
                  height: 40,
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/videocall.png')}
              />
            )}
          </View>
        </View>

        {/* 
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Problems facing
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
          }}
        >
          {problem}
        </Text> */}
        <View style={{ flexDirection: 'row', }}>
          <Text
            style={{
              color: '#333333',
              marginLeft: 20,
              marginTop: 15,
              fontSize: 15,
              fontWeight: 'bold',
              marginRight: 10
            }}
          >
            Visit Time
          </Text>

          <View
            style={{
              marginTop: 10,
              width: '40%',
              height: 40,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              borderWidth: 1,
              marginLeft: 70,
              // marginBottom: 10,
              backgroundColor: '#2173A8'
            }}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('NoteList', {
                  booking_id: props.route.params?.bookingid,

                })
              }}
              // contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
            // disabled={
            //   !(Date.now() >= new Date(`${date},${slotstart}`).getTime())
            // }
            >
              <Text
                style={{
                  textAlign: 'center',
                  // lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 12,
                  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                Consultation Notes
              </Text>
            </TouchableOpacity>

          </View>
        </View>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: -10,
            fontSize: 15,
          }}
        >

          {date}
        </Text>

        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 5,
            fontSize: 15,
          }}
        >
          {day}, {slotstart}-{end}
        </Text>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
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
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {name}
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
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {age} (Years)
          </Text>
        </View>
        {/* 
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
            {phone}
          </Text>
        </View> */}
        {/* 
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
            Email Id
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
              textAlign: 'justify',
            }}
          >
            {email}
          </Text>
        </View> */}
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
            Gender
          </Text>
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {gender}
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
            Height
          </Text>
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {height}
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
            Weight
          </Text>
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {weight}
          </Text>
        </View>
        {/* 
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
            Blood Group
          </Text>
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {bllodp}
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
            Blood sugar
          </Text>
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {bloodsugar}
          </Text>
        </View> */}
        {/* 
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
            Allergy
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
            {allergy}
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
            Medicine
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
            {medicine}
          </Text>
        </View> */}

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
            Type
          </Text>
          <Text style={{ marginTop: 15, color: '#000' }}>:</Text>
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
            {type}
          </Text>
        </View>

        <List.Accordion
          title={`Allergy (${getallergy == '' || getallergy == 'None' ? 0 : getallergy.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.allergy}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('allergy');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getallergy.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Medication (${getmedicine == '' || getmedicine == 'None' ? 0 : getmedicine.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.medicine}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('medicine');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getmedicine.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Social History (${getsocialhistory == '' || getsocialhistory == 'None' ? 0 : getsocialhistory.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.socialhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('socialhistory');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getsocialhistory.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Lab Result (${getlabresult == '' || getlabresult == 'None' ? 0 : getlabresult.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.labresult}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('labresult');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getlabresult.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>

        <List.Accordion
          title={`Surgical History (${getsurgicalhistory == '' || getsurgicalhistory == 'None' ? 0 : getsurgicalhistory.length
            })`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.surgicalhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('surgicalhistory');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getsurgicalhistory.map((el) => (
            <List.Item
              title={el}
              titleStyle={{ color: '#000' }}
            //  right={(props) => <List.Icon {...props} icon="pill" />}
            />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Surgical History Image (${surgicalhistoryimg == '' ? 0 : surgicalhistoryimg.length
            })`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          // expanded={expanded.surgicalhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('surgicalhistoryimg');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '95%',
              flexWrap: 'wrap',
            }}
          >
            {surgicalhistoryimg.map((el, i) => (
              <TouchableOpacity
                onPress={() => {
                  console.log(surgicalhistoryimg[i]);
                  Linking.openURL(el.name);
                }}
              >
                {/* // <Icon name="addfile" size={18} color="#2173A8" /> */}
                {el.name?.split('.').pop() === 'pdf' ? (
                  <Icon
                    name="addfile"
                    size={23}
                    color="#2173A8"
                    style={{ marginTop: 8, marginHorizontal: 5 }}
                  />
                ) : (
                  <Image
                    source={{ uri: el.name }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginHorizontal: 5,
                      marginTop: 8,
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </List.Accordion>
        {/* <Title style={{ fontSize: 15, marginLeft: 25, marginTop: 10 }}>
              Surgical Image
            </Title>
            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
              {surgicalhistoryimg.map((el, i) => (
                <TouchableOpacity
                  onPress={() => {
                    console.log(surgicalhistoryimg[i]);
                    Linking.openURL(el.name);
                  }}
                >
                  {/* // <Icon name="addfile" size={18} color="#2173A8" /> */}
        {/* <Image
                    source={{ uri: el.name }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginHorizontal: 5,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View> */}
        <List.Accordion
          title={`Medical History (${getmedicalhistory == '' || getmedicalhistory == 'None' ? 0 : getmedicalhistory.length
            })`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.medicalhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('medicalhistory');
          }}
          // titleStyle={{ marginBottom: 40 }}
          style={{ height: 50, backgroundColor: '#fff', color: '#000' }}
        >
          {getmedicalhistory.map((el) => (
            <List.Item
              title={el}
              titleStyle={{ color: '#000' }}
              onPress={() => { }}
            />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Lab Result Image (${labresultimg.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          // expanded={expanded.surgicalhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('labresulimg');
          }}
          style={{ height: 50, backgroundColor: '#fff', color: '#000' }}
        >
          <View
            style={{ flexDirection: 'row', width: '90%', flexWrap: 'wrap' }}
          >
            {labresultimg.map((el, i) => (
              <TouchableOpacity
                onPress={() => {
                  console.log('kjgg==', labresultimg[i]);
                  Linking.openURL(el.name);
                }}
              >
                {/* <Icon name="addfile" size={20} color="#2173A8" /> */}
                {el.name?.split('.').pop() === 'pdf' ? (
                  <Icon
                    name="addfile"
                    size={23}
                    color="#2173A8"
                    style={{ marginTop: 8, marginHorizontal: 5 }}
                  />
                ) : (
                  <Image
                    source={{ uri: el.name }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginHorizontal: 5,
                      marginTop: 5,
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </List.Accordion>
        {/* 
        <View
          style={{
            marginHorizontal: 30,
            marginTop: 30,
            bottom: 10,
            borderRadius: 10,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={async () => {
               props.navigation.navigate('PatientPrescription', {
                bookingid: bookingid,
              }) 
              /* const session = supabase.auth.session();
              if (session) {
              // const userid = await AsyncStorage.getItem('userid');
              // props.navigation.navigate('VideoCall', {
              //   booking_id: props.route.params?.bookingid,
              // });
              //   doctor_id: +userid,
              //   patient_id: alldata.patient_id,
              //   booking_id: alldata.booking_id,
              //   profile_Pic: image,
              //   endTime: new Date(`${date},${end}`).getTime(),
              // });
              // }
              if (type === 'Video') {
                props.navigation.navigate('VideoCall', {
                  booking_id: props.route.params?.bookingid,
                });
              } else if (type === 'Chat') {
                const userid = await AsyncStorage.getItem('userid');
                props.navigation.navigate('ChatMessage', {
                  doctor_id: +userid,
                  patient_id: alldata.patient_id,
                  booking_id: alldata.booking_id,
                  profile_Pic: image,
                  endTime: new Date(`${date},${end}`).getTime(),
                });
              }
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 15 }}
            disabled={
              !(Date.now() >= new Date(`${date},${slotstart}`).getTime())
            }
          >
            Message Now(Start at){slotstart}
          </Button>
        </View> */}

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
            // marginBottom: 10,
            backgroundColor: Date.now() > props.route.params?.starttime ? '#2173A8' : '#a4cdf5',
          }}
          activeOpacity={0.7}
        >

          <TouchableOpacity
            onPress={async () => {
              console.log(
                'kkkkk====>>>>>',
                new Date(`${date},${end}`).getTime()
              );
              sendNotification()
              ShowmessagePatient()
              if (istimeover === true) {
                if (type === 'Audio') {
                  props.navigation.navigate('Voicecall', {
                    booking_id: props.route.params?.bookingid,
                    endtime: new Date(`${date},${end}`).getTime(),
                    dimage: dimage,
                    dname: DName,
                    pname: name,
                    pimage: image
                  });
                } else if (type === 'Chat') {
                  const userid = await AsyncStorage.getItem('userid');
                  // console.warn(image)
                  props.navigation.navigate('ChatMessage', {
                    sender_id: +userid,
                    reciever_id: alldata.patient_id,
                    booking_id: alldata.booking_id,
                    reciever_Pic: image,
                    endTime: new Date(`${date},${end}`).getTime(),
                    chat_id: userid.concat("" + alldata.patient_id),
                    sender_pic: dimage,
                    reciever_name: name,
                    role: "doctor",
                    // pimage: patientimage,
                    sender_name: DName,
                  });
                } else {
                  props.navigation.navigate('VideoCall', {
                    booking_id: props.route.params?.bookingid,
                    endtime: new Date(`${date},${end}`).getTime(),
                  });
                }
              }
              else { alert(`Your consultation will start at ${slotstart}`) }
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 15 }}
          // disabled={
          //   !(Date.now() >= new Date(`${date},${slotstart}`).getTime())
          // }
          >
            {type === 'Chat' ? (
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                Chat Now (Start at {slotstart})
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                Call now (Start at {slotstart})
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ paddingBottom: 10 }} />
        {showcounter ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
            <Text style={{ fontSize: RFValue(15), color: '#000', alignItems: 'center', marginBottom: 40 }}>Your call will be start within
              <CountDown
                //key={random}
                until={counter}
                size={15}
                // style={{ alignSelf: 'flex-end', marginRight: '10%', marginTop: 70 }}
                onFinish={() => setShowCounter(false)}
                // onFinish={() => {

                // }}
                separatorStyle={{ color: '#fff' }}
                digitStyle={{
                  // backgroundColor: '#2173A8',
                }}
                digitTxtStyle={{ color: '#2173A8', marginTop: 22 }}
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
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
    // height: 90,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
    // justifyContent:"center",
    flexDirection: 'row',
  },

  img: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
    // alignSelf: 'flex-start',
    borderRadius: 10,
    // position: 'absolute',
    marginLeft: '2.5%',
    // marginTop: 10,
    alignSelf: 'center',
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
