import React, {useState, useEffect} from 'react';

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
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import HeaderImageTitleWhite from '../Common/HeaderImageTitleWhite';

import {getApicall, postApiCall} from '../../Services/Network';
import moment from 'moment';

import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';

const {width, height} = Dimensions.get('window');

const ChatCelebrity = props => {
  useEffect(() => {
    handleCelebrityChatData();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleCelebrityChatData();
    });
    return unsubscribe;
  }, []);

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const [data, setData] = useState([]);
  const [timeModal, setTimeModal] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const searchHandler = value => {
    setSearch(value);
    if (value === '') {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  };

  const individualChat = async item => {
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
        data: item,
        chatId: item.chat_id,
        userId: item.celebrity_user_id,
        toId: item.user_id,
      });
    } else if (itemDate == current) {
      if (itemTime <= currentTime) {
        console.log('currentTime', currentTime);
        console.log('Access granted');
        props.navigation.navigate('IndividualChat', {
          data: item,
          chatId: item.chat_id,
          userId: item.celebrity_user_id,
          toId: item.user_id,
        });
      }
    } else {
      //setTimeModal(true);
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

  const handleCelebrityChatData = async () => {
    Hud.showHud();
    await getApicall('celebritychatlist', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          //console.log('Data.length====>', response.data.data.length);
          setData(response.data.data);
          console.log('data in Chat Screen==>', response.data.data);
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
              //height: height * 0.05,
              //width: width * 0.05,
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
              //style={[styles.textInput]}
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

      {data.length === 0 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30%',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: '#769292',
              //fontFamily: 'Rubik',
              fontWeight: 'normal',
            }}>
            No Chat Request has been Send
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingScrollView
          bounces={false}
          //behavior="padding"
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ffffff', width: width * 0.9}}>
          <View style={{marginBottom: height * 0.14}}>
            {/* **************************************************************************************** */}

            {data
              .filter(function (item) {
                return item.username
                  .toLowerCase()
                  .includes(search.toLowerCase());
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
                            //borderRadius: 100,
                            //alignItems: 'center',
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
                          {item.last_text == '0' ? (
                            <Text
                              style={{
                                fontSize: RFValue(14),
                                color: '#7B7B7B',
                                //fontFamily: 'Roboto-Light',
                                fontWeight: '300',
                                //letterSpacing: 0.4,
                              }}></Text>
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
                  </TouchableOpacity>
                );
              })}

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

                        fontWeight: '400',
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
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </SafeAreaView>
  );
};

export default ChatCelebrity;

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
