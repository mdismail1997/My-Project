import React, {useState, useEffect, useContext} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  BackHandler,
} from 'react-native';
import {getApicall, postApiCall} from '../../Services/Network';

import Hud from '../Common/Hud';
import AgoraUIKit from 'agora-rn-uikit';
import {VideoRenderMode} from 'react-native-agora/src/common/Enums';
import {appID, agoraToken} from '../../Services/constants';
import {ProfileContext} from '../../Services/ProfileProvider';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {RFValue} from 'react-native-responsive-fontsize';

/**
 * @property appId Agora App ID
 * @property token Token for the channel;
 * @property channelName Channel Name for the current session
 */
// const token = null;
// const appId = '1289a9be02f54740a9823af110034ffa';
// const channelName = 'test';
// const AppCertificate = 'dd6cdfcd2b284624afd62597a7b1bc58';
// const {width, height} = Dimensions.get('window');

//const config = require('../../Services/AgoraConfig/AgoraConfig.json');

const {width, height} = Dimensions.get('window');

const VideoCall = props => {
  const proData = props.route.params.data;
  //const user_id = props.route.params.userId;
  const chat_id = props.route.params.chatId;
  const channelName = 'test';

  const {profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    setTimeout(() => {
      setCallSuccessStatus(true);
    }, 60000);

    //To Disable Back Button
    //BackHandler.addEventListener('hardwareBackPress', () => true);

    // return () => {
    //   callEnd();
    // };
    //return () => BackHandler.remove();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => backHandler.remove();
  }, []);

  const [videoCall, setVideoCall] = useState(false);
  const [callRejectStatus, setCallRejectStatus] = useState(false);
  const [callSuccessStatus, setCallSuccessStatus] = useState(false);
  const [endCallStatus, setEndCallStatus] = useState(false);
  console.log('proData==>', props.route.params.data, props.route.params.chatId);

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage) {
      if (remoteMessage.data.call_status == 'ACCEPT') {
        console.log('Call Accept in Video Call.js==================>');
        setVideoCall(true);
        Toast.show({
          type: 'success',
          text1: 'Call Accepted',
        });
      } else if (remoteMessage.data.call_status == 'REJECT') {
        if (!endCallStatus) {
          console.log('Call Reject in Video Call.js==================>');
          console.log('remote message==>', remoteMessage.notification);
          setVideoCall(true);
          setCallRejectStatus(true);
          setEndCallStatus(true);
          Toast.show({
            type: 'error',
            text1: remoteMessage.notification.body,
          });
          // props.navigation.goBack();
          // setTimeout(() => {
          //   props.navigation.goBack();
          // }, 1000);

          //console.log('ProfileContextData===>', profileContextData.user_type);
          // if (profileContextData.user_type === 1) {
          //   props.navigation.navigate('Chat');
          // } else if (profileContextData.user_type === 2) {
          //   props.navigation.navigate('ChatCelebrity');
          // }
        }
      }
    }
  });
  const AppCertificate = '42396da5ccd6423f8a943b17111b51a0';

  //const token = null;

  const rtcProps = {
    appId: appID,
    channel:
      typeof props.route.params.chatId == 'string'
        ? props.route.params.chatId
        : JSON.stringify(props.route.params.chatId),

    token: agoraToken,
    // rtmToken: "<#my-channel-rtm-token#>"
  };

  const startCall = async () => {
    setVideoCall(true);
    await engine.joinChannel(
      //token,
      null,
      JSON.stringify(props.route.params.chatId),
      null,
      0,
    );
  };

  const callStart = async () => {
    if (profileContextData.user_type == 1) {
      Hud.showHud();
      const startData = {
        chat_id: props.route.params.chatId,
        status: 1,
      };
      await postApiCall('usercallresponsestatus', startData, {})
        .then(async response => {
          Hud.hideHud();
          console.log('response==>', response.data.data);
          if (response.status == 200) {
            setVideoCall(true);
            // await engine.joinChannel(
            //   //this.state.token,
            //   null,
            //   JSON.stringify(props.route.params.chatId),
            //   null,
            //   0,
            // );
          }
        })
        .catch(function (error) {
          Hud.hideHud();
          if (error.response) {
            // Request made and server responded
            console.log('error in response==>', error.response.data);
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

  const callEnd = async () => {
    console.log('callSuccessStatus===>', callSuccessStatus);

    if (profileContextData.user_type == 1) {
      Hud.showHud();
      const closeData = {
        chat_id: props.route.params.chatId,
        status: callSuccessStatus ? 1 : 0,
      };
      console.log('closeData===>', closeData);
      await postApiCall('usercallresponsestatus', closeData, {})
        .then(response => {
          Hud.hideHud();
          console.log('response==>', response.data);
          if (response.status == 200) {
            setVideoCall(false);
            setEndCallStatus(true);
            props.navigation.goBack();
          }
        })
        .catch(function (error) {
          Hud.hideHud();
          if (error.response) {
            // Request made and server responded
            console.log('error in response==>', error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error request===>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(error.message);
          }
        });
    } else {
      setVideoCall(false);
      props.navigation.goBack();
    }
  };

  const callbacks = {
    EndCall: () => {
      console.log('Call end');
      callEnd();
      //setVideoCall(false);
      // props.navigation.goBack();
    },
    LocalMuteAudio: mute => console.log('Mute==>', mute),

    // FullScreen: () => {
    //   /* Function Body */
    // },
    // SwitchCamera: () => {
    //   /* Function Body */
    // },
    // SwapVideo: () => {
    //   /* Function Body */
    // },
    // UserMuteRemoteAudio: () => {
    //   /* Function Body */
    // },
    // UserMuteRemoteVideo: () => {
    //   /* Function Body */
    // },

    // LocalMuteVideo: () => {
    //   /* Function Body */
    // },
  };

  return (
    <>
      <AgoraUIKit
        rtcProps={rtcProps}
        callbacks={callbacks}
        //styleProps={styleProps}
      />

      {props.route.params.callerType == 'caller' && (
        <View
          style={{
            // width: width * 0.9,
            //height: 100,
            // backgroundColor: 'red',
            position: 'absolute',
            alignSelf: 'center',
            alignItems: 'center',
            top: height * 0.2,
            padding: 10,
          }}>
          {!videoCall && (
            <Text
              style={{
                fontSize: RFValue(20),
                color: '#FFFFFF',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
                alignSelf: 'center',
              }}>
              Calling...
            </Text>
          )}
          {callRejectStatus && (
            <Text
              style={{
                fontSize: RFValue(20),
                color: '#FFFFFF',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
                alignSelf: 'center',
              }}>
              Call Rejected
            </Text>
          )}
        </View>
      )}
    </>
  );
};

export default VideoCall;

const styleProps = {
  videoMode: {
    max: VideoRenderMode.Hidden,
    min: VideoRenderMode.Hidden,
  },
  // minViewStyles: {
  //   height: '50%',
  //   width: '30%',
  // },
};

const localButtonStyle = {
  backgroundColor: '#78b0ff',

  borderColor: '#78b0ff',
};
