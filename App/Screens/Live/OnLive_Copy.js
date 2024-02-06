import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  Share,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  FlatList,
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
import database from '@react-native-firebase/database';

import {appID, agoraToken} from '../../Services/constants';
import Hud from '../Common/Hud';
import {getApicall, postApiCall} from '../../Services/Network';
const {width, height} = Dimensions.get('window');
import {RFValue} from 'react-native-responsive-fontsize';
import {image_url} from '../../Services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileContext} from '../../Services/ProfileProvider';
import RBSheet from 'react-native-raw-bottom-sheet';

import Toast from 'react-native-toast-message';

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

export default function OnLive2(props) {
  const isBroadcaster = props.route.params.type === 'create';

  const {profileContextData} = useContext(ProfileContext);

  const onShare = async () => {
    try {
      const result = await Share.share({message: props.route.params.channel});
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log('=======profileContextData====>', profileContextData.username);

  const [joined, setJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageStatus, setMessageStatus] = useState(false);
  const [index, setIndex] = useState(0);
  const [questionList, setQuestionList] = useState([]);

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

    // await AgoraEngine.current.setVideoEncoderConfiguration(
    //   new VideoEncoderConfiguration({
    //     dimensions: new VideoDimensions(320, 240),
    //     bitrate: 140,
    //     frameRate: VideoFrameRate.Fps30,
    //     degradationPrefer: 0,
    //   }),
    // );

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
    if (Platform.OS === 'android') requestCameraAndAudioPermission();
    const uid = isBroadcaster ? 1 : 0;
    init().then(() =>
      AgoraEngine.current.joinChannel(
        agoraToken,
        props.route.params.channel,
        null,
        uid,
      ),
    );

    const onChildAdd = database()
      .ref('/question/' + profileContextData.username)
      .on('child_added', snapshot => {
        console.log('A new node has been added==>', snapshot.val());

        messages.push(snapshot.val());

        console.log('------>', messages.length);
        console.log('messages===>', messages);

        if (messages.length !== 0) {
          setMessageStatus(true);
        }
      });
    //   getApi();
    update();

    const onChildAdd1 = database()
      .ref('/live/' + props.route.params.channel)
      .on('child_added', snapshot => {
        console.log('A new node has been added in live==>', snapshot.val());
        if (snapshot.val().amount !== '' && snapshot.val().answer != '') {
          questionList.push(snapshot.val());
          setQuestionList([...questionList]);
          console.log('=====questionList=====>', questionList);
        }
      });

    return () => {
      database()
        .ref('/question/' + profileContextData.username)
        .off('child_added', onChildAdd);

      database()
        .ref('/live/' + props.route.params.channel)
        .off('child_added', onChildAdd1);

      deleteChat();
    };
  }, [props.route.params.channel]);

  const deleteChat = () => {
    console.log('Delete Chat');
    database()
      .ref('/question/' + profileContextData.username)
      .remove()
      .then(() => {
        console.log('Data has been deleted');
      })
      .catch(() => {
        console.log('Error in deleting');
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

  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [follow, setFollow] = useState(null);
  const [like, setLike] = useState(null);
  const [minAmountStatus, setMinAmountStatus] = useState(true);

  const [favourites, setFavourites] = useState(null);
  const [status, setStatus] = useState(null);

  const [amountModal, setAmountModal] = useState(false);
  const [celebrityAmount, setCelebrityAmount] = useState('');

  const update = async () => {
    setQuestion('');
    setComment('');
    setFollow(data.follow);

    setFavourites(data.favourite);
    setLike(data.like);
  };

  const getApi = async () => {
    const celebrityData = JSON.parse(
      await AsyncStorage.getItem('celebrityData'),
    );
    const emailData1 = {
      email: celebrityData.email,
    };

    await postApiCall('celebrityprofilereactions', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data);
        // Hud.hideHud();
        if (response.status == 200) {
          //console.log(response.data.data);
          setData(response.data.data);
          setFollow(response.data.data.follow);
          setStatus(response.data.data.private);
          setFavourites(response.data.data.favourite);
          setLike(response.data.data.like);
          setQuestion('');
          setComment('');
          //setLoading(false);
        } else {
          //setLoading(false);
          console.log('error on loading celebrity in Celebrity Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        console.log('error in getApi Function==>', error);
        //setLoading(false);
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

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

  const handleShare = async () => {
    //console.log('Share');
    try {
      const result = await Share.share({
        title: 'Celebrity Profile!',
        message: `Please check the profile!\r\n\r\nhttps://www.youtube.com/watch?v=vXzpEJeVmi8&t=4s\r\n\r\nLet's get moving!`,
        url: 'https://www.youtube.com/watch?v=vXzpEJeVmi8&t=4s',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('It has been Share');
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share has been dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const handleQuestionAmount = value => {
    setCelebrityAmount(value);
  };

  const sendQuestion = async () => {
    console.log(
      'minAmount==>',
      typeof props.route.params.minAmount,
      props.route.params.minAmount,
    );
    console.log(
      '====>',
      parseInt(messages[index].amount) + props.route.params.minAmount,
    );
    if (
      celebrityAmount <
      props.route.params.minAmount + parseInt(messages[index].amount)
    ) {
      var totalMinAmount =
        props.route.params.minAmount + parseInt(messages[index].amount);
      // setQuestion('');
      //  setCelebrityAmount('');
      // setAmountModal(false);
      // Toast.show({
      //   type: 'info',
      //   text1: `Please send atleast ${totalMinAmount} $ for your question`,
      // });
      Alert.alert(`Please send atleast ${totalMinAmount} $ for your question`);
    } else {
      const questionData = {
        email: data.email,
        question: question,
        amount: celebrityAmount,
        currency: profileContextData.currency,
      };
      console.log('=====questionData==>', questionData);
      await postApiCall('addquestion', questionData, {})
        .then(async response => {
          console.log('response==>', response.data.data.id);
          if (response.status == 200) {
            setQuestion('');
            setCelebrityAmount('');
            setAmountModal(false);
            let msgData = {
              _id: response.data.data.id,
              message: question,
              amount: celebrityAmount,
              userName: profileContextData.username,
              image: profileContextData.profile_image,
              answer: '',
            };
            const newReference = database()
              .ref('/live/' + props.route.params.channel)
              .push();
            msgData.id = newReference.key;

            newReference.set(msgData).then(async () => {
              setIndex(index + 1);
              // console.log('Last text send Api====>', msgData);
              Toast.show({
                type: 'success',
                text1: 'Question has been successfully send',
              });
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Question has not been successfully send',
            });
          }
        })
        .catch(function (error) {
          setAmountModal(false);
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
    }
  };

  const sendQuestion1 = async () => {
    console.log('==========>', profileContextData.username);
    let msgData = {
      message: question,
      amount: '',
      userName: profileContextData.username,
      answer: '',
    };
    const newReference = database()
      .ref('/live/' + props.route.params.channel)
      .push();
    msgData.id = newReference.key;

    newReference.set(msgData).then(async () => {
      // console.log('Last text send Api====>', msgData);
      Toast.show({
        type: 'success',
        text1: 'Question has been successfully send',
      });
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
                {data.image === null ? (
                  <Image
                    source={{
                      uri: image_url + 'profile_no_image.jpg',
                    }}
                    //source={require('../../Assets/Images/angelina.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 100,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={{
                      uri: data.image,
                    }}
                    //source={require('../../Assets/Images/angelina.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 100,
                    }}
                    resizeMode="cover"
                  />
                )}
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

          {minAmountStatus && (
            <View
              style={{
                position: 'absolute',
                top: height * 0.1,
                width: width * 0.8,
                //height: height * 0.3,
                alignSelf: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                padding: 15,
                marginTop: height * 0.1,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#151143',
                  marginBottom: 10,
                }}>
                The minimum amount for asking question is $
                {props.route.params.minAmount}
              </Text>

              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 50,
                  backgroundColor: '#E92D87',
                  borderRadius: 10,
                  marginTop: 10,
                }}
                onPress={() => {
                  setMinAmountStatus(false);
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    //color: '#151143',
                    color: '#fff',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {messageStatus && (
            <View
              style={{
                position: 'absolute',
                top: height * 0.1,
                width: width * 0.8,
                //height: height * 0.3,
                alignSelf: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                padding: 15,
                marginTop: height * 0.1,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#151143',
                  marginBottom: 10,
                }}>
                The minimum amount for asking this question is $
                {messages[index].amount}
              </Text>

              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 50,
                  backgroundColor: '#E92D87',
                  borderRadius: 10,
                  marginTop: 10,
                }}
                onPress={() => {
                  setMessageStatus(false);
                  setAmountModal(true);
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    //color: '#151143',
                    color: '#fff',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
                style={
                  like
                    ? {
                        height: '100%',
                        width: '100%',
                        tintColor: '#E92D87',
                      }
                    : {height: '100%', width: '100%', tintColor: '#fff'}
                }
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
                style={
                  favourites
                    ? {
                        height: '100%',
                        width: '100%',
                        tintColor: '#E92D87',
                      }
                    : {height: '100%', width: '100%', tintColor: '#fff'}
                }
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => handleShare()}
              style={{width: 27, height: 26, marginTop: 15}}>
              <Image
                source={require('../../Assets/Icon/share.png')}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </TouchableOpacity> */}

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

              <TouchableOpacity
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
              </TouchableOpacity>

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
                      </View>
                    ) : (
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{width: '100%'}}
                        contentContainerStyle={
                          {
                            //paddingBottom: 10,
                            // width: '100%',
                            //justifyContent: 'center',
                            //alignItems: 'center',
                          }
                        }>
                        <View
                          style={{marginBottom: height * 0.02, width: '100%'}}>
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
                                  //alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 100,
                                    //  marginRight: 10,
                                  }}>
                                  <Image
                                    source={{
                                      uri: item.image,
                                    }}
                                    style={{
                                      height: '100%',
                                      width: '100%',
                                      borderRadius: 100,
                                    }}
                                    resizeMode="cover"
                                  />
                                </View>
                                <View style={{width: '84%'}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      width: '95%',
                                      justifyContent: 'space-between',
                                      marginBottom: 5,
                                    }}>
                                    <Text
                                      style={{
                                        width: '90%',
                                        fontSize: RFValue(15),
                                        color: '#000',
                                        //fontFamily: 'Roboto-Medium',
                                        fontWeight: '500',
                                      }}>
                                      {item.message}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: RFValue(15),
                                        color: '#E1006E',
                                        //fontFamily: 'Roboto-Medium',
                                        fontWeight: '500',
                                      }}>
                                      ${item.amount}
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      width: '95%',
                                      fontSize: RFValue(14),
                                      color: '#000',
                                      //fontFamily: 'Roboto-Light',
                                      fontWeight: '300',
                                    }}>
                                    {item.answer}
                                  </Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    )}

                    {/* <FlatList
                      data={questionList}
                      horizontal={false}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item, index}) => (
                        <View
                          key={index}
                          style={{
                            marginVertical: 5,
                            flexDirection: 'row',
                            // height: 100,
                            alignSelf: 'center',

                            width: '95%',
                            justifyContent: 'space-between',
                            //alignItems: 'center',
                          }}>
                          <View
                            style={{
                              height: 50,
                              width: 50,
                              borderRadius: 100,
                              //  marginRight: 10,
                            }}>
                            <Image
                              source={{
                                uri: 'https://demos.mydevfactory.com/qspice_backend/public/user_images/b294fff85e9ce2aa2d4d1268c7f9726c.jpg',
                              }}
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 100,
                              }}
                              resizeMode="cover"
                            />
                          </View>
                          <View style={{width: '84%'}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '95%',
                                justifyContent: 'space-between',
                                marginBottom: 5,
                              }}>
                              <Text
                                style={{
                                  width: '90%',
                                  fontSize: RFValue(15),
                                  color: '#000',
                                  //fontFamily: 'Roboto-Medium',
                                  fontWeight: '500',
                                }}>
                                question
                              </Text>
                              <Text
                                style={{
                                  fontSize: RFValue(15),
                                  color: '#E1006E',
                                  //fontFamily: 'Roboto-Medium',
                                  fontWeight: '500',
                                }}>
                                12$
                              </Text>
                            </View>
                            <Text
                              style={{
                                width: '95%',
                                fontSize: RFValue(14),
                                color: '#000',
                                //fontFamily: 'Roboto-Light',
                                fontWeight: '300',
                              }}>
                              answervfsmkbfmbfklmbgklbgmklgnmkmnhklm
                            </Text>
                          </View>
                        </View>
                      )}
                    /> */}
                  </View>
                </View>
              </RBSheet>

              <View
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
                  onPress={() =>
                    //setAmountModal(true)
                    sendQuestion1()
                  }
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
                        width: '100%',
                        height: '30%',

                        alignItems: 'center',
                        justifyContent: 'flex-end',
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
                              source={require('../../Assets/Icon/dollar.png')}
                              style={{height: '50%', width: '50%'}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
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
    //backgroundColor: 'red',
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
    //fontFamily: 'Roboto-Regular',
  },

  textSelect: {
    fontSize: 16.5,
    alignSelf: 'center',
    color: '#E1006E',
    //fontFamily: 'Roboto-Regular',
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
