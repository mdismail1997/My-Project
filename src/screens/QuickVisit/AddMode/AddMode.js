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
  RefreshControl,
} from 'react-native';
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
  Snackbar,
} from 'react-native-paper';
import { Header4, Header6 } from '../../../components/Header/Header';
import * as Apis from '../../Services/apis';
import DocumentPicker from 'react-native-document-picker';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Rating } from 'react-native-ratings';
import { Thanku } from '../../../components/Popupmessage/Thanku';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
export const AddMode = (props) => {
  const [date, setDate] = React.useState('');
  useEffect(() => {
    console.log('time=======>>', props.route.params.type,
      props.route.params?.name);
    setDate();
    GetPaymentStatus();
  }, [

    props.route.params?.gender,

    props.route.params?.birthyear,
    props.route.params?.name,
    props.route.params?.subcat,
    props.route.params?.slug,
    props.route.params?.symptom,
    props.route.params?.symptomid,
    props.route.params?.userid,
    props.route.params?.doctorname,
    props.route.params?.speciality,
    props.route.params?.doctorid,
    props.route.params?.starttime,
    props.route.params?.endtime,
    props.route.params?.doctorimg,
    props.route.params?.date,
    props.route.params?.zone,
    props.route.params?.mail,
    props.route.params?.alldata,
    props.route.params.type,

  ]);

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
  const [message, setMessage] = React.useState('');
  const [symptom, setSymptom] = React.useState('');
  const [suggestdoctor, setSuggestdoctor] = React.useState([]);
  // const [index, setIndex] = React.useState(false);
  const [doctordetails, setDoctordetails] = React.useState({});
  const [audiocall, setAudioCall] = React.useState(false);
  const [VideoCall, setVideoCall] = React.useState(false);
  const [Chat, setChat] = React.useState(false);
  const [selecteenddDate, setSelectedendtDate] = useState(new Date());
  const [communicationtype, setCommunicationtype] = useState('');
  const [audio, setAudio] = React.useState('');
  const [video, setVideo] = React.useState('');
  const [chat, setChatFees] = React.useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [bookingid, setBookingId] = React.useState();
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [paymentstatus, setPaymentStatus] = React.useState('');
  const [userrole, setUserRole] = useState('');
  const [index, setIndex] = React.useState();
  const [item, setItem] = React.useState('');
  const Solution = async () => {
    const data = {
      symp_id: props.route.params?.symptomid,
      user_id: props.route.params?.userid,
    };
    console.log(data);
    setLoding(true);
    await Apis.soloution(data)

      .then((response) => {
        console.warn(response.data);
        setAllData(response.data.response.diagnosis);
        setZone(response.data.response.color);
        setSymptom(response.data.response.symp);
        //console.log('=====>', alldata);
        setLoding(false);
        // SuggestDoctor();
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const Fees = async () => {
    const data = {
      doctor_id: props.route.params?.doctorid,
    };
    console.log(data);
    setLoding(true);
    await Apis.consultationfees(data)

      .then((response) => {
        console.warn(response.data);
        // setAllData(response.data.response.diagnosis);
        setAudio(response.data.response.fee_audio);
        setVideo(response.data.response.fee_video);
        setChatFees(response.data.response.fee_chat);
        console.log('---=====>', audio, video, chat);
        setLoding(false);
        // SuggestDoctor();
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log('=====>', props.route.params?.starttime);
  const GetPaymentStatus = async () => {
    setLoding(true);
    try {

      const response = await Apis.Paymentstatus();
      setLoding(false);
      console.log(response.data);
      setPaymentStatus(response.data.response.status);
    } catch (err) {
      console.error(err);
      setLoding(false);
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: err.response,
      }));
    }
  };
  const Booking = async () => {
    // const updateddate = selecteenddDate.toISOString();
    // console.warn('A date has been picked: ', updateddate);
    // setSelectedendtDate(updateddate.split('T')[0]);
    const data = {
      doctor_id: props.route.params?.doctorid,
      patient_id: props.route.params?.userid,
      spl_id: 16,
      date: selecteenddDate,
      slot_start: props.route.params?.starttime,
      slot_end: props.route.params?.endtime,
      consultation_type: item,
      patient_email: props.route.params.mail,
      time_zone: RNLocalize.getTimeZone()
    };
    console.log('bookingdata==', data);
    setLoding(true);
    await Apis.appointmentbooking(data)

      .then((response) => {
        console.warn(response.data);
        setBookingId(response.data.booking_id);
        setMessage(response.data.message);

        if (response.data.message === 'Already Booked') {
          Alert.alert('Already Booked');
        }
        else if (paymentstatus === 'disable') {
          SetIsModalVisible(true);
        }
        else {
          props.navigation.navigate('AccountDetails',
            {
              price:
                item === 'Video'
                  ? video
                  : item === 'Chat'
                    ? chat
                    : audio,
              booking_id: response.data.booking_id,
              id: props.route.params?.doctorid,
              date: response.data.booking_date,
              time: response.data.booking_time,
              img: response.data.doctor_image,
              doctorname: response.data.doctor_name,
              symptomid: props.route.params?.symptomid,
              gender: props.route.params?.gender,
              userid: props.route.params?.userid,
              mail: props.route.params?.mail,
              birthyear: props.route.params?.birthyear,
              name: props.route.params?.name,
              type: item,
            }
          );
        }

        // if (response.data.message === 'Already Booked') {
        //   Alert.alert('Already Booked');
        // } else if (communicationtype === 'Video') {
        //   props.navigation.navigate('VideoCall', {
        //     booking_id: response.data.booking_id,
        //     endTime: new Date(
        //       `${props.route.params?.date},${props.route.params?.endtime}`
        //     ).getTime(),
        //     patient_id: props.route.params?.userid,
        //   });
        // } else if (communicationtype === 'Chat') {
        //   //  const userid = await AsyncStorage.getItem('userid');
        //   console.warn("reciever_Pic", props.route.params?.doctorimg)
        //   console.warn("sender_pic", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
        //   console.warn("chat_id", response.data.booking_id)
        //   console.warn("booking_id", response.data.booking_id)
        //   console.warn("endTime", `${props.route.params?.date},${props.route.params?.endtime}`)
        //   console.warn("sender_name", props.route.params?.userid)
        //   console.warn("reciever_name", props.route.params?.doctorname)
        //   props.navigation.navigate('ChatMessage', {
        //     reciever_id: props.route.params?.doctorid,
        //     sender_id: response.data.booking_id,
        //     booking_id: response.data.booking_id,
        //     chat_id: response.data.booking_id,
        //     sender_name: "Chatbot Patient",
        //     reciever_name: props.route.params?.doctorname,
        //     reciever_Pic: props.route.params?.doctorimg,
        //     sender_pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        //     endTime: new Date(
        //       `${props.route.params?.date},${props.route.params?.endtime}`
        //     ).getTime(),
        //     //   profile_Pic: props.route.params?.doctorimg,
        //   });
        // } else {
        //   props.navigation.navigate('Voicecall', {
        //     booking_id: response.data.booking_id,
        //     endTime: new Date(
        //       `${props.route.params?.date},${props.route.params?.endtime}`
        //     ).getTime(),
        //     patient_id: props.route.params?.userid,
        //     pname: props.route.params?.doctorname,
        //     pimage: props.route.params?.doctorimg,
        //   });
        // }

        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log('boooking', bookingid);
  // const Submit = ()=>{
  //   if (new Date(
  //     `${props.route.params?.date},${props.route.params?.starttime}`
  //   ).getTime())
  // }
  // const SuggestDoctor = async () => {
  //   const data = {
  //     diagonosis: alldata,
  //   };
  //   console.log(data);
  //   setLoding(true);
  //   await Apis.suggestdoctor(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       setSuggestdoctor(response.data.response);

  //       setLoding(false);
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //     });
  // };
  useEffect(() => {
    Fees();
    console.log('---', alldata);
  }, []);
  // useEffect(() => {
  //   SuggestDoctor();
  // }, []);
  const showModal = () => {
    setIsPartsModal(true);
  };
  const onRefresh = async () => {
    setRefreshing(true);
    Booking();

    setRefreshing(false);
  };
  const [errmsg, setErrMsg] = React.useState();
  const validator = () => {
    console.log(
      'all--------',
      !new Date(
        `${props.route.params?.date},${props.route.params?.starttime}`
      ).getTime()
    );
    let errMsg;
    if (
      new Date(
        `${props.route.params?.date},${props.route.params?.starttime}`
      ).getTime()
    ) {
      errMsg = 'Time ';
    }
    // if (!weight || weight?.length < 1) {
    //   errMsg = 'Weight field required';
    // }

    // if (!birthyear || location?.length < 1) {
    //   errMsg = 'BirthYear field required';
    // }

    return errMsg;
  };
  const handleClose = async () => {
    let role = await AsyncStorage.getItem('role');
    setUserRole(role);
    SetIsModalVisible(false);
    props.navigation.goBack(null)
    // if (userrole === 'Patient') {
    //   SendPatientNotification();
    // } else {
    //   SendNotification();
    // }
    // SendNotification();
    // SendPatientNotification();
    // props.navigation.navigate('PatientTabNavigator');
  };
  // const SendPatientNotification = async () => {
  //   const data = {
  //     doctor_id: props.route.params?.doctorid,
  //     //patient_id: user_id,
  //     booking_id: bookingid,
  //   };
  //   console.log('data--------', data);
  //   setLoding(true);
  //   await Apis.quickvisitnotification(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       if (message === 'Already Booked') {
  //         console.log(message);
  //         Alert.alert('Already Booked');
  //       } else if (communicationtype === 'Video') {
  //         props.navigation.navigate('VideoCall', {
  //           booking_id: bookingid,
  //           endTime: new Date(
  //             `${props.route.params?.date},${props.route.params?.endtime}`
  //           ).getTime(),
  //           patient_id: props.route.params?.userid,
  //         });
  //       } else if (communicationtype === 'Chat') {
  //         //   const userid = await AsyncStorage.getItem('userid');

  //         props.navigation.navigate('ChatMessage', {
  //           doctor_id: props.route.params?.doctorid,
  //           patient_id: props.route.params?.userid,
  //           booking_id: bookingid,
  //           endTime: new Date(
  //             `${props.route.params?.date},${props.route.params?.endtime}`
  //           ).getTime(),
  //           profile_Pic: props.route.params?.doctorimg,
  //         });
  //       }

  //       // props.navigation.navigate('Appointment');
  //     })

  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //       // SetIsSubmit(false);
  //     });
  // };
  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well find above
      });
      for (const res of results) {
        //Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
      }
      //Setting the state to show multiple file attributes
      setMultipleFile(results);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        Alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        Alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header4 title="Chat" navProps={props.navigation} />
      <Snackbar
        visible={errmsg !== undefined}
        onDismiss={() => {
          setErrMsg(undefined);
        }}
        style={{ backgroundColor: '#d15656' }}
      >
        {errmsg}
      </Snackbar>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          <Text style={{ padding: 15, color: '#000' }}>Selected Symptom</Text>
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
            {props.route.params?.subcat}
          </Text>
        </View>
        {/* <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>Worsened by</Text>
        </View>
        <View
          style={{
            width: '45%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {symptom}
          </Text>
        </View>*/}
        {/* <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15, color: '#000' }}>
            {props.route.params?.alldata}
          </Text>
        </View>  */}
        <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15, color: '#000' }}>
            Your health status is{' '}
            <Text style={{ color: props.route.params?.zone.toLowerCase() }}>
              {props.route.params?.zone}{' '}
            </Text>
            zone. You can consult available doctor
          </Text>
        </View>

        <TouchableOpacity
          // style={{
          //   width: '70%',
          //   backgroundColor: '#fff',
          //   marginTop: 20,
          //   marginLeft: 20,
          //   borderRadius: 10,
          //   elevation: 5,
          // }}
          // onPress={() => {
          //   setIndex(i);
          //   console.log('=====>', index);
          //   // props.navigation.navigate('BodyParts', {
          //   //   categoryid: el.id,
          //   // });
          // }}
          style={styles.select}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              right: 0,
              marginHorizontal: 20,

            }}
          >
            <Image
              source={require('../../../Assets/qdoctor.png')}
              style={{
                alignSelf: 'flex-start', marginLeft: 10,
                marginTop: 5, borderRadius: 20, borderColor: '#ddd', borderWidth: 1
              }}
            />
            <Text style={styles.selectname}>
              {props.route.params?.doctorname}
            </Text>
            {/* <TouchableOpacity
              onPress={() => {
                console.log(el);
                showModal();
                setDoctordetails(el);
              }}
            >
              <Image
                source={require('../../../Assets/view.png')}
                style={styles.selectview}
              />
            </TouchableOpacity> */}
          </View>
          <Text
            style={{
              fontSize: 12,
              marginLeft: '26%',
              color: 'grey',
              //marginTop: -3,
              marginRight: 5,
              paddingBottom: 10,
            }}
          >
            {props.route.params?.speciality}
          </Text>
        </TouchableOpacity>

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
          <Text style={{ padding: 15, color: '#000' }}>
            Please Select One Mode{' '}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 20,
          width: '90%',
          marginHorizontal: 20,
          //  backgroundColor: 'red',
          //  height: '15%'
        }}>
          {props.route.params.type.map((item, i) => {
            return (
              // <View
              //   style={{
              //     flexDirection: 'row',
              //     justifyContent: 'space-between',
              //     marginVertical: 20,
              //     width: '90%',
              //     marginHorizontal: 20,
              //     backgroundColor: 'red',
              //     //  height: '15%'
              //   }}
              // >
              <TouchableOpacity
                key={i}
                // onPress={() => {
                //   setChat(true), setAudioCall(false);
                //   setVideoCall(false);
                //   setCommunicationtype('Chat');
                //   console.log(Chat);
                // }}
                style={i === index ? styles.selectChat : styles.unselectChat}
                onPress={() => {
                  setIndex(i);
                  setItem(item)
                  console.log('item===', item)


                }}
              >
                {item === 'Chat' ?
                  <Image
                    source={require('../../../Assets/chat.png')}
                    // style={{
                    //   height: 30,
                    //   width: 30,
                    //   resizeMode: 'contain',
                    // }} 
                    style={
                      i === index ? styles.selectimg : styles.unselectimg
                    }
                  />
                  :
                  item === 'Video' ?
                    <Image
                      source={require('../../../Assets/vvideo.png')}
                      // style={{
                      //   height: 30,
                      //   width: 30,
                      //   resizeMode: 'contain',
                      // }}
                      style={
                        i === index ? styles.selectimg : styles.unselectimg
                      }
                    />
                    :
                    <Image
                      source={require('../../../Assets/vcall.png')}
                      // style={{
                      //   height: 30,
                      //   width: 30,
                      //   resizeMode: 'contain',
                      // }}
                      style={
                        i === index ? styles.selectimg : styles.unselectimg
                      }
                    />
                }
                <Text
                  style={i === index ? styles.selecttext : styles.unselecttext}
                >
                  {item}
                </Text>
              </TouchableOpacity>
              // </View>


            )
          }
          )}
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 20,
            width: '90%',
            marginHorizontal: 20,
          }}
        >
          {chat != '' ? (
            <TouchableOpacity
              onPress={() => {
                setChat(true), setAudioCall(false);
                setVideoCall(false);
                setCommunicationtype('Chat');
                console.log(Chat);
              }}
              style={Chat === true ? styles.selectChat : styles.unselectChat}
            >
              <Image
                source={require('../../../Assets/chaticon.png')}
                style={
                  Chat === true ? styles.selectchatimg : styles.unselectchatimg
                }
              />
              <Text
                style={Chat === true ? styles.selecttext : styles.unselecttext}
              >
                Chat
              </Text>
            </TouchableOpacity>
          ) : null}
          {video != '' ? (
            <TouchableOpacity
              onPress={() => {
                setVideoCall(true), setAudioCall(false), setChat(false);
                setCommunicationtype('Video');
              }}
              style={
                VideoCall === true ? styles.selectChat : styles.unselectChat
              }
            >
              <Image
                source={require('../../../Assets/vvideo.png')}
                style={
                  VideoCall === true ? styles.selectimg : styles.unselectimg
                }
              />
              <Text
                style={
                  VideoCall === true ? styles.selecttext : styles.unselecttext
                }
              >
                Video Call
              </Text>
            </TouchableOpacity>
          ) : null}
          {audio != '' ? (
            <TouchableOpacity
              onPress={() => {
                setAudioCall(true), setChat(false), setVideoCall(false);
                setCommunicationtype('Audio');
              }}
              style={
                audiocall === true ? styles.selectChat : styles.unselectChat
              }
            >
              <Image
                source={require('../../../Assets/vcall.png')}
                style={
                  audiocall === true ? styles.selectimg : styles.unselectimg
                }
              />
              <Text
                style={
                  audiocall === true ? styles.selecttext : styles.unselecttext
                }
              >
                Voice Call
              </Text>
            </TouchableOpacity>
          ) : null}
        </View> */}
        <View style={{ width: '100%', alignSelf: 'center' }}>
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
              marginTop: 30,
              bottom: 20,
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
                if (item === "") { alert('please select type.') }
                else { Booking(); }
              }}
            // disabled={new Date(
            //   `${props.route.params?.date},${props.route.params?.starttime}`
            // ).getTime()}
            >
              Continue
            </Button>
          </View>
        </View>

        {/* <View>
          <TextInput
            label="Enter blood pressure  "
            placeholder="Enter blood pressure "
            mode="outlined"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              width: '85%',
              marginTop: 10,
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View>
          <TextInput
            label="Enter blood sugar   "
            placeholder="Enter blood sugar "
            mode="outlined"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              width: '85%',
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 15,
            borderColor: '#2173A8',
            borderWidth: 1,
            bottom: 10,
            width: '85%',
            borderRadius: 5,
            alignSelf: 'center',
          }}
        >
          <Button
            mode="contained"
            color="#fff"
            uppercase={false}
            onPress={selectMultipleFile}
            contentStyle={{ height: 40 }}
            labelStyle={{ color: '#2173A8', fontSize: 12 }}
          >
            Add XRay, ECG MRI, CT Scan Report
          </Button>
        </View>
        <View
          style={{
            marginTop: 15,
            borderColor: '#2173A8',
            borderWidth: 1,
            bottom: 10,
            width: '85%',
            borderRadius: 5,
            alignSelf: 'center',
            backgroundColor: 'blue',
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={() => props.navigation.navigate('FellingNow')}
            contentStyle={{ height: 40 }}
            labelStyle={{ color: '#fff', fontSize: 12 }}
          >
            Skip
          </Button>
        </View> */}
        <View style={{ paddingBottom: 10 }} />
      </ScrollView>
      <Thanku
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  selectChat: {
    borderColor: '#fff',
    borderWidth: 1,
    width: '28%',
    backgroundColor: '#2173A8',
    borderRadius: 10,
    alignSelf: 'center',
    paddingBottom: 5
  },
  unselectChat: {
    borderColor: '#2173A8',
    borderWidth: 1,
    width: '28%',
    borderRadius: 10,
    alignSelf: 'center',
    paddingBottom: 5
    // height: '110%',
    //backgroundColor: 'green'
  },
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 770,
    flexDirection: 'row',
    marginTop: 20,
  },
  select: {
    width: '70%',
    backgroundColor: '#fff',
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 10,
    elevation: 5,
    borderColor: '#ddd', borderWidth: 1
  },
  unselect: {
    width: '70%',
    backgroundColor: '#2173A8',
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 10,
    elevation: 5,
  },
  selectimg: {
    alignSelf: 'center',
    marginHorizontal: 20,
    tintColor: '#fff',
    marginVertical: 10
  },
  unselectimg: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginVertical: 10
  },
  selectchatimg: {
    alignSelf: 'center',
    marginHorizontal: 20,
    tintColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
    width: 30,
    height: 30,
  },
  unselectchatimg: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    width: 30,
    height: 30,
  },
  selectname: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    width: '45%',
  },
  unselectname: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 20,
    width: '45%',
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
  selecttext: {
    textAlign: 'center',
    paddingHorizontal: 10,
    // paddingVertical: 10,
    color: '#fff',
  },
  unselecttext: {
    textAlign: 'center',
    paddingHorizontal: 10,
    // paddingVertical: 10,
    color: '#000',
  },
});
