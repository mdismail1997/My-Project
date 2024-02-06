import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Animated,
  PanResponder,
  BackHandler,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { Button, List } from 'react-native-paper';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Warning } from '../../components/Popupmessage/Warning';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import { IconButton } from 'react-native-paper';
import { replace } from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import CountDown from 'react-native-countdown-component';
import ImageView from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/AntDesign';
import Pdf from 'react-native-pdf';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
let modalClosed = false;
let timerStart = false;
export const VideoCall = (props) => {
  const scrollviewref = useRef();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [isModal, SetIsModal] = useState(false);
  const [isSharing, setIsSharing] = useState('');
  const [istimeover, setIsTimeOver] = useState();
  const [loading, setLoding] = useState(false);
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [isendModalVisible, SetIsEndModalVisible] = useState(false);
  const [isendVisible, SetIsEndVisible] = useState(false);
  const [isVisible, SetIsVisible] = useState(false);
  const [isNoteVisible, SetIsNoteVisible] = useState(false);
  const automadalcloseref = useRef(null);
  const setIntervalref = useRef(null);
  const [userRole, setUserRole] = useState('Patient');
  const [visitid, setVisitId] = useState();
  const [modalmessage, SetModalmessage] = useState();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [heigh, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bllodp, setBloodp] = useState('');
  const [bloodsugar, setBloodsugar] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medicine, setMedicine] = useState('');
  const [type, setType] = useState('');
  // const [allergy, setAllergy] = useState('');
  // const [medication, setMedication] = useState('');
  const [labresult, setLabresult] = useState('');
  const [labresultimg, setLabresultimg] = useState([]);
  const [surgicalhistory, setSurgicalhistory] = useState('');
  const [surgicalhistoryimg, setSurgicalhistoryimg] = useState([]);
  const [medicalhistory, setMedicalhistory] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [addnote, setAddnote] = useState('');
  const { height, width } = useWindowDimensions();
  const [showModal, setShowModal] = useState(false);
  const [counter, setCounter] = useState(30);
  const [showcounter, setShowCounter] = useState(false);
  const [patientid, setPatientId] = useState('');
  const [socialhistory, setSocialhistory] = useState('');
  const Height = Dimensions.get('window').height;
  const [expanded, setExpanded] = useState({
    allergy: false,
    medicine: false,
    labresult: false,
    surgicalhistory: false,
    medicalhistory: false,
    socialhistory: false,
  });
  const [isImgVisible, SetIsImgVisible] = useState(false);
  const [isPdfVisible, SetIsPdfVisible] = useState(false);
  const [isLabImgVisible, SetIsLabImgVisible] = useState(false);
  const [isLabPdfVisible, SetIsLabPdfVisible] = useState(false);
  const [doctorvisible, SetDoctorVisible] = useState(false);
  const [index, SetIndex] = useState(null);
  const [checkregister, setCheckRegister] = useState('');
  const [showmessage, SetShowmessage] = useState(false);
  const [showmessagepatient, SetShowmessagepatient] = useState(false);
  const showImg = () => {
    SetIsImgVisible(true);
  };

  const hideImg = () => {
    SetIsImgVisible(false);
  };
  const showPdf = () => {
    SetIsPdfVisible(true);
  };

  const hidePdf = () => {
    SetIsPdfVisible(false);
  };
  const showLabPdf = () => {
    SetIsLabPdfVisible(true);
  };

  const hideLabPdf = () => {
    SetIsLabPdfVisible(false);
  };
  const showLabImg = () => {
    SetIsLabImgVisible(true);
  };

  const hideLabImg = () => {
    SetIsLabImgVisible(false);
  };
  const handlePress = (value) => {
    setExpanded((prevData) => ({ ...prevData, [value]: !prevData[value] }));
    scrollviewref.current?.scrollToEnd({ animated: true, index: -1 }, 200);
  };

  const twilioVideo = useRef(null);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const _onConnectButtonPress = async (token) => {
    if (Platform.OS === 'android') {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    twilioVideo.current?.connect({
      accessToken: token,
      enableNetworkQualityReporting: true,
      dominantSpeakerEnabled: true,
    });
    setStatus('connecting');
    console.log('rrrr----', token);
  };

  const _onEndButtonPress = () => {
    twilioVideo.current.disconnect();
    setStatus('disconnected');
    props.navigation.goBack();
  };

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };
  const _onVideoButtonPress = () => {
    twilioVideo.current
      .setLocalVideoEnabled(!isVideoEnabled)
      .then((isEnabled) => setIsVideoEnabled(isEnabled));
  };
  const _onShareButtonPressed = () => {
    twilioVideo.current.toggleScreenSharing(!isSharing);
    setIsSharing(!isSharing);
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
  };

  const _onRoomDidConnect = () => {
    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({ error }) => {
    console.log('ERROR1: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log('ERROR2: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const newVideoTracks = new Map(videoTracks);
    newVideoTracks.delete(track.trackSid);

    setVideoTracks(newVideoTracks);
  };

  const _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {
    console.log(
      'Participant',
      participant,
      'isLocalUser',
      isLocalUser,
      'quality',
      quality
    );
  };

  const _onDominantSpeakerDidChange = ({ roomName, roomSid, participant }) => {
    console.log(
      'onDominantSpeakerDidChange',
      `roomName: ${roomName}`,
      `roomSid: ${roomSid}`,
      'participant:',
      participant
    );
  };
  console.log('track-----', videoTracks);
  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To run this demo we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  // const QuickVisitDetails = async () => {
  //   const visitid = await AsyncStorage.getItem('visitid');
  //   setVisitId(visitid);
  //   console.log(visitid);
  //   const data = {
  //     visit_id: visitid,
  //   };
  //   console.log('data------', data);

  //     await Apis.quickvisitdetails(data)

  //       .then((response) => {
  //         console.warn(response.data);

  //       })
  //       .catch((error) => {
  //         console.error(error.response);
  //       });
  //   }
  // };

  // const QuickVisitDetails = async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-shadow
  //   const visitid = await AsyncStorage.getItem('visitid');
  //   setVisitId(visitid);
  //   console.log(visitid);
  //   const data = {
  //     visit_id: visitid,
  //   };
  //   console.log('data---', data);
  //   setLoding(true);
  //   await Apis.quickvisitdetails(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       setLoding(false);
  //       // SetIsVisible(true);
  //       //  console.log(response.data.data);
  //       // setShowModal(false);
  //       // setAlldata(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error(error.response.data);
  //       setLoding(false);
  //     });
  // };

  useEffect(() => {
    // const twilioRef = twilioVideo.current;
    //QuickVisitDetails();
    const startvideocall = async () => {
      const role = await AsyncStorage.getItem('role');
      setUserRole(role);
      console.log('role-=====', userRole);
      const data = {
        booking_id: props.route.params?.booking_id,
      };
      console.log('data------', data);
      if (Date.now() <= props.route.params?.endtime) {
        await Apis.videocall(data)

          .then((response) => {
            console.log(response.data);

            _onConnectButtonPress(response.data.token);
            console.log('rrrrjjj----', response.data.token);
            setCheckRegister(response.data.patient_status);
          })
          .catch((error) => {
            console.error(error.response);
          });
      }
    };
    startvideocall();
    // Showmessage();
    // ShowmessagePatient()
    setPatientId(props.route.params?.patient_id);
    // return () => {
    //   if (twilioRef !== null) {
    //     twilioRef?.disconnect();
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.route.params?.booking_id,
    props.route.params?.endtime,
    props.route.params?.patient_id,
  ]);

  // const Showmessage = async () => {
  //   const role = await AsyncStorage.getItem('role');
  //   setUserRole(role);
  //   console.log('role-=====', userRole);
  //   const data = {
  //     booking_id: props.route.params?.booking_id,
  //   };
  //   console.log('data------', data);

  //   await Apis.showmessagedoctor(data)

  //     .then((response) => {
  //       console.log('message===', response.data);
  //       if (response.data.success === "1") { SetShowmessage(true); }
  //       e
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //     });
  // }
  const ShowmessagePatient = async () => {
    const role = await AsyncStorage.getItem('role');
    setUserRole(role);
    console.log('role-=====', userRole);
    const data = {
      booking_id: props.route.params?.booking_id,
    };
    console.log('data------', data);

    await Apis.showmessagepatient(data)

      .then((response) => {
        console.log('message===>>>', response.data);
        if (response.data.success === "1") { SetShowmessage(true); }
        else { SetShowmessage(false); }
      })
      .catch((error) => {
        console.error(error.response);
      });
  }
  console.log('kkk', props.route.params?.booking_id);
  const handleClose = () => {
    SetIsModalVisible(false);
    SetIsVisible(false);
    setShowModal(false);
  };

  const Close = () => {
    SetIsModal(false);
    modalClosed = true;
  };
  // useEffect(() => {
  //   if (isModal) {
  //     if (automadalcloseref.current) {
  //       clearTimeout(automadalcloseref.current);
  //     }

  //     automadalcloseref.current = setTimeout(() => {
  //       modalClosed = true;
  //       SetIsModal(false);
  //     }, 5000);
  //   }
  // }, [isModal]);
  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params.booking_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('id---', data);
    setLoding(true);
    await Apis.bookingdetails(data)

      .then((response) => {
        console.log(response.data);
        setLoding(false);
        SetIsVisible(true);
        console.log(response.data.data);
        setAlldata(response.data.data);
        setName(response.data.data.patient_name);

        setAge(response.data.data.age);

        setGender(response.data.data.sex);
        setHeight(response.data.data.height);
        setWeight(response.data.data.weight);
        setBloodp(response.data.data.blood_gr);
        setBloodsugar(response.data.data.blood_suger_level);
        setAllergy(response.data.data.allergy);
        setMedicine(response.data.data.medication);
        setLabresult(response.data.data.lab_result);
        setSocialhistory(response.data.data.social_history);
        //    setLabresultimg(response.data.data.lab_result_images);
        setLabresultimg(
          response.data.data.lab_result_images[0]
            ? response.data.data.lab_result_images.map((el, i) => ({
              name: el,
            }))
            : []
        );
        //   setSurgicalhistoryimg(response.data.data.surgical_images);
        setSurgicalhistoryimg(
          response.data.data.surgical_images[0]
            ? response.data.data.surgical_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        setSurgicalhistory(response.data.data.surgical_history);
        setMedicalhistory(response.data.data.medical_history);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log(surgicalhistoryimg);
  let getallergy = allergy.split(',');
  let getmedicine = medicine.split(',');
  let getlabresult = labresult.split(',');
  let getsurgicalhistory = surgicalhistory.split(',');
  let getmedicalhistory = medicalhistory.split(',');
  let getsocialhistory = socialhistory.split(',');
  // let getsurgicalhistoryimg = surgicalhistoryimg.split(',');
  // console.log(getsurgicalhistoryimg);

  console.log('letters', labresultimg);

  const SaveNote = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params.booking_id,
      note: addnote,
    };
    console.log('data---', data);
    setLoding(true);
    await Apis.savenote(data)

      .then((response) => {
        console.log(response.data);
        setLoding(false);
        // SetIsVisible(true);
        console.log(response.data.data);
        setShowModal(false);
        // setAlldata(response.data.data);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  console.log('gen--', alldata);
  useEffect(() => {
    setIntervalref.current = setInterval(() => {
      console.log(
        'time----',
        Date.now() > props.route.params?.endtime - 120000 &&
        Date.now() <= props.route.params?.endtime &&
        !modalClosed
      );
      ShowmessagePatient();
      if (
        Date.now() > props.route.params?.endtime - 120000 &&
        Date.now() <= props.route.params?.endtime &&
        !modalClosed
      ) {
        SetIsModal(true);
      }
      if (
        Date.now() > props.route.params?.endtime - 30000 &&
        Date.now() <= props.route.params?.endtime &&
        !timerStart
      ) {
        setShowCounter(true);
      }
      if (Date.now() >= props.route.params?.endtime) {
        setIsTimeOver(true);
        twilioVideo.current.disconnect();
        {
          checkregister === 'registered'
            ? SetIsEndModalVisible(true)
            : SetIsEndVisible(true);
        }
      } else {
        setIsTimeOver(false);
      }
    }, 5000);
    return () => {
      if (setIntervalref.current !== null) {
        clearInterval(setIntervalref.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetPrescription = async () => {
    try {
      setLoding(true);
      const token = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      if (userid) {
        const user_id = JSON.parse(userid);

        console.log('user id =====>>>>', user_id);
        console.log('token123=', token);
        const data = {
          booking_id: props.route.params?.booking_id,
        };
        console.log('id---', data);

        const response = await Apis.getprescription(data);
        console.log(response.data);
        setLoding(false);

        if (response.data.prescription) {
          console.log('prescription------', response.data.prescription);
          return response.data.prescription;
        } else {
          console.log('message---', response.data);
          SetModalmessage(response.data.message);
          SetIsModalVisible(true);
        }
      } else {
        setLoding(false);
      }
      // if (response.data.prescription) {
      //   console.log('prescription------', response.data.prescription);
      //   return response.data.prescription;
      // } else {
      //   console.log('message---', response.data);
      //   SetModalmessage(response.data.message);
      //   SetIsModalVisible(true);
      // }
    } catch (error) {
      setLoding(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // GetPrescription();

      modalClosed = false;
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Are you sure you want to end this call?', undefined, [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            _onEndButtonPress();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [_onEndButtonPress]);
  console.log('status-====', status);

  return (
    <View style={styles.container}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      {status === 'disconnected' && !istimeover && (
        <View>
          <Text style={styles.welcome}>Loading......</Text>
        </View>
      )}
      {status === 'disconnected' &&
        istimeover &&
        checkregister === 'registered' &&
        (userRole === 'Doctor'
          ? props.navigation.replace('PatientChart', {
            bookingid: props.route.params?.booking_id,
            endtime: props.route.params?.endtime,
          })
          : props.navigation.replace('VoiceCallEnd', {
            booking_id: props.route.params?.booking_id,
          }))}

      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callContainer}>
          {status === 'connected' && (
            <View style={{ flex: 1 }}>
              {showmessage ?
                <View
                  style={{
                    borderRadius: 25,
                    borderColor: 'blue',
                    borderWidth: 0.5,
                    backgroundColor: '#2173A8',
                    marginTop: 10,
                    marginHorizontal: 30,
                    alignSelf: 'center',
                    padding: 10
                  }}
                >
                  <Text
                    style={{
                      //  fontWeight: 'bold',
                      color: '#fff',
                      // padding: 5,
                    }}
                  >
                    Awaiting for other party to join
                  </Text>
                </View>
                : null}
              <View
                style={{
                  height: '8%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}
              >

                {isModal ? (
                  <View
                    style={{
                      borderRadius: 15,
                      borderColor: 'blue',
                      borderWidth: 0.5,
                      backgroundColor: '#2173A8',
                    }}
                  >
                    <Text
                      style={{
                        //  fontWeight: 'bold',
                        color: '#fff',
                        padding: 5,
                      }}
                    >
                      2 minutes remaining
                    </Text>
                  </View>
                ) : null}

                {/* {showmessagepatient ?
                  <View
                    style={{
                      borderRadius: 15,
                      borderColor: 'blue',
                      borderWidth: 0.5,
                      backgroundColor: '#2173A8',
                      marginTop: 30
                    }}
                  >
                    <Text
                      style={{
                        //  fontWeight: 'bold',
                        color: '#fff',
                        padding: 5,
                      }}
                    >
                      Awaiting for other party to join
                    </Text>
                  </View>
                  : null} */}
                {/* <View
                  style={{
                    borderRadius: 15,
                    borderColor: 'blue',
                    borderWidth: 0.5,
                    backgroundColor: '#2173A8',
                    marginTop: 30
                  }}
                >
                  <Text
                    style={{
                      //  fontWeight: 'bold',
                      color: '#fff',
                      padding: 5,
                    }}
                  >
                    Awaiting for other party to join
                  </Text>
                </View> */}
                {showcounter ? (
                  <CountDown
                    //key={random}
                    until={counter}
                    size={15}
                    // onFinish={() => setDisabled(() => true)}
                    onFinish={() => {
                      <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={isendModalVisible}
                        onRequestClose={() => {
                          SetIsEndModalVisible(!isendModalVisible);
                        }}
                        style={{ width: 400, backgroundColor: '#fff' }}

                      // animationIn="zoomIn"
                      // animationOut="zoomOut"
                      >
                        <View
                          style={{
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            // justifyContent: 'center',
                            marginTop: 150,
                            padding: 10,
                            alignSelf: 'center',
                            elevation: 5,
                            borderRadius: 15,
                            width: 300,
                            height: 150,
                          }}
                        >
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 15,
                              // marginTop: -30,
                            }}
                          >
                            {/* <Ionicons
                          name="checkmark-done-circle-outline"
                          size={60}
                          color="green"
                        /> */}

                            <Image
                              source={require('../../Assets/doctorappicon2.png')}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 20,
                              }}
                            />

                            <Text
                              style={{
                                fontSize: RFValue(13),
                                marginTop: 15,
                                color: '#2173A8',
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                              }}
                            >
                              Thank You for Consultation
                            </Text>
                          </View>
                        </View>
                      </Modal>;
                    }}
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
                ) : null}
              </View>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <>

                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier} /></>
                );
              })}
            </View>
          )}

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}
            >
              <Ionicons name="call" size={30} style={{ color: 'red' }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              {isAudioEnabled ? (
                <FontAwesome
                  name="microphone"
                  size={30}
                  style={{ color: '#000' }}
                />
              ) : (
                <FontAwesome
                  name="microphone-slash"
                  size={30}
                  style={{ color: '#000' }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onVideoButtonPress}
            >
              {isVideoEnabled ? (
                <Feather name="video" size={30} style={{ color: '#000' }} />
              ) : (
                <Feather name="video-off" size={30} style={{ color: '#000' }} />
              )}
            </TouchableOpacity>
            {userRole === 'Patient' ? (
              <TouchableOpacity
                style={styles.optionButton}
                onPress={_onFlipButtonPress}
              >
                <Octicons
                  name="issue-reopened"
                  size={30}
                  style={{ color: '#000' }}
                />
              </TouchableOpacity>
            ) : null}

            {userRole === 'Doctor' ? (
              <TouchableOpacity
                style={styles.optionButton}
                onPress={GetRequest}
              >
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={30}
                  style={{ color: '#000' }}
                />
              </TouchableOpacity>
            ) : null}

            {/* {userRole === 'Doctor' ? (
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  setShowModal(true);
                }}
              >
                <SimpleLineIcons
                  name="note"
                  size={25}
                  style={{ marginLeft: 3, color: '#000' }}
                />
              </TouchableOpacity>
            ) : null} */}
            {/* <TouchableOpacity
              style={styles.optionButton}
              onPress={_onShareButtonPressed}
            >
              <Text style={{ fontSize: 12 }}>
                {isSharing ? 'Stop Sharing' : 'Start Sharing'}
              </Text>
            </TouchableOpacity> */}
          </View>

          <Animated.View
            style={{
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >

            <TwilioVideoLocalView
              enabled={true}
              style={styles.localVideo}
              applyZOrder
            />
          </Animated.View>
        </View>
      )}

      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
        onDominantSpeakerDidChange={_onDominantSpeakerDidChange}
      />

      {/* <Warning isModal={isModal} onClose={Close} /> */}
      {/* {isModal ? <Text>2min</Text> : null} */}
      <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
        message={modalmessage}
      />
      <Modal visible={showModal} transparent={true}>

      </Modal>
      <Modal
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          // bottom: 50,
          position: 'absolute',
          // height: 500,
          elevation: 35,
        }}
        // onDismiss={onClose}
        visible={isVisible}
        transparent={true}
      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            backgroundColor: '#f5faf9',
            borderRadius: 15,
            marginBottom: 10,
            marginTop: 50,
            width: 350,
            alignSelf: 'center',
            // shadowColor: '#f5faf9',
            // shadowOpacity: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 5,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <ScrollView
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            ref={(refff) => {
              scrollviewref.current = refff;
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 20,
                  marginTop: 15,
                  fontSize: RFValue(13),
                  fontWeight: 'bold',
                }}
              >
                Patient Information
              </Text>
              <IconButton
                icon="close"
                size={26}
                color="#fff"
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#2173A8',
                  borderRadius: 50,
                }}
                onPress={handleClose}
              />
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
                {heigh} (Inch)
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
                {weight} (LB)
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
              style={{ backgroundColor: '#f5faf9', height: 50 }}
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
              style={{ backgroundColor: '#f5faf9', height: 50 }}
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
              style={{ backgroundColor: '#f5faf9', height: 50 }}
            >
              {getsocialhistory.map((el) => (
                <List.Item title={el} titleStyle={{ color: '#000' }} />
              ))}
            </List.Accordion>
            <List.Accordion
              title={`Lab Result (${getlabresult == '' || getlabresult == 'None' ? 0 : getlabresult.length
                })`}
              left={(props) => <List.Icon {...props} icon="pill" />}
              expanded={expanded.labresult}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('labresult');
              }}
              style={{ backgroundColor: '#f5faf9', height: 50 }}
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
              style={{ backgroundColor: '#f5faf9', height: 50 }}
            >
              {getsurgicalhistory.map((el) => (
                <List.Item
                  title={el}
                  titleStyle={{ color: '#000' }}
                //right={(props) => <List.Icon {...props} icon="pill" />}
                />
              ))}
            </List.Accordion>
            <List.Accordion
              title={`Surgical History Image (${surgicalhistoryimg.length})`}
              left={(props) => <List.Icon {...props} icon="pill" />}
              // expanded={expanded.surgicalhistory}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('surgicalhistoryimg');
              }}
              style={{ backgroundColor: '#f5faf9', height: 50 }}
            >
              <View
                style={{ flexDirection: 'row', width: '90%', flexWrap: 'wrap' }}
              >
                {surgicalhistoryimg.map((el, i) => (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('kjgg==', el.name);
                      // Linking.openURL(el.name);
                      const pdfshow = el.name?.split('.').pop() === 'pdf';
                      if (pdfshow) {
                        showPdf();
                      } else {
                        showImg();
                      }
                      console.log(i);
                      SetIndex(i);
                    }}
                  >
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

            <List.Accordion
              title={`Medical History (${getmedicalhistory == '' || getmedicalhistory == 'None' ? 0 : getmedicalhistory.length
                })`}
              left={(props) => <List.Icon {...props} icon="pill" />}
              expanded={expanded.medicalhistory}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('medicalhistory');
              }}
              titleStyle={{ color: '#000' }}
              style={{
                backgroundColor: '#f5faf9',
                height: 50,
              }}
              descriptionStyle={{ marginBottom: 40 }}
            >
              {getmedicalhistory.map((el) => (
                <List.Item title={el} titleStyle={{ marginBottom: 20, color: '#000' }} />
              ))}
            </List.Accordion>
            <List.Accordion
              title={`Lab Result Image (${labresultimg.length})`}
              left={(props) => <List.Icon {...props} icon="pill" />}
              // expanded={expanded.surgicalhistory}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('labresultimg');
              }}
              style={{
                backgroundColor: '#f5faf9',
                height: 50,
              }}
            >
              <View
                style={{ flexDirection: 'row', width: '90%', flexWrap: 'wrap', paddingBottom: 20 }}
              >
                {labresultimg.map((el, i) => (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('kjgg==', el.name);
                      // Linking.openURL(el.name);
                      const labpdfshow = el.name?.split('.').pop() === 'pdf';
                      if (labpdfshow) {
                        showLabPdf();
                      } else {
                        showLabImg();
                      }
                      console.log(i);
                      SetIndex(i);
                    }}
                  >
                    {el.name?.split('.').pop() === 'pdf' ? (
                      <Icon
                        name="addfile"
                        size={23}
                        color="#2173A8"
                        style={{
                          marginTop: 8,
                          marginHorizontal: 5,
                          marginVertical: 10,
                        }}
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
                          marginVertical: 10,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </List.Accordion>




            <List.Accordion
              title={`     Add Notes`}
              left={(props) =>
                <SimpleLineIcons
                  name="note"
                  size={17}
                  style={{ marginLeft: 20, color: '#000' }}
                />
                //  <List.Icon {...props} icon="pill" />
              }
              // expanded={expanded.surgicalhistory}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('labresultimg');
              }}
              style={{
                backgroundColor: '#f5faf9',
                height: 50,
              }}
            >

              <View
                keyboardShouldPersistTaps="handled"
                style={{
                  backgroundColor: 'pink',
                  marginTop: 10,
                  width: '90%',
                  alignSelf: 'center',
                }}
              >
                <TextInput
                  placeholder="Type Notes here"
                  multiline={true}
                  scrollEnabled={true}
                  style={{
                    fontSize: RFValue(14),
                    height: 125,
                    textAlignVertical: 'top',
                    color: '#000',
                    right: 45
                  }}
                  textStyle={{ color: '#000', }}
                  value={addnote}
                  onChangeText={(text) => setAddnote(text)}
                />
              </View>

              <View
                style={{
                  marginHorizontal: 20,
                  borderRadius: 20,
                  flexDirection: 'row',
                  marginRight: 50,
                  marginTop: 20,
                  paddingBottom: 20
                }}
              >
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  onPress={SaveNote}
                  labelStyle={{ color: '#fff', fontSize: RFValue(12) }}
                >
                  Save
                </Button>
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  // onPress={async () => {
                  //   const _prescription = await GeneratePrescription();
                  //   console.log('pres=====', _prescription);
                  //   Linking.openURL(_prescription);
                  // }}
                  //contentStyle={{ height: 0 }}
                  onPress={handleClose}
                  labelStyle={{ color: '#fff', fontSize: 12 }}
                  style={{ marginLeft: 20 }}
                >
                  Cancel
                </Button>
              </View>
            </List.Accordion>







          </ScrollView>
        </View>
      </Modal>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isImgVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View style={styles.modal}>
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
              hideImg();
            }}
          />
          <Image
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 20,
            }}
            source={{
              uri: surgicalhistoryimg[index]?.name,
            }}
          />
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isLabImgVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View style={styles.modal}>
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
              hideLabImg();
            }}
          />
          <Image
            style={{
              width: '120%',
              height: 230,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 20,
            }}
            source={{
              uri: labresultimg[index]?.name,
            }}
          />
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isPdfVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 80,
            padding: 10,
            width: 340,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 400,
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
              hidePdf();
            }}
          />
          <Pdf
            source={{
              uri: surgicalhistoryimg[index]?.name,
            }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </View>
      </Modal>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isLabPdfVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 80,
            padding: 10,
            width: 340,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            height: 400,
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
              hideLabPdf();
            }}
          />
          <Pdf
            source={{
              uri: labresultimg[index]?.name,
            }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </View>
      </Modal>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isendModalVisible}
        onRequestClose={() => {
          SetIsEndModalVisible(!isendModalVisible);
        }}
        style={{ width: 400, backgroundColor: '#fff' }}

      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 150,
            padding: 10,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            width: 300,
            height: 150,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              // marginTop: -30,
            }}
          >
            {/* <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          /> */}

            <Image
              source={require('../../Assets/doctorappicon2.png')}
              style={{ width: 60, height: 60, borderRadius: 20 }}
            />

            <Text
              style={{
                fontSize: RFValue(13),
                marginTop: 15,
                color: '#2173A8',
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              Thank You for Consultation
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isendVisible}
        // onRequestClose={() => {
        //   SetIsEndModalVisible(!isendModalVisible);
        // }}
        style={{ width: 400, backgroundColor: '#fff' }}

      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 150,
            padding: 10,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            width: 300,
            height: 250,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              //  flexDirection: 'row',
              // marginTop: -30,
            }}
          >
            {/* <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          /> */}
            {userRole === 'Doctor' ? (
              <IconButton
                icon="close"
                size={26}
                color="#fff"
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#2173A8',
                  borderRadius: 50,
                  marginLeft: ' 80%',
                }}
                onPress={() => {
                  SetIsEndVisible(false);
                  props.navigation.replace('Dashboard');
                }}
              />
            ) : null}
            <Image
              source={require('../../Assets/doctorappicon2.png')}
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                marginTop: 5,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: RFValue(13),
                  marginTop: 15,
                  color: '#2173A8',
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Thank You For Consultation
              </Text>
            </View>
            {userRole === 'Patient' && checkregister != 'registered' ? (
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 5,
                    color: '#2173A8',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    marginBottom: 20,
                  }}
                >
                  If you need Prescription Please Signup as a Patient
                </Text>
              </View>
            ) : null}

            {userRole === 'Patient' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}
              >
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  // onPress={async () => {
                  //   const _prescription = await GeneratePrescription();
                  //   console.log('pres=====', _prescription);
                  //   Linking.openURL(_prescription);
                  // }}
                  //contentStyle={{ height: 0 }}
                  onPress={() => props.navigation.replace('SelectScreen')}
                  labelStyle={{ color: '#fff', fontSize: RFValue(13) }}
                >
                  YES
                </Button>
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  // onPress={async () => {
                  //   const _prescription = await GeneratePrescription();
                  //   console.log('pres=====', _prescription);
                  //   Linking.openURL(_prescription);
                  // }}
                  //contentStyle={{ height: 0 }}
                  onPress={() => props.navigation.replace('SelectScreen')}
                  labelStyle={{ color: '#fff', fontSize: 15 }}
                  style={{ marginLeft: 50 }}
                >
                  No
                </Button>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={doctorvisible}
        // onRequestClose={() => {
        //   SetIsEndModalVisible(!isendModalVisible);
        // }}
        style={{ width: 400, backgroundColor: '#fff' }}

      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 150,
            padding: 10,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            width: 300,
            height: 150,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              //  flexDirection: 'row',
              // marginTop: -30,
            }}
          >
            {/* <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          /> */}
            <IconButton
              icon="close"
              size={26}
              color="#fff"
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#2173A8',
                borderRadius: 50,
                marginLeft: ' 80%',
              }}
              onPress={() => {
                SetDoctorVisible(false);
                props.navigation.replace('Dashboard');
              }}
            />
            <Image
              source={require('../../Assets/doctorappicon2.png')}
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                marginTop: -50,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: RFValue(13),
                  marginTop: 15,
                  color: '#2173A8',
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                }}
              >
                Thank You for ..
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pdf: {
    width: '90%',
    height: 300,
    // resizeMode: 'contain',
    alignSelf: 'center',
    //marginTop: 20,
  },
  modal: {
    alignItems: 'center',
    backgroundColor: '#f5ebf4',
    // justifyContent: 'center',
    marginTop: 80,
    padding: 10,
    width: 350,
    alignSelf: 'center',
    elevation: 15,
    borderRadius: 15,
    height: 400,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  callContainer: {
    flex: 1,
    position: 'relative',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: RFValue(18),
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: '20%',
    width: '50%',
  },
  localVideo: {
    flex: 1,
    width: 120,
    height: 120,
    position: 'absolute',
    right: 10,
    bottom: 110,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    margin: 10,
    width: '95%',
    height: '80%',
  },
  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 80,
    backgroundColor: '#2173A8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 100 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
