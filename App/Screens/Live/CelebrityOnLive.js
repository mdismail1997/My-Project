import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  BackHandler,
  Modal,
  ScrollView,
} from 'react-native';

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRemoteState,
} from 'react-native-agora';

import {RFValue} from 'react-native-responsive-fontsize';

import {appID, agoraToken, base_url} from '../../Services/constants';
import Hud from '../Common/Hud';
import {postApiCall, postApiCallFormData} from '../../Services/Network';
import HeaderWithImageTitle from '../Common/HeaderWithImageTitle';

import Toast from 'react-native-toast-message';
import RBSheet from 'react-native-raw-bottom-sheet';
import {createThumbnail} from 'react-native-create-thumbnail';
import {ProfileContext} from '../../Services/ProfileProvider';

import Pusher from 'pusher-js/react-native';
import {
  SOCKET_URL,
  PUSHER_APP_KEY,
  PUSHER_APP_CLUSTER,
  SOCKET_PORT,
} from '../../Services/constants';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const {width, height} = Dimensions.get('window');

const videoStateMessage = state => {
  switch (state) {
    case VideoRemoteState.Stopped:
      return 'Video turned off by Host';

    case VideoRemoteState.Frozen:
      return 'Connection Issue, Please Wait';

    case VideoRemoteState.Failed:
      return 'Network Error';
  }
};

async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const requestCameraAndAudioPermissionIOS = async () => {
  try {
    const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
    const microphonePermission = await check(PERMISSIONS.IOS.MICROPHONE);
    if (cameraPermission !== RESULTS.GRANTED) {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      if (result !== RESULTS.GRANTED) {
        // handle permission denied
        Alert.alert('Camera Permission Denied');
      }
    }

    if (microphonePermission !== RESULTS.GRANTED) {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      if (result !== RESULTS.GRANTED) {
        // handle permission denied
        //Alert.alert('Microphone Permission Denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function CelebrityOnLive(props) {
  const {profileContextData, token} = useContext(ProfileContext);
  const isBroadcaster = props.route.params.type === 'create';

  const pusher = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_APP_CLUSTER,
    wsHost: SOCKET_URL,
    wssPort: SOCKET_PORT,
    // auth: {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // },
  });

  const [remoteUid, setRemoteUid] = useState([]);
  const [channel, setChannel] = useState('');

  const [messages, setMessages] = useState([]);
  const [messageStatus, setMessageStatus] = useState(false);
  const [answer, setAnswer] = useState('');
  const [index, setIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState(false);
  //const [recUid, setRecUid] = useState(null);
  const [sid, setSid] = useState(null);
  const [rid, setRid] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [startVideo, setStartVideo] = useState('0');
  const [storedVideo, setStoredVideo] = useState('0');
  const [joined, setJoined] = useState(false);

  const [amountModal, setAmountModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [shownAmount, setShownAmount] = useState(false);
  const [videoAnswer, setVideoAnswer] = useState(false);

  // const [pusher1, setPusher1] = useState(null);

  const refRBSheet = useRef();
  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );

  const AgoraEngine = useRef();
  const init = async () => {
    AgoraEngine.current = await RtcEngine.create(appID);
    AgoraEngine.current.enableVideo();
    AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    // Set audio route to speaker
    await AgoraEngine.current.setDefaultAudioRoutetoSpeakerphone(true);

    //setEngine(AgoraEngine.current);

    if (isBroadcaster)
      AgoraEngine.current.setClientRole(ClientRole.Broadcaster);

    AgoraEngine.current.addListener('RemoteVideoStateChanged', (uid, state) => {
      console.log('uid===>', uid);

      if (uid === 1) setBroadcasterVideoState(state);
    });

    //await AgoraEngine.current.enableVideo();

    AgoraEngine.current.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
      Toast.show({
        type: 'error',
        text1: 'Warning in connecting Live',
      });
    });
    AgoraEngine.current.addListener('Error', errorCode => {
      console.info('Error===>', errorCode);
      Toast.show({
        type: 'error',
        text1: 'Error in connecting Live',
        text2: errorCode,
      });
    });
    AgoraEngine.current.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess=====>', channel, uid, elapsed);
        setJoined(true);
      },
    );

    AgoraEngine.current.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      // RtcLocalView.SurfaceView must render after engine init and channel join

      setJoined(false);
    });

    // AgoraEngine.current.addListener('UserOffline', (uid, reason) => {
    //   console.info('UserOffline', uid, reason);
    //   // this.setState({
    //   //   remoteUid: this.state.remoteUid.filter(value => value !== uid),
    //   // });

    //   setRemoteUid(remoteUid.filter(value => value !== uid));
    // });

    AgoraEngine.current.addListener('UserJoined', (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);

      setRemoteUid({...remoteUid, uid});
    });

    AgoraEngine.current.addListener('StreamMessage', (uid, streamId, data) => {
      console.info('StreamMessage', uid, streamId, data);
      Alert.alert(
        `Receive from uid:${uid}`,
        `StreamId ${streamId}:${JSON.parse(data).question}`,
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
      );
    });

    AgoraEngine.current.addListener(
      'StreamMessageError',
      (uid, streamId, error, missed, cached) => {
        console.info(
          'StreamMessageError',
          uid,
          streamId,
          error,
          missed,
          cached,
        );
      },
    );
  };

  const onSwitchCamera = () => AgoraEngine.current.switchCamera();

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission();
    } else if (Platform.OS === 'ios') {
      requestCameraAndAudioPermissionIOS();
    }
    const uid = isBroadcaster ? 1 : 0;

    setChannel(props.route.params.channel);
    init().then(() =>
      AgoraEngine.current.joinChannel(
        agoraToken,
        props.route.params.channel,
        null,
        uid,
      ),
    );

    return () => {
      AgoraEngine.current.destroy();
      closeLiveStatus();
    };
  }, [props.route.params.channel]);

  // useEffect(() => {
  //   createConnection();
  //   return () => {
  //     disconnectSocket();
  //   };
  // }, [props.route.params.channel]);

  const createConnection = async () => {
    //Pusher.logToConsole = true;

    pusher.connection.bind('error', function (err) {
      if (err.error.data) {
        if (err.error.data.code === 4004) {
          console.log('Over limit!');
        } else {
          console.log('error', err.error.data);
        }
      }
    });

    pusher.connection.bind('disconnected', () => {
      console.warn('Connection Disconected');
    });
    pusher.connection.bind('connected', function (data) {
      console.warn('Connected', data);

      const channel = pusher.subscribe('message-sent');
      channel.bind('MessageSent', data => {
        // handle the event data
        console.warn('data.message==>', data.message);
        messages.push(data.message);

        setMessageStatus(true);
      });
    });
  };

  const disconnectSocket = () => {
    Pusher.logToConsole = false;
    pusher.unsubscribe('message-sent');
    pusher.disconnect();
    // Pusher.logToConsole = false;

    // pusher.connection.bind('error', function (err) {
    //   if (err.error.data) {
    //     if (err.error.data.code === 4004) {
    //       console.log('Over limit!');
    //     } else {
    //       console.log('error', err.error.data);
    //     }
    //   }
    // });
    // pusher.connection.bind('connected', function (data) {
    //   pusher.disconnect();
    // });
  };

  const closeLiveStatus = async () => {
    console.log('isBroadcaster==>', isBroadcaster);

    Hud.showHud();
    const liveData = {
      channel_id: props.route.params.channel,
      status: 0,
      schedule_complete_status: 1,
    };
    console.log('Data==>', liveData);
    await postApiCall('celebritylivestatus', liveData, {})
      .then(response => {
        console.log('Live Off===>', response.data);
        Hud.hideHud();
        if (response.status == 200) {
          console.log('Live Close');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error while Closing Live',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          Hud.hideHud();
          console.log('error==>', error.response.data);

          Toast.show({
            type: 'error',
            text1: 'Error while sharing Channel ID',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(error.message);
        }
      });
  };

  const renderHost = () =>
    broadcasterVideoState === VideoRemoteState.Decoding ? (
      <RtcRemoteView.SurfaceView
        uid={1}
        style={styles.fullscreen}
        channelId={props.route.params.channel}
      />
    ) : (
      <View style={styles.broadcasterVideoStateMessage}>
        <Text style={styles.broadcasterVideoStateMessageText}>
          {videoStateMessage(broadcasterVideoState)}
        </Text>
      </View>
    );

  const renderLocal = () => (
    <RtcLocalView.SurfaceView
      style={styles.fullscreen}
      channelId={props.route.params.channel}
    />
  );

  const sendAnswer = async () => {
    console.log('Sending Answer');
    if (messages[index].question_amount !== 0) {
      setMessageStatus(false);
      setAnswerStatus(true);
    } else {
      setMessageStatus(false);
      setAmountModal(true);
    }
  };

  const handleText = value => {
    setAnswer(value);
  };

  const handleAnswer = async () => {
    const answerData = {
      question_id: messages[index].id,
      answer: answer,
    };
    console.log('AnswerData==>', answerData);
    await postApiCall('celebrityanswer', answerData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          nextQuestionIndex1();
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          if (error.response.data.data.length != 0) {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          } else {
            var firstItem = error.response.data.message;
          }

          Toast.show({
            type: 'error',
            text1: firstItem,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error.request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error.Setting===>', error.message);
        }
      });
  };

  const nextQuestionIndex1 = () => {
    console.log(
      'messages.length=====>',
      typeof messages.length,
      messages.length,
    );
    console.log('indexindex==>', typeof index, index);
    setAnswerStatus(false);

    if (messages.length - 1 == index) {
      setMessageStatus(false);
      console.log('no messages left');
      setIndex(index + 1);
    } else {
      setIndex(index + 1);
      console.log('next message==>', messages[index]);
      if (messages[index].question_earn_amount != undefined) {
        setMessageStatus(true);
      }
    }
  };

  const nextQuestionIndex = async () => {
    console.log(
      'messages.length=====>',
      typeof messages.length,
      messages.length,
    );
    console.log('indexindex==>', typeof index, index);
    setAnswerStatus(false);

    if (messages.length - 1 == index) {
      setMessageStatus(false);
      console.log('no messages left');
      setIndex(index + 1);
    } else {
      setIndex(index + 1);
      console.log('next message==>', messages[index]);
      setMessageStatus(true);
    }
  };

  const onVideoRecording = () => {
    startRecording();
    //startScreenRecording();
  };

  const onStopRecording = () => {
    stopRecording();
    // stopScreenRecording();
  };

  const startRecording = async () => {
    setLoading(true);
    const bodyData = {
      cname: props.route.params.channel,
      uid: 112,
      // uid: recUid,
    };
    console.log('startRecordingbodyData====>', bodyData);
    await postApiCall('cloud-reocording/start', bodyData, {})
      .then(response => {
        setLoading(false);
        setStartVideo('1');
        console.log('response==>', response.data);
        if (response.status == 200) {
          setRecordingStatus(true);
          //console.log('response 200 data==>', response.data);
          setRid(response.data.data.resource_id);
          setSid(response.data.data.sid);
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          if (error.response.data.data == 'Recording Is Already Running') {
            setRecordingStatus(true);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error.request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error.Setting===>', error.message);
        }
      });
  };

  const stopRecording = async () => {
    setLoading(true);
    const bodyData = {
      cname: props.route.params.channel,
      uid: 112,
      resourceId: rid,
      serviceId: sid,
    };
    console.log('===stopRecordingbodyData==>', bodyData);
    await postApiCall('cloud-reocording/stop', bodyData, {})
      .then(response => {
        setLoading(false);
        setStoredVideo('2');
        console.log('response==>', response.data.data, response.status);
        if (response.status == 200) {
          setRecordingStatus(false);
          if (videoAnswer) {
            sendVideoAnswer(response.data.data.file_url);
          } else {
            uploadVideoFunc(response.data.data.file_url);
          }
        }
      })
      .catch(function (error) {
        setLoading(false);
        // setStoredVideo(true);
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in response==>',
            error.response.data,
            error.response.status,
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error.request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error.Setting===>', error.message);
        }
      });
  };

  const sendVideoAnswer = async file => {
    setLoading(true);
    var img;
    try {
      const imgResponse = await createThumbnail({
        url: file,
      });
      console.log('Thumbnail response==>', imgResponse);
      img = imgResponse.path;
      console.log('===>', img);
    } catch (error) {
      console.log('error==>', error);
      img =
        'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132__340.png';
    }
    const data = new FormData();
    data.append('question_id', messages[index].id);
    data.append('chanel_id', props.route.params.channel);
    data.append('video_url', file);
    data.append('answer_image', {
      uri: img,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    console.log('========>', data);
    try {
      let res = await fetch(base_url + `celebrity-give-answer`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${token}`,
        },
      });
      let responseJson = await res.json().then(response => {
        console.log('responseJson===>', response);

        setLoading(false);
        if (response.success === true) {
          Toast.show({
            type: 'success',
            text1: 'Answer has been send',
          });
          nextQuestionIndex1();
        } else {
          var myobj = response.data.file;
          var firstItem = Object.values(myobj)[0];
          Toast.show({
            type: 'error',
            text1: firstItem,
          });
        }
      });
    } catch (error) {
      setLoading(false);
      console.log('Error==>', error);
      Toast.show({
        type: 'error',
        text1: 'Error ',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadVideoFunc = async file => {
    setLoading(true);
    var img;
    try {
      const imgResponse = await createThumbnail({
        url: file,
      });
      console.log('Thumbnail response==>', imgResponse);
      img = imgResponse.path;
      console.log('===>', img);
    } catch (error) {
      console.log('error==>', error);
      img =
        'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132__340.png';
    }
    const data = new FormData();
    data.append('video_type', 3);
    data.append('channel_id', props.route.params.channel);
    data.append('file_url', file);
    data.append('image', {
      uri: img,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
    console.log('========>', data);

    try {
      let res = await fetch(base_url + `celebritypost`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${token}`,
        },
      });
      let responseJson = await res.json().then(response => {
        console.log('responseJson===>', response);

        setLoading(false);
        if (response.success === true) {
          Toast.show({
            type: 'success',
            text1: 'Video has been uploaded',
          });
        } else {
          var myobj = response.data.file;
          var firstItem = Object.values(myobj)[0];
          Toast.show({
            type: 'error',
            text1: firstItem,
          });
        }
      });
    } catch (error) {
      setLoading(false);
      console.log('Error==>', error);
      Toast.show({
        type: 'error',
        text1: 'Error ',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAmount = value => {
    setAmount(value);
    //setShownAmount(true);
    if (value.trim() == '') {
      setShownAmount(false);
    } else {
      setShownAmount(true);
    }
  };

  const sendAmountFunc = () => {
    console.log('=======>', messages[index].userName);
    let msgData = {
      amount: amount,
      userName: messages[index].userName,
    };

    console.log('Last text send Api====>', msgData);
    setAmountModal(false);
    setAmount('');
    //setIndex(index + 1);
    nextQuestionIndex();
  };

  const answerQuestionFunc = data => {
    console.log(data);
    setMessages([...messages, data]);
    startRecording();
  };
  return (
    <View style={styles.container}>
      {!joined ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>
          <ActivityIndicator
            size={60}
            color="#E1006E"
            style={styles.activityIndicator}
          />
          <Text style={styles.loadingText}>Joining Stream, Please Wait</Text>
        </View>
      ) : (
        <>
          {isBroadcaster ? renderLocal() : renderHost()}

          <View
            style={{
              width: '100%',
              // backgroundColor: 'red',
              position: 'absolute',
            }}>
            <HeaderWithImageTitle
              navProps={props.navigation}
              title={'Profile'}
            />
          </View>

          {messageStatus && (
            <>
              <TouchableOpacity
                onPress={() => {
                  //sendAnswer();
                  setVideoAnswer(true);
                  setMessageStatus(false);
                  startRecording();
                }}
                style={{
                  //height: 80,
                  width: width * 0.9,
                  alignSelf: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  padding: 15,
                  marginTop: height * 0.03,
                  position: 'absolute',
                  top: height * 0.13,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    //backgroundColor: 'red',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: '#151143',
                      marginBottom: 10,
                    }}>
                    Questions
                  </Text>
                  {messages[index].question_earn_amount != undefined && (
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '400',
                        color: '#E92D87',
                        marginBottom: 10,
                      }}>
                      {messages[index].question_earn_amount}
                    </Text>
                  )}
                </View>

                <Text
                  style={{fontSize: 17, fontWeight: '400', color: '#151143'}}>
                  {messages[index].question}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {answerStatus && (
            <View
              style={{
                //height: 80,
                width: width * 0.9,
                alignSelf: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                padding: 15,
                marginTop: height * 0.03,
                position: 'absolute',
                top: height * 0.13,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '400',
                  color: '#151143',
                  marginBottom: 10,
                }}>
                Answer
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  width: width * 0.8,
                  height: 50,
                  //backgroundColor: 'red',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                <TextInput
                  onChangeText={value => handleText(value)}
                  placeholder="Reply.."
                  style={{...styles.input}}
                  placeholderTextColor={'#C7C7C7'}
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => handleAnswer()}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#E92D87',
                    borderRadius: 7,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../Assets/Icon/tick.png')}
                    style={{height: '50%', width: '65%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {amountModal && (
            <>
              <View
                style={{
                  //height: 80,
                  width: width * 0.9,
                  alignSelf: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  padding: 15,
                  marginTop: height * 0.03,
                  position: 'absolute',
                  top: height * 0.13,
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#151143',
                      fontSize: RFValue(18),
                      fontWeight: '500',
                      //fontFamily: 'Roboto-Medium',
                    }}>
                    Suggested Amount
                  </Text>
                  <TouchableOpacity
                    style={{width: 25, height: 25}}
                    onPress={() => {
                      setAmountModal(false);
                      setMessageStatus(true);
                    }}>
                    <Image
                      source={require('../../Assets/Icon/close.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        tintColor: '#A6A6A6',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignSelf: 'center',
                    marginVertical: height * 0.02,
                  }}>
                  <TextInput
                    value={amount}
                    onChangeText={value => handleAmount(value)}
                    placeholder="Enter Amount"
                    style={
                      shownAmount
                        ? {...styles.selectedInput, color: '#151143'}
                        : styles.input1
                    }
                    placeholderTextColor={'#8E7B85'}
                    autoCorrect={false}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      //onLiveFunc()
                      sendAmountFunc();
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: '#E92D87',
                      borderRadius: 7,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../Assets/Icon/tick.png')}
                      style={{height: '50%', width: '65%'}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <View
            style={{
              position: 'absolute',
              bottom: height * 0.05,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                refRBSheet.current.open();
              }}
              style={{
                width: width * 0.28,
                alignSelf: 'flex-end',
                height: 40,
                marginTop: 15,
                alignItems: 'center',
                backgroundColor: '#000000CC',
                justifyContent: 'center',
                borderRadius: 7,
                borderWidth: 1,
                borderColor: '#E1006E',
              }}>
              <Text
                style={{
                  color: '#E1006E',
                  //fontFamily: 'Roboto-Medium',
                  fontSize: 15,
                }}>
                Questions
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: width * 0.95,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => onSwitchCamera()}
                style={{
                  width: 50,
                  height: 50,
                  //marginVertical: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  //backgroundColor: '#3AB0FF',
                  backgroundColor: '#E1006E',
                  borderRadius: 100,
                }}>
                <Image
                  source={require('../../Assets/Icon/camera1.png')}
                  style={{
                    height: 30,
                    width: 25,
                    //tintColor: '#E1006E',
                    tintColor: '#fff',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {isLoading ? (
                <View>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      // borderWidth: 1,
                      //borderColor: 'rgba(225,225,225,0.7)',
                      borderRadius: 100,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(225,225,225,0.7)',
                    }}>
                    <ActivityIndicator size={40} color="#E1006E" style={{}} />
                  </View>
                  <Text
                    style={{
                      fontSize: RFValue(20),
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                      alignSelf: 'center',
                    }}>
                    Please Wait
                  </Text>
                </View>
              ) : (
                <View>
                  {recordingStatus ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          onStopRecording();
                        }}
                        style={{
                          width: 80,
                          height: 80,
                          //borderWidth: 9,
                          //borderColor: 'rgba(225,225,225,0.7)',
                          borderRadius: 100,
                          alignSelf: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            width: 65,
                            height: 65,
                            //borderWidth: 9,
                            //borderColor: 'rgba(225,225,225,0.7)',
                            borderRadius: 100,
                            alignSelf: 'center',
                            backgroundColor: 'red',
                          }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: RFValue(20),
                          color: '#FFFFFF',
                          //fontFamily: 'Roboto-Medium',
                          fontWeight: '500',
                          alignSelf: 'center',
                        }}>
                        Stop Recording
                      </Text>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          onVideoRecording();
                        }}
                        style={{
                          width: 80,
                          height: 80,
                          //borderWidth: 9,
                          //borderColor: 'rgba(225,225,225,0.7)',
                          borderRadius: 100,
                          alignSelf: 'center',
                        }}>
                        <Image
                          source={require('../../Assets/Icon/cameralive.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            //tintColor: 'red',
                          }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: RFValue(20),
                          color: '#FFFFFF',
                          //fontFamily: 'Roboto-Medium',
                          fontWeight: '500',
                          alignSelf: 'center',
                        }}>
                        Make Video
                      </Text>
                    </>
                  )}
                </View>
              )}

              <View style={{width: 50}} />
            </View>

            {answerStatus || messageStatus ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    nextQuestionIndex();
                  }}
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    width: width * 0.55,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#E1006E',
                    backgroundColor: '#000',
                    marginVertical: height * 0.02,
                  }}>
                  <Text
                    style={{color: '#E1006E', fontSize: 16, fontWeight: '600'}}>
                    Not Interest to Answer
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
            <RBSheet
              height={370}
              animationType="slide"
              ref={refRBSheet}
              closeOnDragDown={false}
              closeOnPressMask={true}
              closeOnSwipeDown={false}
              customStyles={{
                container: {
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                },
                wrapper: {
                  backgroundColor: 'transparent',
                  // backgroundColor: 'rgba(0,0,0,0.3)',
                  //backgroundColor: 'rgba(225,225,225,0.1)',
                },
                draggableIcon: {
                  backgroundColor: '#000',
                },
              }}>
              <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}>
                <View
                  style={{
                    height: '98%',
                    width: '100%',
                    //backgroundColor: 'red',
                  }}>
                  {props.route.params.questionList.length == 0 ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '30%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          color: '#769292',
                          //fontFamily: 'Rubik',
                          fontWeight: 'normal',
                          letterSpacing: 0.9,
                        }}>
                        No Question
                      </Text>
                    </View>
                  ) : (
                    <>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{width: '100%'}}
                        contentContainerStyle={{}}>
                        <View
                          style={{
                            marginBottom: height * 0.02,
                            width: '100%',
                          }}>
                          {props.route.params.questionList.map(
                            (item, index1) => {
                              return (
                                <View
                                  key={index1}
                                  style={{
                                    marginVertical: 5,
                                    flexDirection: 'row',
                                    // height: 100,
                                    alignSelf: 'center',

                                    width: '95%',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: '85%',
                                      //justifyContent: 'space-between',
                                      marginBottom: 5,
                                      //backgroundColor: 'pink',
                                      alignSelf: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        width: '90%',
                                        fontSize: RFValue(15),
                                        color: '#000',
                                        fontWeight: '500',
                                      }}>
                                      <Text
                                        style={{
                                          width: '95%',
                                          fontSize: RFValue(15),
                                          color: '#000',
                                          fontWeight: 'bold',
                                        }}>
                                        {'Que: '}
                                      </Text>
                                      {item.question}
                                    </Text>
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      //setQuestionData(item);
                                      answerQuestionFunc(item);
                                      refRBSheet.current.close();
                                    }}
                                    style={{
                                      paddingHorizontal: 10,
                                      paddingVertical: 10,
                                      backgroundColor: '#E92D87',
                                      borderRadius: 7,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginRight: 10,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: RFValue(13),
                                        color: '#FFF',
                                      }}>
                                      Reply
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                          )}
                        </View>
                      </ScrollView>
                    </>
                  )}
                </View>
              </View>
            </RBSheet>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  fullscreen: {
    width: width,
    height: height,
  },
  buttonContainer: {
    right: '6%',
    position: 'absolute',
    bottom: '7%',
    alignItems: 'flex-end',
  },
  button: {
    width: 150,
    backgroundColor: '#fff',
    marginBottom: 50,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 17,
  },
  broadcasterVideoStateMessage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  broadcasterVideoStateMessageText: {
    color: '#fff',
    fontSize: 20,
  },

  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#000',
    borderWidth: 1,
    //borderColor: '#E92D87',
    color: '#151143',
  },

  selectedInput: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#000',
    borderWidth: 1,
    borderColor: '#E92D87',
  },

  input1: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    backgroundColor: '#EBE0E5',
    color: '#000',
  },
});
