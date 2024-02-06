import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRemoteState,
  DataStreamConfig,
  RtcEngineContext,
  VideoRenderMode,
} from 'react-native-agora';

import database from '@react-native-firebase/database';
import {RFValue} from 'react-native-responsive-fontsize';

import {appID, agoraToken, base_url} from '../../Services/constants';
import Hud from '../Common/Hud';
import {postApiCall, postApiCallFormData} from '../../Services/Network';
import HeaderWithImageTitle from '../Common/HeaderWithImageTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {createThumbnail} from 'react-native-create-thumbnail';

//import RecordScreen from 'react-native-record-screen';

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

export default function CelebrityOnLive(props) {
  const isBroadcaster = props.route.params.type === 'create';

  const [remoteUid, setRemoteUid] = useState([]);
  const [channel, setChannel] = useState(props.route.params.channel);

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

  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );

  const AgoraEngine = useRef();
  const init = async () => {
    //setChannelID(await props.route.params.channel);
    // AgoraEngine.current = await RtcEngine.createWithContext(
    //   new RtcEngineContext(appID),
    // );
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
        console.log('JoinChannelSuccess', channel, uid, elapsed);
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
    if (Platform.OS === 'android') requestCameraAndAudioPermission();
    const uid = isBroadcaster ? 1 : 0;

    setChannel(props.route.params.channel);

    const channelID = props.route.params.channel;
    init().then(() =>
      AgoraEngine.current.joinChannel(
        agoraToken,
        props.route.params.channel,
        null,
        uid,
      ),
    );
    const onChildAdd = database()
      .ref('/live/' + props.route.params.channel)
      .on('child_added', snapshot => {
        console.log('A new node has been added==>', snapshot.val());

        messages.push(snapshot.val());

        console.log('------>', messages.length);
        console.log('====index==>', index);
        console.log('messages live===>', messages);

        if (messages.length !== 0 && messages[index].amount == '') {
          setMessageStatus(true);
        } else if (messages.length !== 0 && messages[index].amount !== '') {
          setAnswerStatus(true);
        }
      });

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   () => {
    //     console.log('startVideo,storedVideo==>', startVideo, storedVideo);
    //     if (startVideo === '1' && storedVideo === '0') {
    //       console.log('hello');
    //     } else {
    //       console.log('=========>hello');
    //       //stopRecording();
    //     }
    //   },
    // );
    return () => {
      AgoraEngine.current.destroy();
      closeLiveStatus();
      // RecordScreen.clean();
      database()
        .ref('/live/' + props.route.params.channel)
        .off('child_added', onChildAdd);

      deleteChat();
    };
  }, [props.route.params.channel]);

  // useEffect(() => {
  //   createConnection();

  //   return () => {
  //     disconnectSocket();
  //   };
  // }, [props.route.params.channel]);

  // const createConnection = async () => {
  //   try {
  //     if (token != null && token != '' && token != 'null') {
  //       const socket1 = io(SOCKET_URL, {
  //         query: {token: token, forceNew: true},
  //       });
  //       console.warn('socket1', socket1);

  //       if (socket1 != null) {
  //         socket1.on('connected', data => {
  //           console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);

  //           if (socket1.connected) {
  //             setSocket(socket1);
  //             console.warn('socket connection', socket1.connected);
  //             // socket1.on('admin_approve', (data) => {
  //             //   console.warn('pause job reason approval status =====>>>', data);
  //             //   i
  //             // });

  //             socket1.on('query_extra_time', data => {});
  //           } else {
  //             console.warn('ggg');
  //           }
  //         });
  //       } else {
  //         console.log('Socket in Null');
  //       }
  //     }
  //   } catch (err) {
  //     console.warn('Error', err);
  //   }
  // };

  // const disconnectSocket = async () => {
  //   console.warn('socket', socket);

  //   if (token != null && token != '' && token != 'null') {
  //     const socket1 = io(SOCKET_URL, {
  //       query: {token: token, forceNew: true},
  //     });
  //     if (socket1 != null) {
  //       socket1.on('connected', data => {
  //         console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);

  //         if (socket1.connected) {
  //           socket1.disconnect();
  //           console.warn('Socket', socket1.connected);
  //         }
  //       });
  //     }
  //     props.navigation.goBack();
  //   }
  // };

  const deleteChat = () => {
    console.log('Delete Chat');
    database()
      .ref('/live/' + props.route.params.channel)
      .remove()
      .then(() => {
        console.log('Data has been deleted');
        //setMessages([]);
      })
      .catch(() => {
        console.log('Error in deleting');
      });
  };

  const closeLiveStatus = async () => {
    console.log('isBroadcaster==>', isBroadcaster);

    // await AgoraEngine.current.disableVideo().then(response => {
    //   console.log(response);
    // });

    Hud.showHud();
    const liveData = {
      channel_id: props.route.params.channel,
      status: 0,
    };
    console.log('Data==>', liveData);
    await postApiCall('celebritylivestatus', liveData, {})
      .then(response => {
        console.log('Live Off===>', response.data);
        Hud.hideHud();
        if (response.status == 200) {
          console.log('Live Close');

          database()
            .ref('/questions/' + props.route.params.channel)
            .push();
          //msgData.id = newReference.key;

          // newReference.set(messages).then(async () => {
          //   console.log('Last text send Api====>', messages);
          //   database()
          //     .ref('/questions/' + props.route.params.channel)
          //     .off('child_added', onChildAdd);
          // });
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

  const onClose = async () => {
    props.navigation.goBack();

    // const streamId = await AgoraEngine.current.createDataStreamWithConfig(
    //   new DataStreamConfig(true, true),
    // );

    // await AgoraEngine.current.sendStreamMessage(streamId, 'messageData');
    // console.log('*******/////////**********', streamId, AgoraEngine.current);
  };

  const sendAnswer = async () => {
    console.log('Sending Answer');
    if (messages[index].amount !== '') {
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
      question_id: messages[index]._id,
      answer: answer,
    };
    console.log('AnswerData==>', answerData);
    await postApiCall('celebrityanswer', answerData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          //nextQuestion();
          sendQuestioninChat();
          //nextQuestionIndex();
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

  const sendQuestioninChat = async () => {
    let msgData = {
      _id: messages[index]._id,
      message: messages[index].message,
      amount: messages[index].amount,
      userName: messages[index].userName,
      image: messages[index].image,
      answer: answer,
    };

    const newReference = database()
      .ref('/live/' + props.route.params.channel)
      .push();
    msgData.id = newReference.key;

    newReference.set(msgData).then(async () => {
      console.log('====>question Send');
      nextQuestionIndex1();
    });
  };

  const nextQuestionIndex1 = async () => {
    console.log(
      'messages.length=====>',
      typeof messages.length,
      messages.length,
    );
    console.log('indexindex==>', typeof index, index);
    setAnswerStatus(false);

    if (messages.length - 2 == index) {
      setMessageStatus(false);
      console.log('no messages left');
      setIndex(index + 2);
    } else {
      setIndex(index + 2);
      console.log('next message==>', messages[index]);
      setMessageStatus(true);
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

  // const startScreenRecording = () => {
  //   RecordScreen.startRecording()
  //     .then(response => {
  //       console.log('Start Recording');
  //       setRecordingStatus(true);
  //     })
  //     .catch(error => console.log('Error in Start Recording', error));
  // };

  // const stopScreenRecording = async () => {
  //   setLoading(true);
  //   const res = await RecordScreen.stopRecording().catch(error =>
  //     console.warn(error),
  //   );
  //   if (res) {
  //     const url = res.result.outputURL;
  //     console.log('========>', url);

  //     uploadScreenVideoFunc('file://' + url);
  //   }
  // };

  const uploadScreenVideoFunc = async file => {
    console.log('======>File===>', file);
    setLoading(true);
    var img;
    try {
      console.log('=====>Thumbnail image==>');
      const imgResponse = await createThumbnail({
        url: file,
        timeStamp: 100,
      });
      console.log('Thumbnail response==>', imgResponse);
      img = imgResponse.path;
      console.log('===>', img);
    } catch (error) {
      console.log('error in ThumbNail==>', error);
      img =
        'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132__340.png';
    }
    let data = new FormData();
    data.append('video_type', 4);
    data.append('channel_id', props.route.params.channel);
    data.append('file', {
      //uri: file,
      uri: file,
      name: 'name.mp4',
      type: 'video/mp4',
    });
    data.append('image', {
      uri: img,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
    console.log('====Data====>', data._parts);

    setRecordingStatus(false);
    setLoading(true);
    const AccessToken = await AsyncStorage.getItem('token');
    //console.log('Access token==>', AccessToken);

    try {
      let res = await fetch(base_url + 'celebritypost', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      let responseJson = await res.json().then(response => {
        console.log('responseJson===>', response);
        setLoading(false);
        setStoredVideo('2');
        if (response.success === true) {
          setRecordingStatus(false);
        } else {
          var myobj = response.data.file;
          var firstItem = Object.values(myobj)[0];
          //console.log('====>firstItem', firstItem);
          //console.log('====>firstItem', typeof firstItem);
          Toast.show({
            type: 'error',
            text1: firstItem,
          });
        }
      });
    } catch (error) {
      //  Hud.hideHud();
      setLoading(false);
      console.log('Error==>', error);
    } finally {
      //Hud.hideHud();
      //setShowModal(false);
    }
  };

  const onStopRecording = () => {
    stopRecording();
    // stopScreenRecording();
  };

  const startRecording = async () => {
    setLoading(true);
    const bodyData = {
      cname: channel,
      uid: 112,
      // uid: recUid,
    };
    console.log('bodyData=', bodyData);
    await postApiCall('cloud-reocording/start', bodyData, {})
      .then(response => {
        setLoading(false);
        setStartVideo('1');
        console.log('response==>', response.data);
        if (response.status == 200) {
          setRecordingStatus(true);
          console.log('response 200 data==>', response.data);
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
      cname: channel,
      uid: 112,
      resourceId: rid,
      serviceId: sid,
    };
    console.log('===bodyData==>', bodyData);
    await postApiCall('cloud-reocording/stop', bodyData, {})
      .then(response => {
        setLoading(false);
        setStoredVideo('2');
        console.log('response==>', response.data.data);
        if (response.status == 200) {
          setRecordingStatus(false);
          // console.log('response 200 data==>', response.data.data);
          uploadVideoFunc(response.data.data.file_url);
        }
      })
      .catch(function (error) {
        setLoading(false);
        // setStoredVideo(true);
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error.request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error.Setting===>', error.message);
        }
      });
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
    const AccessToken = await AsyncStorage.getItem('token');

    try {
      let res = await fetch(base_url + `celebritypost`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Authorization: `Bearer ${AccessToken}`,
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
    const newReference1 = database()
      .ref('/question/' + messages[index].userName)
      .push();
    // msgData.id = newReference1.key;

    newReference1.set(msgData).then(async () => {
      console.log('Last text send Api====>', msgData);
      setAmountModal(false);
      setAmount('');
      //setIndex(index + 1);
      nextQuestionIndex();
    });
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

          {messageStatus ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  sendAnswer();
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
                  {messages[index].amount !== '' && (
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '400',
                        color: '#E92D87',
                        marginBottom: 10,
                      }}>
                      ${messages[index].amount}
                    </Text>
                  )}
                </View>

                <Text
                  style={{fontSize: 17, fontWeight: '400', color: '#151143'}}>
                  {messages[index].message}?
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          {answerStatus ? (
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
          ) : null}

          {amountModal ? (
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
          ) : null}

          <View
            style={{
              position: 'absolute',
              bottom: height * 0.05,
              alignSelf: 'center',
            }}>
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
                  backgroundColor: '#3AB0FF',
                  //backgroundColor: '#E1006E',
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
