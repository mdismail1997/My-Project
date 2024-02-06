import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  BackHandler,
  Alert,
  useWindowDimensions,
} from 'react-native';
import Cal from 'react-native-vector-icons/FontAwesome';
import { AdvertiseCard } from '../../../components/AdvertiseCard';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  Title,
  Card,
  IconButton,
  Paragraph,
  FAB,
} from 'react-native-paper';
import moment from 'moment';
import { Header4, Header6 } from '../../../components/Header/Header';
import * as Apis from '../../Services/apis';
import DocumentPicker from 'react-native-document-picker';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Rating } from 'react-native-ratings';
import * as RNLocalize from 'react-native-localize';
import Carousel from 'react-native-reanimated-carousel';
import { StackRouter } from '@react-navigation/native';
import { DateTimePicker } from '@react-native-community/datetimepicker';
import { RFValue } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
export const AddReport = (props) => {
  useEffect(() => {
    console.log('pppp----', props.route.params);
    setUserId(props.route.params.userid);
    setEmail(props.route.params.mail);
  }, [props.route.params, props.route.params.mail, props.route.params.gender, props.route.params?.birthyear, props.route.params.name]);
  const { width } = useWindowDimensions();
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     Solution();
  //     SuggestDoctor();

  //     // setUpcoming(true);
  //     // setCompleted(false);
  //   });
  //   return unsubscribe;
  // }, []);
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to exit this Part ?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'YES',
  //         onPress: () => props.navigation.goback(),
  //       },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, [props.navigation]);

  const [multipleFile, setMultipleFile] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [isPartsModal, setIsPartsModal] = React.useState(false);
  const [alldata, setAllData] = React.useState('');
  const [diagnosis2, setDiagnosis2] = React.useState('');
  const [zone, setZone] = React.useState('');
  const [symptom, setSymptom] = React.useState('');
  const [slotstart, setSlotStart] = React.useState('');
  const [slotend, setSlotEnd] = React.useState('');
  const [date, setDate] = React.useState('');
  const [suggestdoctor, setSuggestdoctor] = React.useState([]);
  const [suggestotherdoctor, setSuggestOtherdoctor] = React.useState([]);
  const [index, setIndex] = React.useState(false);
  const [doctordetails, setDoctordetails] = React.useState({});
  const [selecteenddDate, setSelectedendtDate] = useState(new Date());
  const [doctorname, setDoctorName] = React.useState({});
  const [splid, setSplId] = React.useState('');
  const [doctorid, setDoctorId] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [Email, setEmail] = React.useState('');
  const [quickData, setQuickdata] = React.useState([]);
  const [quickStartTime, setQuickStartTime] = React.useState('');
  const [quickEndTime, setQuickEndTime] = React.useState('');
  const [quickDate, setQuickDate] = React.useState('');
  const [quickDocName, setQuickDocName] = React.useState('');
  const [quickDocId, setQuickDocId] = React.useState('');
  const [quickBookId, setQuickBookId] = React.useState('');
  const [quickDocImg, setQuickDocImg] = React.useState('');
  const [type, setType] = React.useState('')
  const DATA = [{
    "booking_id": 148,
    "date": "03/28/2023",
    "status": 1,
    "consultation_type": "Chat",
    "slot_start": "11:15 am",
    "slot_end": "7:30 pm",
    "doctor_name": "Shipra Mallick",
    "doctor_id": "244",
    "profile_image": "https://magento2.mydevfactory.com/doctorApp/public/images/doctors/certificate1679488763.jpg"
  },
  {
    "booking_id": 148,
    "date": "03/28/2023",
    "status": 1,
    "consultation_type": "Video",
    "slot_start": "11:15 am",
    "slot_end": "11:30 pm",
    "doctor_name": "Chibra Mallick",
    "doctor_id": "294",
    "profile_image": "https://magento2.mydevfactory.com/doctorApp/public/images/doctors/certificate1679488763.jpg"
  },
  ]
  // const Solution = async () => {
  //   const data = {
  //     symp_id: props.route.params?.symptomid.map((el) => el.id),
  //     user_id: props.route.params?.userid,
  //   };
  //   console.log(data);
  //   setLoding(true);
  //   await Apis.soloution(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       setAllData(response.data.response.diagnosis);
  //       setZone(response.data.response.color);
  //       setSymptom(response.data.response.symp);
  //       //console.log('=====>', alldata);
  //       setLoding(false);
  //       SuggestDoctor();
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //     });
  // };
  const sendNotification = async (item) => {
    const data = {
      booking_id: item.booking_id,
      doctor_id: item.doctor_id,
      patient_id: props.route.params?.userid,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.warn('notification data=========', data);
    setLoding(true);
    await Apis.patientnotificationbeforestart(data)

      .then(async (response) => {
        console.warn('notification data=========', response.data);
        setLoding(false);

      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const QuickData = async () => {
    const data = {
      patient_email: props.route.params.mail,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.warn('1212');
    await Apis.quickAppointment(data)
      .then((response) => {
        console.warn('< > < > < > << >>', response.data.data);
        setQuickdata(response.data.data);
        let start = response.data?.data[0]?.slot_start;
        let end = response.data?.data[0]?.slot_end;

        const [time, modifier] = start.split(' ');

        let [hours, minutes] = time.split(':');
        if (hours === '12') {
          hours = '00';
        }

        if (modifier === 'pm') {
          hours = parseInt(hours, 10) + 12;
        }

        setQuickStartTime(`${hours}:${minutes}`);

        const [endtime, endmodifier] = end.split(' ');

        let [endhours, endminutes] = endtime.split(':');
        if (endhours === '12') {
          endhours = '00';
        }

        if (endmodifier === 'pm') {
          endhours = parseInt(endhours, 10) + 12;
        }

        setQuickEndTime(`${endhours}:${endminutes}`);
        setQuickDate(response.data.data[0]?.date);
        setQuickDocName(response.data.data[0]?.doctor_name);
        setQuickBookId(response.data.data[0]?.booking_id);
        setQuickDocImg(response.data.data[0]?.profile_image);
        setQuickDocId(response.data.data[0]?.doctor_id);
      })
      .catch((error) => {
        console.error('eeeeeeeeeeeeeeeeee', error.response);
      });
  };
  const Solution = async () => {
    const data = {
      symp_id: props.route.params?.symptomid,
      user_id: props.route.params?.userid,
      gender: props.route.params.gender,
      email: props.route.params.mail,
    };
    // console.log('all===>>', data);
    setLoding(true);
    await Apis.soloution2(data)

      .then((response) => {
        // console.warn(response.data);
        console.warn('1', response.data);
        setAllData(response.data.diagonosis);
        setDiagnosis2(response.data.diagonosis_2)
        setZone(response.data.zone);
        setSymptom(response.data.symp);
        //console.log('=====>', alldata);
        // setLoding(false);
        SuggestDoctor();
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log('-----=====>', alldata);

  const SuggestDoctor = async () => {
    const data = {
      diagonosis: alldata,
      timezone: RNLocalize.getTimeZone(),
    };
    //console.log('yyyuu', data);
    // setLoding(true);
    await Apis.suggestdoctor(data)

      .then((response) => {
        console.warn(response.data);

        setSuggestdoctor(response.data.response);
        setSplId(response.data.spl_id);
        setDoctorId(response.data.doc_id);
        setDate(response.data.date);
        setLoding(false);
        // AvailableSlot(response.data.response.id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const SuggestOtherDoctor = async () => {
    const data = {
      spl_id: splid,
      doc_id: doctorid,
    };
    // console.log(data);
    // setLoding(true);
    await Apis.othersdoctor(data)

      .then((response) => {
        console.warn('hiiiiiiiii', response.data.response);
        //  console.warn('3');

        setSuggestOtherdoctor(response.data.response);

        // setLoding(false);
        // AvailableSlot(response.data.response.id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  useEffect(() => {
    SuggestOtherDoctor();
    SuggestDoctor();
    Solution();
    QuickData();
    console.log('---', alldata);
  }, [alldata, splid, doctorid]);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      SuggestOtherDoctor();
      SuggestDoctor();
      Solution();
      QuickData();
      setIndex(false);

      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [alldata, splid, doctorid]);
  console.log('sssss--===>', slotstart);
  // useEffect(() => {
  //   SuggestDoctor();
  // }, []);
  const showModal = () => {
    setIsPartsModal(true);
  };
  const chatPressed = (item) => {

    let mil_time = new Date(
      `${item.date},${item.slot_start}`
    ).getTime();
    let Seconds = Math.max(
      Math.floor((mil_time - Date.now()) / 1000),
      0
    );
    Seconds == 0
      ?
      props.navigation.navigate('ChatMessage', {
        reciever_id: item.doctor_id,
        sender_id: item.booking_id,
        booking_id: item.booking_id,
        chat_id: item.booking_id,
        sender_name: 'Chatbot Patient',
        reciever_name: item.doctor_name,
        reciever_Pic: item.profile_image,
        sender_pic:
          item.patient_image,
        endTime: new Date(`${item.date},${item.slot_end}`).getTime(),
        role: 'chatPat',
        doctor_id: item.doctor_id,
      })
      : props.navigation.navigate('BeforeConsult', {
        endDate: item.date,
        endTime: item.slot_end,
        seconds: JSON.parse(Seconds),
        reciever_id: item.doctor_id,
        sender_id: item.booking_id,
        booking_id: item.booking_id,
        chat_id: item.booking_id,
        sender_name: 'Chatbot Patient',
        reciever_name: item.doctor_name,
        reciever_Pic: item.profile_image,
        sender_pic:
          item.patient_image,
        type: 'Chat',
        patient_id: props.route.params?.userid,
        doctor_id: item.doctor_id,
      });
  }

  const audioPressed = (item) => {
    // Change the functionality of audio call's direction in AddMode.js's api(line No: 214)

    let mil_time = new Date(
      `${item.date},${item.slot_start}`
    ).getTime();
    let Seconds = Math.max(
      Math.floor((mil_time - Date.now()) / 1000),
      0
    );
    Seconds == 0
      ?
      (sendNotification(item),
        props.navigation.navigate('Voicecall', {

          booking_id: item.booking_id,
          endtime: new Date(`${item.date},${item.slot_end}`).getTime(),
          // not sure, data of "patient_id", "pname", "pimage" is correct please check from AddMode.js 
          patient_id: props.route.params?.userid,
          dname: item.doctor_name,
          dimage: item.profile_image,
        }))
      : props.navigation.navigate('BeforeConsult', {
        endDate: item.date,
        endTime: item.slot_end,
        seconds: JSON.parse(Seconds),
        booking_id: item.booking_id,
        endtime: new Date(`${item.date},${item.slot_end}`).getTime(),
        // not sure, data of "patient_id", "pname", "pimage" is correct please check from AddMode.js 
        patient_id: props.route.params?.userid,
        dname: item.doctor_name,
        dimage: item.profile_image,
        type: 'Audio',
        doctor_id: item.doctor_id,
      });
  }
  const videoPressed = (item) => {

    let mil_time = new Date(
      `${item.date},${item.slot_start}`
    ).getTime();
    let Seconds = Math.max(
      Math.floor((mil_time - Date.now()) / 1000),
      0
    );

    Seconds == 0
      ?
      // Change the functionality of audio call's direction in AddMode.js's api(line No : 182)
      (sendNotification(item),
        props.navigation.navigate('VideoCall', {
          booking_id: item.booking_id,
          endtime: new Date(`${item.date},${item.slot_end}`).getTime(),
          // not sure, data of "patient_id" is correct please check from AddMode.js 
          patient_id: props.route.params?.userid,
        }))
      :
      props.navigation.navigate('BeforeConsult', {
        endDate: item.date,
        endTime: item.slot_end,
        seconds: JSON.parse(Seconds),
        booking_id: item.booking_id,
        endtime: new Date(`${item.date},${item.slot_end}`).getTime(),
        // not sure, data of "patient_id", "pname", "pimage" is correct please check from AddMode.js 
        patient_id: props.route.params?.userid,
        pname: item.patient_name,
        pimage: item.patient_image,
        doctor_id: item.doctor_id,
        type: 'Video',
      });
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 30,
          marginLeft: 20,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log('pppppp==', props.route.params?.birthyear)
            props.navigation.replace('ProblemList', {
              userid: props.route.params?.userid,
              mail: props.route.params.mail,
              birthyear: props.route.params?.birthyear,
              gender: props.route.params?.gender,
              name: props.route.params.name,
            })
          }
          }
        >
          <Image
            source={require('../../../Assets/back.png')}
            resizeMode="contain"
            style={{ width: 20, height: 20, tintColor: '#2173A8' }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 40,
            fontSize: 20,
            // fontFamily: 'Roboto-Bold',
            color: '#333333',
          }}
        >
          Chat
        </Text>
        <AntDesign name="home" size={30} solid
          color={'#2173A8'}
          style={{ position: 'absolute', right: 13, bottom: 7 }}
          onPress={() => props.navigation.navigate('PatientTabNavigator')}
        />
        {/* <FAB
          icon={require('../../../Assets/quickvisit.png')}
          style={styles.fab}
          label="Home"
          //onPress={() => ProfileUpdateCheck()}
          uppercase={false}
        /> */}
      </View>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#000' }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* <View
          style={{
            width: '50%',
            backgroundColor: '#2173A81A',
            marginTop: 40,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>
            Select your <Text style={{ color: '#2173A8' }}> Birth Year.</Text>
          </Text>
        </View>
        <View
          style={{
            width: '20%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            1992
          </Text>
        </View> */}
          {/* <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>
            Please select the body part where you are experiencing pain
          </Text>
        </View>
        <View
          style={{
            width: '30%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {props.route.params?.slug}
          </Text>
        </View> */}
          {/* <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>
            Select the specific part where you are experiencing pain
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            fffff
            {props.route.params?.problemdata.map((el) => el.problem).toString()}
          </Text>
        </View> */}

          {/* <View
            style={{
              width: '70%',
              backgroundColor: '#2173A81A',
              marginTop: 20,
              marginLeft: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ padding: 15, color: '#000' }}>Selected Symptom</Text>
          </View> */}
          <View
            style={{
              width: '75%',
              backgroundColor: '#2173A8',
              marginTop: 20,
              marginRight: 20,
              borderRadius: 10,
              alignSelf: 'flex-end',
            }}
          >
            <Text style={{ padding: 15, color: '#fff', }}>
              <Text
                style={{
                  color: 'gold',
                  fontSize: RFValue(14),
                  fontWeight: 'bold',
                }}
              >
                Your selection :
                {'\n'}
              </Text>
              {symptom}
            </Text>
          </View>
          <View
            style={{
              width: '72%',
              backgroundColor: '#45A6E6',
              marginTop: 20,
              marginLeft: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ padding: 15, color: '#fff' }}>
              <Text
                style={{
                  color: 'gold',
                  fontSize: RFValue(14),
                  fontWeight: 'bold',
                  textAlign: 'justify'
                }}
              >
                Your most likely diagnosis :
              </Text>
              {'\n'}
              {alldata}
            </Text>
          </View>

          {diagnosis2 === '' ? null :
            <View
              style={{
                width: '70%',
                backgroundColor: '#45A6E6',
                marginTop: 20,
                marginLeft: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ padding: 15, color: '#fff' }}>
                <Text
                  style={{
                    color: 'gold',
                    fontSize: RFValue(14),
                    fontWeight: 'bold',
                    textAlign: 'justify',
                  }}
                >
                  Other possible diagnosis :
                </Text>
                {"\n"}
                {diagnosis2}</Text>
            </View>
          }
          {zone === 'No Color' || quickData.length === 0 ? null : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={quickData}
                //     data={DATA}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={{
                        width: '85%',
                        backgroundColor: '#fff',
                        marginTop: 30,
                        alignSelf: 'center',
                        borderRadius: 5,
                        borderColor: '#2173A8',
                        borderWidth: 0.5,
                        elevation: 5,
                      }}
                      onPress={() => {

                        item.consultation_type === "Chat" ? chatPressed(item) : item.consultation_type === "Video" ? videoPressed(item) : audioPressed(item)
                      }}
                    >
                      {/* <Text>{quickData.doctor_name}</Text> */}
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: '#ddd',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#2173A8',
                          alignSelf: 'center',
                          top: -20,
                          elevation: 2,
                        }}
                      >
                        <Cal name="calendar-plus-o" size={20} color="#fff" />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#121f4a',
                          textAlign: 'center',
                          top: -10,
                          fontWeight: '700',
                        }}
                      >
                        You have an active Appointment
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'center',
                          paddingHorizontal: '2.5%',
                        }}
                      >
                        <View
                          style={{
                            width: 65,
                            height: 65,
                            borderRadius: 65,
                            borderColor: '#ddd',
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <View
                            style={{
                              height: 60,
                              width: 60,
                              borderRadius: 30,
                              elevation: 1,
                            }}
                          >
                            <Image
                              source={{
                                uri: item.profile_image,
                              }}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 30,
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                        </View>
                        <View style={{ marginLeft: '2.5%', width: '60%' }}>
                          <Text
                            style={{ fontSize: 13, color: '#587182', fontWeight: 'bold' }}
                          >
                            {item.doctor_name}
                          </Text>
                          <Text
                            style={{ marginVertical: 8, color: '#6a747a', fontSize: 12 }}
                          >
                            {item.slot_start} - {item.slot_end}
                          </Text>
                          <Text
                            style={{ color: '#6a747a', fontSize: 12, paddingBottom: 10 }}
                          >
                            {item.date}
                          </Text>
                        </View>
                        <View>
                          {/* <View style={{}}> */}
                          {item.consultation_type === "Chat" ?
                            <Image
                              source={require('../../../Assets/chatbox.png')}
                              style={{
                                height: 40,
                                width: 40,
                                resizeMode: 'contain',
                              }}
                            />
                            : item.consultation_type === "Video" ?
                              <Image
                                source={require('../../../Assets/videocall.png')}
                                style={{
                                  height: 40,
                                  width: 40,
                                  resizeMode: 'contain',
                                }}
                              />
                              :
                              <Image
                                source={require('../../../Assets/voicecall.png')}
                                style={{
                                  height: 40,
                                  width: 40,
                                  resizeMode: 'contain',
                                }}
                              />
                          }
                          {/* </View> */}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }} />
            </View>
          )}
          {zone === 'No Color' ? null : (
            <View
              style={{
                width: '70%',
                backgroundColor: '#45A6E6',
                marginTop: 20,
                marginLeft: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ padding: 15, color: '#fff' }}>
                Your health status is{' '}
                <Text style={{ color: zone?.toLowerCase() }}>{zone} </Text>
                zone. You can consult available doctor
              </Text>
            </View>
          )}
          {zone === 'No Color' || suggestdoctor.length === 0 ? (
            <View
              style={{
                width: '70%',
                backgroundColor: '#f5b8c2',
                marginTop: 20,
                marginLeft: 20,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <Text style={{ padding: 15, color: '#000' }}>No Doctor Available </Text>
            </View>
          ) : (
            suggestdoctor.map((el, i) => (
              <TouchableOpacity
                // style={{
                //   width: '70%',
                //   backgroundColor: '#fff',
                //   marginTop: 20,
                //   marginLeft: 20,
                //   borderRadius: 10,
                //   elevation: 5,
                // }}
                onPress={() => {
                  setIndex(i);
                  console.log('=====>', index);
                  setDoctorName(el);
                  setSlotStart(el.slot.slot_start_time);
                  setSlotEnd(el.slot.slot_end_time);
                  setType(el.slot.type);
                  // props.navigation.navigate('BodyParts', {
                  //   categoryid: el.id,
                  // });
                }}
                style={index === i ? styles.unselect : styles.select}
              >
                <View style={{ paddingVertical: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      // marginHorizontal: 20,
                    }}
                  >
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        elevation: 1,
                        borderColor: '#ddd',
                        borderWidth: 1,
                        marginLeft: 5
                      }}
                    >
                      <Image
                        source={{
                          uri: el.profile_image,
                        }}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 30,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <Text
                      style={
                        index === i ? styles.unselectname : styles.selectname
                      }
                    >
                      {el.name}
                    </Text>
                    {/* <TouchableOpacity
                  onPress={() => {
                    console.log(el);
                  }}
                >
                  <Image
                    source={require('../../../Assets/view.png')}
                    style={
                      index === i ? styles.unselectview : styles.selectview
                    }
                  />
                </TouchableOpacity> */}
                  </View>
                  <Text
                    style={
                      index === i ? styles.unselecttextspe : styles.selecttextspe
                    }
                  >
                    {el.speciality}
                  </Text>
                  <View style={{ flexDirection: 'row', }}>
                    <Text
                      style={
                        index === i ? styles.unselecttextab : styles.selecttextab
                      }
                    >
                      About :
                    </Text>
                    <Text
                      style={
                        index === i
                          ? styles.unselectextratext
                          : styles.selectextratextabout
                      }
                    >
                      {el.about}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={
                        index === i ? styles.unselecttext : styles.selecttext
                      }
                    >
                      No Of Consultations :
                    </Text>
                    <Text
                      style={
                        index === i
                          ? styles.unselectextratext
                          : styles.selectextratext
                      }
                    >
                      {el.consultation}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={
                        index === i ? styles.unselecttext : styles.selecttext
                      }
                    >
                      Available Slots :
                    </Text>
                    <Text
                      style={
                        index === i
                          ? styles.unselectextratext
                          : styles.selectextratext
                      }
                    >
                      {el.avl_slots}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={
                        index === i ? styles.unselecttext : styles.selecttext
                      }
                    >
                      Slot Time :
                    </Text>
                    <Text
                      style={
                        index === i
                          ? [styles.unselectextratext, { width: '65%' }]
                          : [styles.selectextratext, { width: '65%' }]
                      }
                    >
                      {el.slot.slot_start_time} - {el.slot.slot_end_time}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={
                        index === i ? styles.unselecttext : styles.selecttext
                      }
                    >
                      Consultation Type :
                    </Text>
                    <Text
                      style={
                        index === i
                          ? styles.unselectextratext
                          : styles.selectextratext
                      }
                    >
                      {el.slot.type}
                    </Text>
                  </View>
                  <View
                    style={{
                      // height: 20,
                      alignItems: 'center',
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 5,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Rating
                      fractions={2}
                      startingValue={el.rating ?? 0}
                      imageSize={20}
                      ratingCount={5}
                      readonly={true}
                    />
                    <View
                      style={{
                        backgroundColor: 'green',
                        // width: '12%',
                        marginLeft: '5%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        borderRadius: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          paddingHorizontal: 5,
                          paddingVertical: 3,
                          left: -1,
                        }}
                      >
                        {/* {el.rating} */} {el.rating_count}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          {zone === 'No Color' || suggestdoctor.length === 0 ? null : (
            <>
              <View
                style={{
                  width: '70%',
                  backgroundColor: '#2173A81A',
                  marginTop: 20,
                  marginLeft: 20,
                  borderRadius: 10,
                  marginBottom: 20,
                }}
              >
                <Text style={{ padding: 15, color: '#000' }}>Proceed with appointment ?</Text>
              </View>

              <Carousel
                // loop
                width={width * 0.9}
                height={width / 2}
                //={true}
                data={suggestotherdoctor}
                // scrollAnimationDuration={1000}
                style={{ marginBottom: 20, alignSelf: 'center' }}
                snapEnabled
                pagingEnabled
                // eslint-disable-next-line no-console
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item }) => (
                  <AdvertiseCard
                    src={{ uri: item.profile_image }}
                    name={item.name}
                    specialization={item.speciality}
                    degree={item.qualification}
                    rating={item.rating}
                    id={item.id}
                    props={props}
                    color="#2173A8"
                    flag={true}
                  />
                )}
              />
              <View
                style={{ width: '100%', alignSelf: 'center', }}
              >
                {/* <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 50,
                  borderColor: '#2173A8',
                  borderWidth: 1,
                  bottom: 20,
                  width: '45%',
                  borderRadius: 5,
                }}
              >
                <Button
                  mode="contained"
                  color="#fff"
                  uppercase={false}
                  onPress={() => console.log('Pressed')}
                  contentStyle={{ height: 50 }}
                  labelStyle={{ color: '#2173A8', fontSize: 18 }}
                >
                  Back
                </Button>
              </View> */}
                <View
                  style={{
                    marginHorizontal: 10,
                    // marginTop: 50,
                    marginBottom: 20,
                    width: '80%',
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}
                >
                  <Button
                    mode="contained"
                    color="#2173A8"
                    uppercase={false}
                    // onPress={() => props.navigation.navigate('BookAppointment')}
                    contentStyle={{ height: 50 }}
                    labelStyle={{ color: '#fff', fontSize: 18 }}
                    onPress={() => {
                      console.log('mail===', props.route.params.mail);
                      console.log('hhhhhh', slotend, slotstart);
                      index === false
                        ? alert('Please Select Any Doctor')
                        : props.navigation.navigate('AddMode', {
                          doctorname: doctorname.name,
                          speciality: doctorname.speciality,
                          doctorid: doctorname.id,
                          doctorimg: doctorname.profile_image,
                          symptom: props.route.params?.symptom,
                          subcat: symptom,
                          slug: props.route.params?.slug,
                          symptomid: props.route.params?.symptomid,
                          userid: props.route.params?.userid,
                          starttime: slotstart,
                          endtime: slotend,
                          date: date,
                          zone: zone,
                          mail: props.route.params.mail,
                          type: type.split(', '),
                          audiofees: doctorname.audio_fee,
                          videofees: doctorname.video_fee,
                          chatfees: doctorname.chat_fee,
                          gender: props.route.params.gender,
                          birthyear: props.route.params.birthyear,
                          name: props.route.params.name,
                        });


                    }}
                  >
                    Continue
                  </Button>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 770,
    flexDirection: 'row',
    marginTop: 20,
  },
  select: {
    width: '78%',
    backgroundColor: '#fff',
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 10,
    elevation: 5,
    borderColor: '#ddd',
    borderWidth: 1

  },
  unselect: {
    width: '78%',
    backgroundColor: '#2173A8',
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 10,
    elevation: 5,
  },
  selectimg: {
    marginLeft: 10,
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  unselectimg: {
    marginLeft: 10,
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  selectname: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,

    marginLeft: 10,

    width: '78%',
  },
  unselectname: {
    color: '#fff',
    fontSize: 15,

    marginLeft: 10,

    width: '78%',
  },
  selectview: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginLeft: 40,
  },
  unselectview: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginLeft: 40,
    tintColor: '#fff',
  },
  selecttextab: {
    fontSize: RFValue(12),
    marginLeft: '10%',
    color: 'grey',
    marginTop: 12,

    paddingBottom: 3,
    marginRight: 5,
  },
  unselecttextab: {
    fontSize: RFValue(12),
    marginLeft: '10%',
    color: '#fff',
    marginTop: 12,

    paddingBottom: 3,
    marginRight: 5,
  },
  selecttext: {
    fontSize: RFValue(12),
    marginLeft: '10%',
    color: 'grey',
    marginTop: 8,

    paddingBottom: 3,
    marginRight: 5,
  },
  unselecttext: {
    fontSize: RFValue(12),
    marginLeft: '10%',
    color: '#fff',
    marginTop: 8,

    paddingBottom: 3,
    marginRight: 5,
  },
  selecttextspe: {
    fontSize: RFValue(12),
    marginLeft: '25%',
    color: 'grey',
    marginTop: -8,

    paddingBottom: 3,
    marginRight: 5,
  },
  unselecttextspe: {
    fontSize: RFValue(12),
    marginLeft: '25%',
    color: '#fff',
    marginTop: -8,

    paddingBottom: 3,
    marginRight: 5,
  },
  selectextratextabout: {
    color: 'blue',
    fontSize: RFValue(12),
    marginLeft: '2.5%',
    marginTop: 12,
    paddingBottom: 3,
    marginRight: 5,
    width: '65%',
  },
  selectextratext: {
    color: 'blue',
    fontSize: RFValue(12),
    marginLeft: '2.5%',
    marginTop: 9,
    paddingBottom: 3,
    marginRight: 5,
    width: '44%',
  },
  unselectextratext: {
    fontSize: RFValue(12),
    marginLeft: '2.5%',
    color: '#fff',
    marginTop: 12,
    //backgroundColor: 'red',
    paddingBottom: 3,
    marginRight: 5,
    width: '44%',
  },
});
