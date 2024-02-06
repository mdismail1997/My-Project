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
import {getApicall, postApiCall} from '../../Services/Network';
import Hud from '../Common/Hud';
import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import {ProfileContext} from '../../Services/ProfileProvider';
//import NumberPlease from 'react-native-number-please';
const {width, height} = Dimensions.get('window');

const ScheduleVideo = props => {
  const {profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleDateTime();
    });
    return unsubscribe;
  }, []);

  const [amount, setAmount] = useState('');
  const [amtStatus, setAmtStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [trimDate, setTrimDate] = useState('');

  const [hrs, setHrs] = useState('00');
  //const [showHrs, setShowHrs] = useState(false);
  //const [showMin, setShowMin] = useState(false);
  const [min, setMin] = useState('00');
  const [timeStatus, setTimeStatus] = useState('AM');

  const item = props.route.params.data;

  const handleDateTime = async () => {
    console.log('Initial Date==>', date);
    var temp = JSON.stringify(date).substring(1, 11);
    //console.log('Initial Date==>', temp);
    var newDate = temp.split('-').reverse().join('-');
    //console.log('New Date==>', newDate);
    setTrimDate(newDate);

    const timeString = date.toTimeString().substring(0, 5);
    const timeInput = moment(timeString, 'hh:mm A').format('hh:mm A');
    console.log('time===>', date.toTimeString());
    console.log('timeString===>', timeString);
    console.log('timeInput===>', timeInput);
    setHrs(timeInput.substring(0, 2));
    setMin(timeInput.substring(3, 5));
    setTimeStatus(timeInput.substring(5, 8));
  };

  const requestHandel = value => {
    setAmount(value);
    setAmtStatus(true);
  };

  const sendRequest = async () => {
    console.log('Amount==>', amount);
    console.log('Date==>', trimDate);

    var timeVal = trimDate + hrs + min + timeStatus;
    console.log('total time===>', timeVal);
    // setShowModal(true);

    const requestData = {
      receiver_id: props.route.params.data.id,

      date: trimDate,
      time: hrs + ':' + min + timeStatus,
    };

    console.log('Request Data==>', requestData);

    Hud.showHud();
    await postApiCall('call-request-send', requestData, {})
      .then(response => {
        console.log('=======>', response.data);
        if (response.status == 200) {
          Hud.hideHud();
          setShowModal(true);
          setAmount('');
          setAmtStatus(false);
        } else {
          Hud.hideHud();
          console.log('error===>response.data.data.user_type is not 1 or 2');
        }
      })
      .catch(function (error) {
        //setLoading(false);
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in response for Schedule video==>',
            error.response.data.data.amount[0],
          );
          console.log(
            'error in response for Object video==>',
            Object.values(error.response.data.data),
          );

          Toast.show({
            type: 'error',
            text1: Object.values(error.response.data.data)[0][0],
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  const setDateFunc = value => {
    setShowDate(false);
    console.log('Date==>', value);
    setDate(value);
    var temp = JSON.stringify(value).substring(1, 11);
    //console.log('Initial Date==>', temp);
    var newDate = temp.split('-').reverse().join('-');
    console.log('New Date==>', newDate);
    setTrimDate(newDate);
  };

  const dayFunc = () => {
    if (timeStatus === 'AM') {
      setTimeStatus('PM');
    } else {
      setTimeStatus('AM');
    }
  };

  const hoursUpFunction = () => {
    //console.log('hrs===>', hrs);
    var num = parseInt(hrs);
    //console.log('hours===>', num);
    //console.log('hours type===>', typeof num);
    if (num < 12) {
      var x = num + 1;
      if (x < 10) {
        setHrs('0' + JSON.stringify(x));
      } else {
        setHrs(JSON.stringify(x));
      }
    } else {
      setHrs('00');
      setTimeStatus('AM');
    }
  };

  const hoursDownFunction = () => {
    //console.log('hrs===>', hrs);
    var num = parseInt(hrs);
    //console.log('hours===>', num);
    //console.log('hours type===>', typeof num);
    if (num > 0 && num <= 12) {
      var x = num - 1;
      if (x < 10) {
        setHrs('0' + JSON.stringify(x));
      } else {
        setHrs(JSON.stringify(x));
      }
    } else {
      setHrs('12');
    }
  };

  const minUpFunction = () => {
    // console.log('hrs===>', min);
    var num = parseInt(min);
    //console.log('hours===>', num);
    //console.log('hours type===>', typeof num);
    if (num < 60) {
      var x = num + 1;
      if (x < 10) {
        setMin('0' + JSON.stringify(x));
      } else {
        setMin(JSON.stringify(x));
      }
    } else {
      setMin('00');
    }
  };
  const minDownFunction = () => {
    //console.log('hrs===>', min);
    var num = parseInt(min);
    // console.log('hours===>', num);
    //console.log('hours type===>', typeof num);
    if (num > 0 && num <= 60) {
      var x = num - 1;
      if (x < 10) {
        setMin('0' + JSON.stringify(x));
      } else {
        setMin(JSON.stringify(x));
      }
    } else {
      setMin('60');
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
      <HeaderwithTitle navProps={props.navigation} title={'Video Chats'} />

      <View
        style={{
          width: width * 0.93,
          height: 90,
          marginVertical: width * 0.02,
          backgroundColor: '#faf5f5',
          //opacity: 0.1,
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
              //marginLeft: '2%',
              //marginLeft: 10,
              //marginHorizontal: '5%',
              alignItems: 'center',
              //backgroundColor:'red'
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
          </View>
          {item.online_status == 1 ? (
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
              {item.username}
            </Text>
            {item.time ? (
              <Text
                style={{
                  fontSize: RFValue(16),
                  color: '#7B7B7B',
                  //fontFamily: 'Roboto-Light',
                  fontWeight: '300',
                  marginTop: 5,
                  //letterSpacing: 0.4,
                }}>
                Last Seen at {item.time}
              </Text>
            ) : null}
          </View>
        </View>

        <View
          style={{alignSelf: 'center', flexDirection: 'row', marginRight: 10}}>
          <View
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
          </View>
        </View>
      </View>
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
            marginTop: height * 0.02,
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
                //fontWeight: 'bold',
                //letterSpacing: 0.4,
              }}>
              Want Video Chat please contribute?
            </Text>
          </View>

          <View
            style={{
              width: '90%',
              //height: '65%',
              //backgroundColor: 'red',
              alignSelf: 'center',
              marginTop: 7,
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
              style={styles.divisionSelect}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#151143',
                  //fontFamily: 'Roboto-Reqular',
                  fontWeight: '400',

                  //fontWeight: 'bold',
                  //letterSpacing: 0.4,
                }}>
                {trimDate}
              </Text>

              <DatePicker
                modal
                open={showDate}
                date={date}
                mode="date"
                onConfirm={date => {
                  setDateFunc(date);
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
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
                marginTop: 10,
                //fontWeight: 'bold',
                //letterSpacing: 0.4,
              }}>
              Pick a Time
            </Text>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                //backgroundColor: 'red',
                height: 55,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  ...styles.timeSubMenu,
                  backgroundColor: '#EBE0E5',
                }}>
                <View style={{flex: 1}}>
                  <TextInput
                    value={hrs}
                    onChangeText={value => setHrs(value)}
                    placeholder="Hrs"
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      color: '#151143',
                    }}
                    placeholderTextColor={'#8E7B85'}
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.arrowStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      hoursUpFunction();
                    }}
                    style={{width: 12, height: 12}}>
                    <Image
                      source={require('../../Assets/Icon/up.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#E92D87',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      hoursDownFunction();
                    }}
                    style={{width: 12, height: 12}}>
                    <Image
                      source={require('../../Assets/Icon/down.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#E92D87',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{fontSize: 25}}>:</Text>
              <View style={{...styles.timeSubMenu, backgroundColor: '#EBE0E5'}}>
                <View style={{flex: 1}}>
                  <TextInput
                    value={min}
                    onChangeText={value => setMin(value)}
                    placeholder="Min"
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      color: '#151143',
                    }}
                    placeholderTextColor={'#8E7B85'}
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.arrowStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      minUpFunction();
                    }}
                    style={{width: 12, height: 12}}>
                    <Image
                      source={require('../../Assets/Icon/up.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#E92D87',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      minDownFunction();
                    }}
                    style={{width: 12, height: 12}}>
                    <Image
                      source={require('../../Assets/Icon/down.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#E92D87',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{fontSize: 25}}>:</Text>
              <View style={{...styles.timeSubMenu, backgroundColor: '#EBE0E5'}}>
                <View style={styles.timeVal}>
                  <Text style={styles.timeTxt}>{timeStatus}</Text>
                </View>
                <View style={styles.arrowStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      dayFunc();
                    }}
                    style={{width: 12, height: 12}}>
                    <Image
                      source={require('../../Assets/Icon/up.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#E92D87',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      dayFunc();
                    }}
                    style={{width: 12, height: 12}}>
                    <Image
                      source={require('../../Assets/Icon/down.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#E92D87',
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
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
                Send Request
              </Text>
            </TouchableOpacity>
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
                    Your Request has been Sent
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
                    props.navigation.navigate('Chat');
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
    </SafeAreaView>
  );
};

export default ScheduleVideo;

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
