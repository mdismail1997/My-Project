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
  TextInput,
  Modal,
  Alert,
  ScrollView,
  Share,
} from 'react-native';

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRemoteState,
  DataStreamConfig,
  RtcEngineContext,
} from 'react-native-agora';
//import {v4 as uuid} from 'uuid';

import {appID, agoraToken} from '../../Services/constants';
import {getApicall, postApiCall} from '../../Services/Network';
const {width, height} = Dimensions.get('window');
import {RFValue} from 'react-native-responsive-fontsize';
import {image_url} from '../../Services/constants';
import {ProfileContext} from '../../Services/ProfileProvider';
import RBSheet from 'react-native-raw-bottom-sheet';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import Pusher from 'pusher-js';
import {
  SOCKET_URL,
  PUSHER_APP_KEY,
  PUSHER_APP_CLUSTER,
  SOCKET_PORT,
} from '../../Services/constants';
import Toast from 'react-native-toast-message';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

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
        Alert.alert('Microphone Permission Denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function OnLive(props) {
  const isBroadcaster = props.route.params.type === 'create';

  const {profileContextData, token, questionList, setQuestionList} =
    useContext(ProfileContext);

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
  const [joined, setJoined] = useState(false);

  const [pusher1, setPusher1] = useState(null);

  const [follow, setFollow] = useState(null);
  const [like, setLike] = useState(null);

  const [favourites, setFavourites] = useState(null);
  const [amountModal, setAmountModal] = useState(false);
  const [questionModal, setQuestionModal] = useState(false);
  const [celebrityAmount, setCelebrityAmount] = useState('');
  const [questionData, setQuestionData] = useState('');
  const [question, setQuestion] = useState('');

  const refRBSheet = useRef();

  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );
  const AgoraEngine = useRef();
  const init = async () => {
    //AgoraEngine.current = await RtcEngine.create(appID);
    AgoraEngine.current = await RtcEngine.create(appID);
    AgoraEngine.current.enableVideo();
    // Set audio route to speaker
    await AgoraEngine.current.setDefaultAudioRoutetoSpeakerphone(true);
    AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    if (isBroadcaster)
      AgoraEngine.current.setClientRole(ClientRole.Broadcaster);

    AgoraEngine.current.addListener('RemoteVideoStateChanged', (uid, state) => {
      if (uid === 1) setBroadcasterVideoState(state);
    });

    AgoraEngine.current.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
    });
    AgoraEngine.current.addListener('Error', errorCode => {
      console.info('Error', errorCode);
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

    AgoraEngine.current.addListener('UserJoined', (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);
      //this.setState({remoteUid: [...this.state.remoteUid, uid]});
    });

    AgoraEngine.current.addListener('StreamMessage', (uid, streamId, data) => {
      console.info('StreamMessage', uid, streamId, data);
      Alert.alert(`Receive from uid:${uid}`, `StreamId ${streamId}:${data}`, [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
    });
  };

  const data = props.route.params.data;

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission();
    } else if (Platform.OS === 'ios') {
      requestCameraAndAudioPermissionIOS();
    }
    const uid = isBroadcaster ? 1 : 0;
    init().then(() =>
      AgoraEngine.current.joinChannel(
        agoraToken,
        props.route.params.channel,
        null,
        uid,
      ),
    );
    update();

    return () => {};
  }, [props.route.params.channel]);

  const update = () => {
    setQuestion('');
    setFollow(data.follow);

    setFavourites(data.favourite);
    setLike(data.like);
  };

  // useEffect(() => {
  //   createConnection();
  //   update();
  //   return () => {
  //     disconnectSocket();
  //   };
  // }, [props.route.params.channel]);

  const createConnection = async () => {
    Pusher.logToConsole = true;

    pusher.connection.bind('error', function (err) {
      if (err.error.data) {
        if (err.error.data.code === 4004) {
          console.log('Over limit!');
        } else {
          console.log('error', err.error.data);
        }
      }
    });
    pusher.connection.bind('connected', function (data) {
      console.warn('Connected', data);
      setPusher1(pusher);
      const channel = pusher.subscribe('user-message-sent');

      channel.bind('UserAnswerMessage', data => {
        let tempArr = questionList;
        // handle the event data
        console.warn('data==>', 'UserAnswerMessage', data.message);

        for (let i = 0; i < tempArr.length; i++) {
          if (
            tempArr[i].id == data.message.question_id &&
            tempArr[i].answer == ''
          ) {
            tempArr[i].answer = data.message.answer;
          }
        }
        console.log('UserAnswerMessage tempArr===>', tempArr);
        setQuestionList([...tempArr]);
      });

      channel.bind('QuestionAnswerMessage', data => {
        // handle the event data

        console.warn('data==>', 'QuestionAnswerMessage', data, questionList);

        let tempArr = questionList;
        console.log('======tempArr====>', tempArr);

        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].id == data.message.question_id) {
            tempArr[i].answer = data.message.answer;
          }
        }
        console.log('QuestionAnswerMessage tempArr===>', tempArr);
        setQuestionList([...tempArr]);
      });
      // channel.trigger(
      //   'celebrity',
      //   {email: props.route.params.data.email},
      //   data => {
      //     console.log('data===>', data);
      //     setQuestionList(data);
      //   },
      // );
    });
  };
  const disconnectSocket = async () => {
    Pusher.logToConsole = false;

    pusher.connection.bind('error', function (err) {
      if (err.error.data) {
        if (err.error.data.code === 4004) {
          console.log('Over limit!');
        } else {
          console.log('error', err.error.data);
        }
      }
    });
    pusher.connection.bind('connected', function (data) {
      pusher.unsubscribe('user-message-sent');
      pusher1.disconnect();
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

  const questionHandel = value => {
    setQuestion(value);
  };

  const handleLike = async () => {
    const sendData = {
      email: data.email,
    };
    await postApiCall('celebritylike', sendData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          setLike(true);
          Toast.show({
            type: 'success',
            text1: response.data.data,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Celebrity has not been liked yet',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded

          console.log('error in response==>', error.response.data);
          if (error.response.data.data.length === 0) {
            var firstItem = error.response.data.message;
          } else {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          }

          Toast.show({
            type: 'info',
            text1: error.response.data.message,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(error.message);
        }
      });
  };

  const handleFavourites = async () => {
    const sendFavouritesData = {
      email: data.email,
    };
    await postApiCall('celebrityfavourites', sendFavouritesData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          setFavourites(true);
          Toast.show({
            type: 'success',
            text1: 'Favourite added',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Not added as Favourite',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);

          Toast.show({
            type: 'info',
            text1: 'Favourite is already added',
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

  const handleFollow = async () => {
    const sendData1 = {
      email: data.email,
    };
    await postApiCall('celebrityfollow', sendData1, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          setFollow(true);

          Toast.show({
            type: 'success',
            text1: response.data.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Celebrity has not been follow',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
          // ToastAndroid.show('You are already following', ToastAndroid.SHORT);
          Toast.show({
            type: 'info',
            text1: 'You are already following',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(error.message);
        }
      });
  };

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://qspace1.page.link/qspace?liveCelebrity=${data.email}`,
          domainUriPrefix: 'https://qspace1.page.link',
          android: {
            packageName: 'com.qspace',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'com.qspace',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      console.log('link:', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };

  const handleShare = async () => {
    //console.log('Share');
    const getLink = await generateLink();
    //const getLink = await buildLink();
    console.log('==========>', getLink);
    try {
      Share.share({
        message: getLink,
        url: getLink,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };

  const handleQuestionAmount = value => {
    setCelebrityAmount(value);
  };

  const sendQuestion = () => {
    if (question.trim() == '') {
      setQuestionModal(false);
      Toast.show({
        type: 'error',
        text1: 'Please Enter the Question you want to ask',
      });
    } else {
      sendQuestion1();
    }
  };

  const sendQuestion1 = async () => {
    const questionData = {
      email: data.email,
      question: question,
      chanel_id: props.route.params.channel,
      amount: '',
    };
    console.log('=====questionData==>', questionData);
    await postApiCall('user-add-question', questionData, {})
      .then(async response => {
        console.log('response==>', response.data.data.id);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Question has been successfully send',
          });
          setQuestion('');
          setCelebrityAmount('');
          setAmountModal(false);
          setQuestionModal(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Question has not been successfully send',
          });
        }
      })
      .catch(function (error) {
        setAmountModal(false);
        setQuestionModal(false);
        setQuestion('');
        setCelebrityAmount('');
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          if (error.response.data.data.length === 0) {
            var firstItem = error.response.data.message;
          } else {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          }
          console.log('====>firstItem', firstItem);
          setQuestion('');
          setCelebrityAmount('');
          Toast.show({
            type: 'error',
            text1: firstItem,
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

  const sendAmount = () => {
    if (celebrityAmount.trim() == '') {
      setAmountModal(false);
      Toast.show({
        type: 'error',
        text1: 'Please Enter your amount',
      });
    } else {
      sendAmount1();
    }
  };

  const sendAmount1 = async () => {
    console.log('======>', questionData, celebrityAmount);
    const amountData = {
      question_id: questionData.id,
      amount: celebrityAmount,
      //celebrityemail: data.email,
    };
    console.log('=================>', amountData);
    await postApiCall('pay-for-answer', amountData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Amount Send',
          });
          setQuestion('');
          setCelebrityAmount('');
          setAmountModal(false);
          setQuestionModal(false);

          let tempArr = questionList;
          tempArr.map(item => {
            if (item.id == questionData.id) {
              item.amount_status = '1';
            }
          });
          setQuestionList([...tempArr]);
        } else {
          Toast.show({
            type: 'error',
            text1: response.data.message,
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          setAmountModal(false);
          setQuestionModal(false);
          console.log('error in response==>', error.response.data);
          // if (error.response.data.data.length === 0) {
          //   var firstItem = error.response.data.message;
          // } else {
          //   var myobj = error.response.data.data;
          //   var firstItem = Object.values(myobj)[0];
          // }

          Toast.show({
            type: 'info',
            text1: error.response.data.message,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      {!joined ? (
        <>
          <ActivityIndicator
            size={60}
            color="#E1006E"
            style={styles.activityIndicator}
          />
          <Text style={styles.loadingText}>Joining Stream, Please Wait</Text>
        </>
      ) : (
        <>
          {isBroadcaster ? renderLocal() : renderHost()}
          <View
            style={{
              position: 'absolute',
              top: height * 0.05,
              flexDirection: 'row',
              //margin: 5,
              marginTop: height * 0.01,
              width: width * 0.9,
              justifyContent: 'space-between',
              //backgroundColor: 'blue',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  alignItems: 'center',
                }}>
                <Image
                  source={{
                    uri:
                      data.image === null
                        ? image_url + 'profile_no_image.jpg'
                        : data.image,
                  }}
                  //source={require('../../Assets/Images/angelina.png')}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 100,
                  }}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  marginLeft: width * 0.01,
                  marginTop: height * 0.011,
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: RFValue(20),
                    color: '#FFFFFF',
                    //fontFamily: 'Roboto-Regular',
                    fontWeight: '400',
                  }}>
                  #{data.username}
                </Text>

                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: '#FFFFFF',
                    //fontFamily: 'Roboto-Light',
                    fontWeight: '300',
                  }}>
                  {data.bio}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: height * 0.01,
              }}>
              <Text
                style={{
                  fontSize: RFValue(18),
                  //fontFamily: 'Roboto-Medium',
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}>
                {data.totalfollow}
              </Text>

              <View style={{width: 20, height: 26, marginTop: 10}}>
                <Image
                  source={require('../../Assets/Icon/unlock.png')}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          <View
            style={{
              right: '6%',
              position: 'absolute',
              bottom: '7%',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => handleLike()}
              style={{width: 27, height: 26}}>
              <Image
                source={require('../../Assets/Icon/Like.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  tintColor: like ? '#E92D87' : '#fff',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleFavourites();
              }}
              style={{width: 27, height: 26, marginTop: 17}}>
              <Image
                source={require('../../Assets/Icon/heart.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  tintColor: favourites ? '#E92D87' : '#fff',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare()}
              style={{width: 27, height: 26, marginTop: 15}}>
              <Image
                source={require('../../Assets/Icon/share.png')}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => handleFollow()}
                style={{
                  width: width * 0.23,
                  height: 40,
                  marginTop: 15,
                  alignItems: 'center',
                  backgroundColor: '#E1006E',
                  justifyContent: 'center',
                  borderRadius: 7,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    //fontFamily: 'Roboto-Medium',
                    fontSize: 16,
                  }}>
                  Follow
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => {
                  // notInterested();
                  refRBSheet.current.open();
                }}
                style={{
                  width: width * 0.28,
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
              </TouchableOpacity> */}

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
                <View
                  style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}>
                  <View
                    style={{
                      height: '98%',
                      width: '100%',
                      //backgroundColor: 'red',
                    }}>
                    {questionList.length == 0 ? (
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
                        {/* <TouchableOpacity
                          style={{
                            marginVertical: height * 0.05,
                            width: width * 0.5,
                            backgroundColor: '#E92D87',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10,
                            height: 50,
                          }}
                          onPress={() => {
                            refRBSheet.current.close();
                            setTimeout(() => {
                              setQuestionModal(true);
                            }, 300);
                          }}>
                          <Text
                            style={{fontSize: RFValue(15), color: '#FFFFFF'}}>
                            Add Question
                          </Text>
                        </TouchableOpacity> */}
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
                            {questionList.map((item, index1) => {
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
                                    {item.answer != '' &&
                                      item.amount_status != '' && (
                                        <Text
                                          style={{
                                            width: '95%',
                                            fontSize: RFValue(14),
                                            color: '#000',
                                            fontWeight: '300',
                                          }}>
                                          <Text
                                            style={{
                                              width: '95%',
                                              fontSize: RFValue(15),
                                              color: '#000',
                                              fontWeight: 'bold',
                                            }}>
                                            {'Ans: '}
                                          </Text>
                                          {item.answer}
                                        </Text>
                                      )}
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      setQuestionData(item);
                                      refRBSheet.current.close();
                                      setTimeout(() => {
                                        setAmountModal(true);
                                      }, 300);
                                    }}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      backgroundColor: '#E92D87',
                                      borderRadius: 7,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginRight: 10,
                                    }}>
                                    <Image
                                      source={require('../../Assets/Icon/dollar.png')}
                                      style={{height: '50%', width: '50%'}}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        </ScrollView>
                        {/* <TouchableOpacity
                          style={{
                            marginVertical: height * 0.01,
                            marginRight: width * 0.05,
                            backgroundColor: '#E92D87',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10,
                            alignSelf: 'flex-end',
                          }}
                          onPress={() => {
                            refRBSheet.current.close();
                            setTimeout(() => {
                              setQuestionModal(true);
                            }, 300);
                          }}>
                          <Text
                            style={{fontSize: RFValue(15), color: '#FFFFFF'}}>
                            Add Question
                          </Text>
                        </TouchableOpacity> */}
                      </>
                    )}
                  </View>
                </View>
              </RBSheet>

              {/* <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  width: width * 0.89,
                  height: 50,
                  //backgroundColor: 'red',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  value={question}
                  onChangeText={value => questionHandel(value)}
                  placeholder="Ask about something?"
                  style={{
                    ...styles.input,
                    backgroundColor: '#000',
                    color: '#fff',
                  }}
                  placeholderTextColor={'#C7C7C7'}
                  autoCorrect={false}
                />

                <TouchableOpacity
                  onPress={() => sendQuestion()}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#E92D87',
                    borderRadius: 7,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../Assets/Icon/dollar.png')}
                    style={{height: '50%', width: '50%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View> */}
              <Modal visible={amountModal} transparent={true}>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: '90%',
                      height: 120,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      position: 'absolute',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: RFValue(18),
                          //fontFamily: 'Roboto-Medium',
                          fontWeight: '500',
                        }}>
                        Enter the Amount
                      </Text>
                      <TouchableOpacity
                        style={{
                          height: 20,
                          width: 20,
                        }}
                        onPress={() => setAmountModal(false)}>
                        <Image
                          source={require('../../Assets/Icon/close.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            tintColor: '#000',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        width: width * 0.82,
                        height: 50,
                        //backgroundColor: 'red',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}>
                      <TextInput
                        onChangeText={value => handleQuestionAmount(value)}
                        placeholder="Amount"
                        keyboardType="numeric"
                        style={{
                          ...styles.toLock,
                          backgroundColor: '#EBE0E5',
                          color: '#151143',
                        }}
                        placeholderTextColor={'#8E7B85'}
                        autoCorrect={false}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          sendAmount();
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
                          source={require('../../Assets/Icon/dollar.png')}
                          style={{height: '50%', width: '50%'}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <Modal visible={questionModal} transparent={true}>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: '90%',
                      height: 120,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      position: 'absolute',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: RFValue(18),
                          //fontFamily: 'Roboto-Medium',
                          fontWeight: '500',
                        }}>
                        Ask Question
                      </Text>
                      <TouchableOpacity
                        style={{
                          height: 20,
                          width: 20,
                        }}
                        onPress={() => setQuestionModal(false)}>
                        <Image
                          source={require('../../Assets/Icon/close.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            tintColor: '#000',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        width: width * 0.82,
                        height: 50,
                        //backgroundColor: 'red',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}>
                      <TextInput
                        value={question}
                        onChangeText={value => questionHandel(value)}
                        placeholder="Ask about something?"
                        style={{
                          ...styles.toLock,
                          backgroundColor: '#EBE0E5',
                          color: '#151143',
                        }}
                        placeholderTextColor={'#8E7B85'}
                        autoCorrect={false}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          sendQuestion();
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
                          style={{height: '50%', width: '50%'}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#000',
  },
  fullscreen: {
    width: '100%',
    height: '100%',
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
  text: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#808080',
  },

  textSelect: {
    fontSize: 16.5,
    alignSelf: 'center',
    color: '#E1006E',
  },

  IconStyleSelected: {
    width: 100,
    height: 40,
    borderColor: '#808080',
    //borderWidth: 1,
    //borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderBottomColor: '#E1006E',
    borderBottomWidth: 1,
  },

  IconStyle: {
    width: 100,
    height: 40,
    //backgroundColor: '#fff',
    borderColor: '#808080',
    //borderWidth: 1,
    //borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    // color: '#fff',
  },

  toLock: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#000',
  },
});
