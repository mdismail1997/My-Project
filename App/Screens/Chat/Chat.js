import React, {useState, useEffect, useContext} from 'react';

import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import HeaderImageTitleWhite from '../Common/HeaderImageTitleWhite';

import {getApicall, postApiCall} from '../../Services/Network';

import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {ProfileContext} from '../../Services/ProfileProvider';
const {width, height} = Dimensions.get('window');

const Chat = props => {
  useEffect(() => {
    handleUserChatData();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleUserChatData();
    });
    return unsubscribe;
  }, []);
  const {profileContextData} = useContext(ProfileContext);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [itemData, setItemData] = useState([]);

  const [timeModal, setTimeModal] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const individualChat = item => {
    if (
      !item.call_request_received &&
      !item.call_request_send &&
      !item.chat_request_received &&
      !item.chat_request_send
    ) {
      console.log('+++++++++++All false');
      props.navigation.navigate('ScheduleChat', {data: item});
    } else {
      individualChat1(item);
    }
  };

  const individualChat1 = async item => {
    Hud.showHud();
    setItemData(item);

    const celebrityData =
      item.chat_request_send == false
        ? {
            sender_id: item.id,
          }
        : {
            receiver_id: item.id,
          };
    console.log('=celebrityData==>', celebrityData);

    const endUrl =
      item.chat_request_send == false
        ? 'receiver-fetch-chat-status'
        : 'sender-fetch-chat-status';
    await postApiCall(endUrl, celebrityData, {})
      .then(response => {
        Hud.hideHud();
        console.log('response==>', response.data.data);
        if (response.status == 200) {
          if (response.data.data.approval == 1) {
            individualChatapproval(item, response.data.data);
            console.log('approval');
          } else if (response.data.data.approval == 0) {
            console.log('Approval after Reject ');
            setShowModal(true);
          } else if (response.data.data.approval == 2) {
            console.log('Wait Approval ');
            setShowWaitModal(true);
          } else {
            //videoCallStatus(item);
            props.navigation.navigate('ScheduleChat', {data: item});
          }
        }
      })
      .catch(function (error) {
        Hud.hideHud();

        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          if (error.response.data.message.includes('Chat details not found')) {
            //videoCallStatus(item);
            props.navigation.navigate('ScheduleChat', {data: item});
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

  const individualChatapproval = async (data1, item) => {
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
      props.navigation.navigate('IndividualChat', {
        data: data1,
        chatId: item.chat_id,
      });
    } else if (itemDate == current) {
      if (itemTime <= currentTime) {
        console.log('currentTime', currentTime);
        console.log('Access granted');
        props.navigation.navigate('IndividualChat', {
          data: data1,
          chatId: item.chat_id,
          toId: item.celebrity_user_id,
          userId: item.user_id,
        });
      }
    } else {
      setTimeModal(true);
    }
  };

  const handleUserChatData = async () => {
    Hud.showHud();
    await getApicall('user-celebrity-list-for-chat', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          var temp = response.data.data.filter(
            item => item.id != profileContextData.id && item.user_type != 0,
          );
          setData(temp);
          console.log('======>', response.data.data[2]);
        } else {
          console.log('error on loading in Chat Screen==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        Hud.hideHud();

        if (error.response) {
          // Request made and server responded

          Toast.show({
            type: 'error',
            text1: error.response.data.message,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error ====>', error.message);
        }
      });
  };
  const videoCallStatus = async item => {
    const celebrityData =
      item.call_request_send == false
        ? {
            sender_id: item.id,
          }
        : {
            receiver_id: item.id,
          };
    console.log('=celebrityData==>', celebrityData);

    const endUrl =
      item.call_request_send == false
        ? 'receiver-fetch-call-status'
        : 'sender-fetch-call-status';
    Hud.showHud();
    await postApiCall(endUrl, celebrityData, {})
      .then(response => {
        Hud.hideHud();
        console.log(
          '=======sender-fetch-call-status=======>',
          response.data.data,
        );
        if (response.status == 200) {
          if (response.data.data.approval == 1) {
            console.log('response==>', response.data.data);
            console.log('call allow');
            individualCallapproval(item, response.data.data);
          } else if (response.data.data.approval == 2) {
            setShowWaitModal(true);
          } else {
            props.navigation.navigate('ScheduleChat', {data: item});
          }
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
  };

  const individualCallapproval = async (data, item) => {
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
          data: data,
          chatId: item.chat_id,
        });
      }
    } else {
      setTimeModal(true);
      console.log('set time modal==>', current);
    }
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

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const searchHandler = value => {
    setSearch(value);
    if (value === '') {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
      <HeaderImageTitleWhite navProps={props.navigation} title={'Chats'} />

      {/* ******************************************************************************************************* */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: width * 0.9,
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: height * 0.01,
          marginBottom: height * 0.02,
        }}>
        <View style={showSearch ? styles.divisionSelect : styles.division}>
          <TouchableOpacity
            style={{
              height: 50,
              width: 18,

              alignSelf: 'center',
              marginRight: 8,
            }}>
            <Image
              source={require('../../Assets/Icon/search.png')}
              style={
                showSearch
                  ? {...styles.imagesty, tintColor: 'black'}
                  : {...styles.imagesty, tintColor: '#B19DA7'}
              }
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={{flex: 1}}>
            <TextInput
              value={search}
              onChangeText={value => searchHandler(value)}
              placeholder="Search"
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              returnKeyType="search"
              style={{
                flex: 1,
                color: '#151143',
              }}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#E92D87',
            borderRadius: 10,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{width: 30, height: 30}}>
            <Image
              source={require('../../Assets/Icon/camera.png')}
              style={{height: '100%', width: '100%'}}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* *************************************************************************************** */}

      <KeyboardAvoidingScrollView
        bounces={false}
        //behavior="padding"
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#ffffff', width: width * 0.9}}>
        <View style={{marginBottom: height * 0.14}}>
          {/* **************************************************************************************** */}

          {data
            .filter(function (item) {
              return (
                item.username.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    individualChat(item);
                  }}
                  style={{
                    //height: height * 0.4,
                    height: 75,
                    width: width * 0.9,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: height * 0.02,
                    borderBottomWidth: 1,
                    borderBottomColor: '#566690',
                  }}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 5,
                      //margin: height * 0.01,
                      width: width * 0.85,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                        }}>
                        <Image
                          source={
                            item.profile_image === null
                              ? {
                                  uri: image_url + 'profile_no_image.jpg',
                                }
                              : {
                                  uri: image_url + item.profile_image,
                                }
                          }
                          style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 100,
                          }}
                          resizeMode="cover"
                        />

                        {item.online_status == 1 ? (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 100,
                              backgroundColor: '#2ECD2B',
                              position: 'absolute',
                              right: '10%',
                            }}
                          />
                        ) : null}
                      </View>

                      <View
                        style={{
                          marginLeft: width * 0.01,
                          marginTop: height * 0.011,
                          alignItems: 'flex-start',
                          justifyContent: 'space-around',
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
                          {item.username}
                        </Text>

                        {item.last_text == null || '0' ? (
                          <Text
                            style={{
                              fontSize: RFValue(14),
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              //letterSpacing: 0.4,
                            }}>
                            {item.user_type == 1 ? 'User' : 'Celebrity'}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: RFValue(14),
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              //letterSpacing: 0.4,
                            }}>
                            {item.last_text}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={{marginTop: height * 0.011}}>
                      <Text
                        style={{
                          fontSize: RFValue(18),
                          //fontFamily: 'Roboto-Medium',
                          color: '#151143',
                          fontWeight: '600',
                        }}>
                        {item.time}
                      </Text>
                    </View>
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
                            Your Chat Request has been rejected.
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
                            props.navigation.navigate('ScheduleChat', {
                              data: itemData,
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
                        backgroundColor: 'rgba(0,0,0,0.2)',
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
                        <View
                          style={{marginVertical: 22, alignItems: 'center'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#000',
                              //fontFamily: 'Roboto-Medium',
                              fontWeight: '500',
                              //fontWeight: 'bold',
                              //letterSpacing: 0.4,
                            }}>
                            {itemData.chat_request_received
                              ? 'You received his/her chat request'
                              : 'Your Chat Request had been sent'}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#000',
                              //fontFamily: 'Roboto-Normal',
                              fontWeight: '500',
                              //fontWeight: 'bold',
                              //letterSpacing: 0.4,
                            }}>
                            {itemData.chat_request_received
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

                              fontWeight: '500',
                            }}>
                            {itemData.chat_request_received ? 'Ok' : ' Close'}
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
                        <View
                          style={{marginVertical: 20, alignItems: 'center'}}>
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
                </TouchableOpacity>
              );
            })}
        </View>
      </KeyboardAvoidingScrollView>

      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  division: {
    width: width * 0.75,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    //marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.75,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    //marginTop: height * 0.025,
    paddingLeft: 10,
  },

  imagesty: {width: '100%', height: '100%'},
});
