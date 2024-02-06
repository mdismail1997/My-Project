import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import OptionsMenu from 'react-native-options-menu';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {postApiCall} from '../../Services/Network';

import {Bubble, GiftedChat, Send, Time, Avatar} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {image_url} from '../../Services/constants';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';

import database from '@react-native-firebase/database';

import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const IndividualChat = props => {
  const proData = props.route.params.data;

  const chat_id = props.route.params.chatId;

  const [messages, setMessages] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);

  const {profileContextData} = useContext(ProfileContext);

  const [timeModal, setTimeModal] = useState(false);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const onChildAdd = database()
      .ref('/messages/' + props.route.params.chatId)
      .on('child_added', snapshot => {
        console.log('A new node has been added', snapshot.val());
        var temp = snapshot.val();
        if (snapshot.val().createdAt != undefined) {
          temp.createdAt = JSON.parse(snapshot.val().createdAt);
        }

        setMessages(state => [temp, ...state]);
      });

    // Stop listening for updates when no longer required

    return () => {
      database()
        .ref('/messages/' + props.route.params.chatId)
        .off('child_added', onChildAdd);

      console.log('Chat closed');
    };
  }, [props.route.params.chatId]);

  console.log('=====props.route.params.data====>', props.route.params.data);

  const onSend = useCallback(async (message = []) => {
    console.log('message==>', message);

    let msgData = {
      _id: message[0]._id,
      avatar: image_url + proData.profile_image,
      user: {
        _id: profileContextData.id,
        name: profileContextData.username,
        avatar: profileContextData.profile_image,
      },
      text: message[0].text,
      createdAt: JSON.stringify(message[0].createdAt),
    };

    console.log('messagesss====>', msgData);
    const newReference = database()
      .ref('/messages/' + chat_id)
      .push();
    msgData.id = newReference.key;

    newReference.set(msgData).then(async () => {
      Hud.showHud();
      console.log('Message Data has been updated ');
      const timeString = message[0].createdAt.toTimeString().substring(0, 5);
      const timeInput = moment(timeString, 'hh:mm A').format('hh:mm A');

      const lstmssg = {
        chat_id: chat_id,
        last_text: message[0].text,
        time: timeInput,
      };

      //console.log('Last text send Api====>', lstmssg);
      await postApiCall('userchatresponsestatus', lstmssg, {})
        .then(response => {
          Hud.hideHud();
          console.log('response==>', response.data.data);
        })
        .catch(function (error) {
          Hud.hideHud();

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
    });
  }, []);

  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            //style={{marginBottom: 5, marginRight: 5}}
            style={{alignSelf: 'center', marginRight: 8}}
            size={42}
            color="#E92D87"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        //alwaysRenderAvatar={true}
        wrapperStyle={{
          right: {
            //backgroundColor: '#E92D87',
            backgroundColor: '#f2d3e2',
          },
          left: {
            backgroundColor: '#F1F3F6',
          },
        }}
        textStyle={{
          right: {
            color: '#151143',
          },
          left: {
            color: '#151143',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  const renderTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: '#7B7B7B',
          },
          right: {
            color: '#7B7B7B',
          },
        }}
      />
    );
  };
  const deleteChatFunction = () => {
    Alert.alert(
      //title
      'Delete Chat',
      //body
      "Are you sure want to Delete your's chat ?This change will be permanent",
      [
        {text: 'Yes', onPress: () => deleteChatApi()},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
      //clicking out side of alert will close the alert
    );
  };
  const deleteChat = () => {
    console.log('Delete Chat from Firebase');
    database()
      .ref('/messages/' + chat_id)
      .remove()
      .then(async () => {
        //deleteChatApi();
        setMessages([]);
        props.navigation.goBack();
      })
      .catch(() => {
        console.log('Error in deleting');
      });
  };

  const deleteChatApi = async () => {
    Hud.showHud();
    const delmssg = {
      chat_id: chat_id,
      last_text: 0,
      time: null,
    };
    console.log('Last text send Api====>', delmssg);
    await postApiCall('userchatresponsestatus', delmssg, {})
      .then(response => {
        Hud.hideHud();
        console.log('response==>', response.data);
        console.log('Data has been deleted');
        deleteChat();
        //setMessages([]);
        //props.navigation.goBack();
      })
      .catch(function (error) {
        Hud.hideHud();
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
  const clearChat = () => {
    console.log('Clear Chat');
    setMessages([]);
  };

  const videoCallStatus = async () => {
    const celebrityData =
      proData.call_request_send == false
        ? {
            sender_id: proData.id,
          }
        : {
            receiver_id: proData.id,
          };
    console.log('=celebrityData==>', celebrityData);

    const endUrl =
      proData.call_request_send == false
        ? 'receiver-fetch-call-status'
        : 'sender-fetch-call-status';
    Hud.showHud();
    await postApiCall(endUrl, celebrityData, {})
      .then(response => {
        Hud.hideHud();

        if (response.status == 200) {
          console.log('response in Individual Chat==>', response.data.data);
          if (response.data.data.approval == 1) {
            console.log('call allow');
            individualCallapproval(response.data.data);
          } else if (response.data.data.approval == 0) {
            console.log('Approval after Reject ');
            setShowModal(true);
          } else if (response.data.data.approval == 2) {
            console.log('Wait Approval ');
            setShowWaitModal(true);
          } else {
            props.navigation.navigate('ScheduleVideo', {
              data: proData,
            });
          }
        }
      })
      .catch(function (error) {
        Hud.hideHud();

        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          if (error.response.data.message.includes('Call details not found')) {
            props.navigation.navigate('ScheduleVideo', {data: proData});
            // props.navigation.navigate('MyDrawer', {
            //   screen: 'BottomTabNavigation',
            //   params: {screen: 'ScheduleVideo', params: {data: proData}},
            // });
          } else if (error.response.data.message == 'Error') {
            Toast.show({
              type: 'error',
              text1: Object.values(error.response.data.data)[0][0],
            });
          } else {
            Toast.show({
              type: 'error',
              text1: error.response.data.message,
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(error.message);
        }
      });
  };
  const convertTime = time => {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) hours = hours + 12;
    if (AMPM === 'AM' && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = '0' + sHours;
    if (minutes < 10) sMinutes = '0' + sMinutes;
    return sHours + ':' + sMinutes;
  };

  const individualCallapproval = async item => {
    console.log('chat_id=======>', item.chat_id);

    setDate(item.request_date);
    setTime(item.request_time);

    var current = new Date();
    var itemDate = new Date(item.request_date);

    const timeString = current.toTimeString().substring(0, 5);
    const timeInput = moment(timeString, 'hh:mm A').format('hh:mm A');

    console.log('timeInput===>', timeInput);

    const currentTime = convertTime(timeInput);
    const itemTime = convertTime(item.request_time);

    if (itemDate < current) {
      console.log('Access granted');

      videoCallFunc();
    } else if (itemDate == current) {
      if (itemTime <= currentTime) {
        console.log('currentTime', currentTime);
        console.log('Access granted');
        props.navigation.navigate('VideoCall', {
          data: proData,
          chatId: item.chat_id,
        });
      }
    } else {
      setTimeModal(true);
      console.log('set time modal==>', current);
    }
  };

  const videoCallFunc = async () => {
    Hud.showHud();

    const channelId = props.route.params.chatId;
    const callRequestData = {
      email: proData.email,
      channel_id: channelId,
    };
    console.log('callRequestData', callRequestData);
    await postApiCall('send-call-request', callRequestData, {})
      .then(response => {
        console.log('========>', response.data);
        Hud.hideHud();
        if (response.status == 200) {
          console.log('Calling=====>');
          props.navigation.navigate('VideoCall', {
            data: proData,
            chatId: channelId,
            callerType: 'caller',
          });
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        Alert.alert('This Celebrity is not Verified yet.');
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
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
      <HeaderwithTitle navProps={props.navigation} title={'Chats'} />
      <View
        style={{
          width: width * 0.93,

          paddingVertical: height * 0.005,
          marginVertical: width * 0.02,
          backgroundColor: '#faf5f5',

          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', margin: 10}}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,

              alignItems: 'center',
              //backgroundColor:'red'
            }}>
            <Image
              source={
                proData.profile_image === null
                  ? {
                      uri: image_url + 'profile_no_image.jpg',
                    }
                  : {
                      uri: image_url + proData.profile_image,
                    }
              }
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 100,
              }}
              resizeMode="cover"
            />
          </View>

          {proData.online_status ? (
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 100,
                backgroundColor: '#2ECD2B',
                position: 'absolute',
                left: '23%',
              }}
            />
          ) : null}

          <View
            style={{
              marginLeft: width * 0.03,
              marginTop: 10,
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: RFValue(20),
                color: '#000',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
                //fontWeight: 'bold',
                //letterSpacing: 0.4,
              }}>
              {proData.username}
            </Text>
            {proData.online_status == 1 ? (
              <Text
                style={{
                  fontSize: RFValue(16),
                  color: '#000',

                  fontWeight: '300',
                  marginTop: 5,
                }}>
                Online
              </Text>
            ) : (
              proData.time != null && (
                <Text
                  style={{
                    fontSize: RFValue(16),
                    color: '#7B7B7B',
                    //fontFamily: 'Roboto-Light',
                    fontWeight: '300',
                    marginTop: 5,
                    //letterSpacing: 0.4,
                  }}>
                  Last Seen at {proData.time}
                </Text>
              )
            )}
          </View>
        </View>

        <View
          style={{alignSelf: 'center', flexDirection: 'row', marginRight: 10}}>
          <TouchableOpacity
            onPress={() => {
              videoCallStatus();
              //videoCallFunc();
            }}
            style={{
              backgroundColor: '#E92D87',
              borderRadius: 7,
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <View style={{width: 30, height: 30}}>
              <Image
                source={require('../../Assets/Icon/camera.png')}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <OptionsMenu
            button={require('../../Assets/Icon/more.png')}
            buttonStyle={{
              height: 45,
              width: 20,
              marginLeft: 10,
              tintColor: '#dcdcdc',
            }}
            destructiveIndex={1}
            options={['Clear Chat', 'Delete']}
            actions={[clearChat, deleteChatFunction]}
          />
        </View>
      </View>

      <View
        style={{
          width: '98%',
          height: '75.5%',
          position: 'absolute',
          bottom: 7,
          alignSelf: 'center',
        }}>
        <GiftedChat
          messages={messages}
          onSend={mssg => onSend(mssg)}
          user={{
            _id: profileContextData.id,
            name: profileContextData.username,
            avatar: profileContextData.profile_image,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          renderSend={renderSend}
          //renderAvatar={renderAvatar}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          renderTime={renderTime}
          textInputStyle={{color: '#151143'}}
        />
      </View>
      <Modal visible={showModal} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '85%',
              height: 320,
              alignSelf: 'center',
              backgroundColor: '#fff',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
              }}
              style={{
                alignSelf: 'flex-end',
                width: 25,
                height: 25,
                margin: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/close.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <Icon size={100} name="slash" color={'#E92D87'} />
            {/* </View> */}
            <View
              style={{
                marginVertical: 20,
                width: '90%',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#000',
                  //fontFamily: 'Roboto-Regular',
                  fontWeight: '500',
                  //fontWeight: 'bold',
                  //letterSpacing: 0.4,
                }}>
                Your Call Request has been rejected.
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',
                  //fontFamily: 'Roboto-Regular',
                  fontWeight: '500',
                  //fontWeight: 'bold',
                  //letterSpacing: 0.4,
                }}>
                Would you like to send it again.
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 150,
                height: 50,

                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                console.log('Back Button');
                setShowModal(false);
                props.navigation.navigate('ScheduleVideo', {
                  data: proData,
                });
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#FFFFFF',
                  //fontFamily: 'Roboto-Medium',
                  fontWeight: '500',
                }}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showWaitModal} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '85%',
              height: 320,
              alignSelf: 'center',
              backgroundColor: '#fff',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowWaitModal(false);
              }}
              style={{
                alignSelf: 'flex-end',
                width: 25,
                height: 25,
                margin: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/close.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View style={{height: 130, width: 160}}>
              <Image
                source={require('../../Assets/Icon/waitlogo.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </View>
            <View style={{marginVertical: 22, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',

                  fontWeight: '500',
                }}>
                {proData.call_request_received
                  ? 'You received his/her Call request'
                  : 'Your Call Request had been sent'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#000',

                  fontWeight: '500',
                }}>
                {proData.call_request_received
                  ? 'Please accept it in All Request'
                  : 'Please wait for its response.'}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 150,
                height: 50,

                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                console.log('Back Button');
                setShowWaitModal(false);
                //props.navigation.navigate('Chat');
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#FFFFFF',
                  //fontFamily: 'Roboto-Medium',
                  fontWeight: '500',
                }}>
                {proData.call_request_received ? 'Ok' : ' Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={timeModal} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '85%',
              height: 350,
              alignSelf: 'center',
              backgroundColor: '#fff',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setTimeModal(false);
              }}
              style={{
                alignSelf: 'flex-end',
                width: 25,
                height: 25,
                margin: 10,
              }}>
              <Image
                source={require('../../Assets/Icon/close.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View style={{height: 130, width: 160}}>
              <Image
                source={require('../../Assets/Icon/waitlogo.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </View>
            <View style={{marginVertical: 20, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#000',
                  //fontFamily: 'Roboto-Medium',
                  fontWeight: '500',
                  //fontWeight: 'bold',
                  //letterSpacing: 0.4,
                }}>
                Please Wait!
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  //fontFamily: 'Roboto-Regular',
                  fontWeight: '400',
                  //fontWeight: 'bold',
                  //letterSpacing: 0.4,
                }}>
                Your Chating time starts at
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#7B7B7B',
                  //fontFamily: 'Roboto-Regular',
                  fontWeight: '400',
                  marginTop: 10,
                  //fontWeight: 'bold',
                  //letterSpacing: 0.4,
                }}>
                {date} {time}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 150,
                height: 50,
                position: 'absolute',
                bottom: 15,

                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                console.log('Back Button');
                setTimeModal(false);
                //props.navigation.navigate('Chat');
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#FFFFFF',
                  //fontFamily: 'Roboto-Medium',
                  fontWeight: '500',
                }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default IndividualChat;

const styles = StyleSheet.create({
  divisionSelect: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: height * 0.015,
    paddingLeft: 10,
    justifyContent: 'center',
  },

  division: {
    width: '100%',
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  input: {
    paddingLeft: 10,
    height: 50,
    width: '78%',
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    color: '#000',
  },
  input1: {
    paddingLeft: 10,
    height: 50,
    width: '78%',
    borderRadius: 7,
    backgroundColor: '#EBE0E5',
    color: '#8E7B85',
  },

  timeSubMenu: {
    width: '30%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    //borderWidth: 1,
    borderRadius: 7,
    paddingLeft: 10,
  },
  arrowStyle: {
    width: 25,
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  timeVal: {
    width: '50%',
    height: '100%',
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTxt: {
    fontSize: 15,
    //fontFamily: 'Roboto-Reqular',
    fontWeight: '400',
  },
});
