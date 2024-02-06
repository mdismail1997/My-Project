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
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import OptionsMenu from 'react-native-options-menu';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {postApiCall} from '../../Services/Network';
import Hud from '../Common/Hud';
import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import {ProfileContext} from '../../Services/ProfileProvider';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import RadioForm from 'react-native-simple-radio-button';

const {width, height} = Dimensions.get('window');

const ScheduleLive = props => {
  const {profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    setDateTime(new Date());
    const unsubscribe = props.navigation.addListener('focus', async () => {
      //handleDateTime();
      setDateTime(new Date());
    });
    return unsubscribe;
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [trimDate, setTrimDate] = useState('');
  const [trimTime, setTrimTime] = useState('');
  const [showTrimDate, setShowTrimDate] = useState(false);

  const [value, setValue] = useState(10);
  var choice = [
    {label: '10', value: 10},
    {label: '20', value: 20},
    {label: '30', value: 30},
  ];

  const sendRequest = async () => {
    if (trimDate.trim() == '' || trimTime.trim() == '') {
      Toast.show({
        type: 'error',
        text1: 'Please provide the time',
      });
    } else {
      const channelId = uuid();
      const sendData = {
        live_date: trimDate,
        live_time: trimTime,
        chanel_id: channelId,
        question_limit: value,
        live_date_time: date,
      };
      console.log('===========>', sendData);
      Hud.showHud();

      await postApiCall('celebrity-create-live-schedule', sendData, {})
        .then(response => {
          Hud.hideHud();
          if (response.status == 200) {
            console.log('==deviceToken response==>', response.data);
            setShowModal(true);
          }
        })
        .catch(function (error) {
          Hud.hideHud();
          console.log('error==>', error);
          // Request made and server responded
          if (error.response) {
            console.log('response error===>', error.response.data);
            Toast.show({
              type: 'error',
              text1: error.response.data.message,
            });
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Request Error==>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    }
  };

  const setDateTime = data => {
    setDate(data);
    console.log('data', typeof data, data);
    let d1 = moment(data).format('DD-MM-YYYY');
    let t1 = moment(data).format('hh:mm A');
    console.log('===========>', d1, t1);
    setTrimDate(d1);
    setTrimTime(t1);
    // setShowTrimDate(true);
  };

  const questionHandler = val => {
    console.log('=====>', typeof val);
    setValue(val);
  };

  const timeZone = date => {
    // Create a Date object with the desired date

    const timezoneOffset = date.getTimezoneOffset(); // Get the time zone offset in minutes

    const timezoneHours = Math.abs(timezoneOffset / 60); // Convert the offset to hours

    const timezoneSign = timezoneOffset > 0 ? '-' : '+'; // Determine the sign of the offset (+ or -)

    const timezone = `GMT ${timezoneSign}${timezoneHours}`; // Format the timezone string

    console.log('timezone', date, timezone); // Display the timezone
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
      <HeaderwithTitle navProps={props.navigation} title={'Schedule Live'} />
      <KeyboardAvoidingScrollView
        bounces={false}
        //behavior="padding"
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#ffffff', width: width * 0.9}}>
        <View
          style={{
            width: width * 0.85,
            // height: 320,
            backgroundColor: '#fff',
            marginTop: height * 0.1,
            borderRadius: 10,
            elevation: 1,
            alignSelf: 'center',
            paddingBottom: height * 0.025,
          }}>
          <View
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#EBE0E5',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#000',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
              }}>
              Please Schedule your Live Streaming
            </Text>
          </View>

          <View
            style={{
              width: '90%',
              //height: '65%',
              //backgroundColor: 'red',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
                //fontWeight: 'bold',
                //letterSpacing: 0.4,
              }}>
              Pick a date
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowDate(true);
              }}
              style={showTrimDate ? styles.divisionSelect : styles.division}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#151143',

                  fontWeight: '400',
                }}>
                {trimDate}
              </Text>

              <DatePicker
                modal
                open={showDate}
                date={date}
                mode="datetime"
                is24hourSource="locale"
                minimumDate={new Date()}
                onConfirm={date => {
                  timeZone(date);
                  setDateTime(date);
                  setShowDate(false);
                  setShowTrimDate(true);
                  //setShowTrimTime(true);
                }}
                onCancel={() => {
                  setShowDate(false);
                }}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 15,
                color: '#000',

                fontWeight: '500',
                marginTop: 10,
              }}>
              Pick a Time
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowDate(true);
              }}
              style={showTrimDate ? styles.divisionSelect : styles.division}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#151143',

                  fontWeight: '400',
                }}>
                {trimTime}
              </Text>

              {/* <DatePicker
                modal
                open={showTime}
                date={date}
                mode="datetime"
                minimumDate={new Date()}
                is24hourSource="locale"
                onConfirm={time => {
                  setDateTime(time);
                  setShowTime(false);
                  setShowTrimDate(true);
                  setShowTrimTime(true);
                }}
                format="h:mm A"
                onCancel={() => {
                  setShowTime(false);
                }}
              /> */}
            </TouchableOpacity>

            <View
              style={{
                width: width * 0.75,
                marginTop: height * 0.03,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#8E7B85',
                  fontSize: RFValue(16),
                  textAlign: 'center',
                }}>
                Maximum Question Users can ask in the new Live Session
              </Text>
              <View style={{marginVertical: height * 0.03}}>
                <RadioForm
                  radio_props={choice}
                  initial={0}
                  onPress={val => questionHandler(val)}
                  buttonSize={12}
                  buttonOuterSize={20}
                  buttonColor={'#EBE0E5'}
                  selectedButtonColor={'#E92D87'}
                  //buttonInnerColor={'#EBE0E5'}
                  labelHorizontal={true}
                  labelStyle={{
                    fontSize: RFValue(18),
                    marginRight: 20,
                    color: '#151143',
                  }}
                  disabled={false}
                  formHorizontal={true}
                />
              </View>
            </View>

            <TouchableOpacity
              //disabled={true}
              style={{
                marginTop: 25,
                width: width * 0.77,
                height: 50,
                alignSelf: 'center',
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                sendRequest();
              }}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#FFFFFF',
                  //fontFamily: 'Roboto-Medium',
                  fontWeight: '500',
                }}>
                Set Schedule
              </Text>
            </TouchableOpacity>
          </View>

          <Modal visible={showModal} transparent={true} animationType="fade">
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

                <View style={{height: 130, width: 160}}>
                  <Image
                    source={require('../../Assets/Icon/waitlogo.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                  />
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#000',
                      //fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                      //fontWeight: 'bold',
                      //letterSpacing: 0.4,
                    }}>
                    Your Live Schedule has been Sent
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
                    props.navigation.goBack();
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default ScheduleLive;

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
    alignSelf: 'center',
    marginTop: height * 0.015,
    paddingLeft: 10,
    justifyContent: 'center',
  },

  input: {
    paddingLeft: 10,
    height: 50,
    width: '78%',
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    color: '#151143',
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
