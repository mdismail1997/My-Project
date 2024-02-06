import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import moment from 'moment';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import RadioForm from 'react-native-simple-radio-button';
const {width, height} = Dimensions.get('window');
import {ProfileContext} from '../../Services/ProfileProvider';

const LiveQuestion = props => {
  const {profileContextData, token} = useContext(ProfileContext);

  useEffect(() => {
    getQuestion();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getQuestion();
    });
    return unsubscribe;
  }, []);

  const [status, setStatus] = useState([]);
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState('');
  const [value, setValue] = useState(10);
  const [liveScheduleData, setLiveScheduleData] = useState('');
  var choice = [
    {label: '10', value: 10},
    {label: '20', value: 20},
    {label: '30', value: 30},
  ];

  const getQuestion = async () => {
    Hud.showHud();
    setLiveScheduleData('');
    await getApicall('celebrity-question-list', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          console.log(
            'live_schedule_data=========>',
            response.data.live_schedule_data,
          );
          setData(response.data.data);
          setLiveScheduleData(response.data.live_schedule_data);
        } else {
          console.log('error on loading Question in ListOfQuestion Page==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);

        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('=======>', error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const handleAmount = value => {
    setAmount(value);
  };
  const setShow = index => {
    let newArr = [...status];
    newArr[index] = !newArr[index];

    setStatus(newArr);
  };

  const onLiveFunc1 = () => {
    if (
      liveScheduleData == null ||
      liveScheduleData == '' ||
      liveScheduleData == undefined
    ) {
      Alert.alert('Please Schedule your Live Streaming first');
    } else {
      checkTime(
        liveScheduleData.live_date_time,
        liveScheduleData.live_time,
        liveScheduleData.live_date,
      );
    }
  };

  const checkTime = (date, time, date1) => {
    const currentTime = new Date();
    let liveTime = new Date(date);

    if (liveTime > currentTime) {
      Alert.alert(`Your schedule time is ${date1} ${time}`);
      console.log('=====Wait=====>');
    } else {
      onLiveFunc();
    }
  };

  const onLiveFunc2 = () => {
    let temp = data.filter(item => item.question_amount == 0);

    if (temp.length > 0) {
      Alert.alert('Please Provide Amount for every question');
    } else {
      onLiveFunc();
    }
  };

  const onLiveFunc = async () => {
    console.log('===onLiveFunc===>');

    Hud.showHud();
    const liveData = {
      channel_id: liveScheduleData.chanel_id,
      status: 1,
      schedule_complete_status: 0,
    };

    console.log('====>', liveData);

    await postApiCall('celebritylivestatus', liveData, {})
      .then(response => {
        Hud.hideHud();

        if (response.status == 200) {
          props.navigation.navigate('CelebrityOnLive', {
            type: 'create',
            channel: liveScheduleData.chanel_id,
            questionList: data,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error while sharing Channel ID',
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
            text1: Object.values(error.response.data.data)[0][0],
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
  const questionHandler = val => {
    console.log('=====>', typeof val);
    //setValue(val);
  };

  const sendAmount = async (item, index) => {
    if (amount.trim == '') {
      Toast.show({
        type: 'error',
        text1: 'Please add amount to that question',
      });
    } else {
      const sendData = {
        question_id: item.id,
        question_amount: amount,
      };
      console.log('====>', sendData);
      setShow(index);
      await postApiCall('question-amount-set', sendData, {})
        .then(response => {
          Hud.hideHud();
          if (response.status == 200) {
            setAmount('');
            setShow(index);
            let temp = item;
            temp.question_amount = amount;
            let tempArr = data;
            tempArr[index] = temp;
            console.log('tempArr===>', temp);
            setData([...tempArr]);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error while sharing Channel ID',
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
              text1: Object.values(error.response.data.data)[0][0],
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

  const cancelQuestion = item => {
    Alert.alert(
      //title
      'Cancel',
      //body
      'Are you sure want to cancel this question ?',
      [
        {text: 'Yes', onPress: () => cancelQuestionFunc(item)},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const cancelQuestionFunc = async item => {
    console.log('item:', item);
    const sendData = {
      question_id: item.id,
    };
    Hud.showHud();
    await postApiCall('question-cancel-by-celebrity', sendData, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          //console.log('=========>', response.data);
          var tempArr = data.filter(i => i.id != item.id);
          //console.log(tempArr);
          setData(tempArr);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error while cancelling question',
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
            text1: Object.values(error.response.data.data)[0][0],
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
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: width * 0.9,
            marginTop: height * 0.02,
            alignItems: 'center',
            //backgroundColor: 'pink',
          }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              source={require('../../Assets/Icon/back.png')}
              style={{
                height: 18,
                width: 10,
                tintColor: 'black',
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: '#151143',
              fontWeight: '500',
              fontSize: RFValue(22),
              //fontFamily: 'Roboto-Medium',
            }}>
            List of Questions
          </Text>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Notification');
            }}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                height: height * 0.05,
                width: width * 0.06,
                // marginHorizontal: '5%',
              }}>
              <Image
                source={require('../../Assets/Icon/Notification.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
        {data.length !== 0 && (
          <TouchableOpacity
            style={{
              height: 50,
              marginVertical: height * 0.01,
              backgroundColor: '#E92D87',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 15,
              alignSelf: 'flex-start',
            }}
            onPress={() => {
              onLiveFunc1();
            }}>
            <Text style={{fontSize: RFValue(18), color: '#FFFFFF'}}>
              Go Live
            </Text>
          </TouchableOpacity>
        )}
        {data.length === 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: height * 0.2,
            }}>
            <Text
              style={{
                fontSize: RFValue(18),
                color: '#769292',
                //fontFamily: 'Rubik',
                fontWeight: 'normal',
              }}>
              No Question has been left to answer
            </Text>
            {/* <View
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
              <View style={{marginTop: height * 0.03}}>
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
            </View> */}
            <TouchableOpacity
              style={{
                width: width * 0.7,
                height: 50,
                marginTop: height * 0.1,
                backgroundColor: '#E92D87',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              onPress={() => {
                onLiveFunc1();
              }}>
              <Text style={{fontSize: RFValue(19), color: '#FFFFFF'}}>
                Go Live Now
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <KeyboardAvoidingScrollView
            bounces={false}
            //behavior="padding"
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#ffffff',
              width: width * 0.9,
            }}>
            <View style={{marginBottom: height * 0.14}}>
              {data.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: width * 0.95,
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      marginTop: height * 0.03,
                      elevation: 1,
                      paddingBottom: 10,
                    }}>
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
                            borderRadius: 100,
                            //marginLeft: '2%',
                            //marginLeft: 10,
                            //marginHorizontal: '5%',
                            alignItems: 'center',
                            //backgroundColor:'red'
                          }}>
                          <Image
                            source={{
                              uri:
                                item.profile_image === null ||
                                item.profile_image === undefined ||
                                item.profile_image === ''
                                  ? image_url + 'profile_no_image.jpg'
                                  : image_url + item.profile_image,
                            }}
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
                            //width: width * 0.55,
                          }}>
                          <Text
                            style={{
                              fontSize: RFValue(18),
                              color: '#000',
                              //fontFamily: 'Roboto-Regular',
                              fontWeight: '400',
                              //fontWeight: 'bold',
                              //letterSpacing: 0.4,
                            }}>
                            {item.username}
                          </Text>

                          <Text
                            style={{
                              fontSize: RFValue(16),
                              color: '#000',
                              fontWeight: '400',
                              //letterSpacing: 0.4,
                              marginTop: 3,
                            }}>
                            {item.question}
                          </Text>
                          {/* {item.question_amount != 0 && (
                            <Text
                              style={{
                                fontSize: RFValue(16),
                                color: '#000',
                                //fontFamily: 'Roboto-Regular',
                                fontWeight: '400',
                                //fontWeight: 'bold',
                                //letterSpacing: 0.4,
                              }}>
                              Asked Amount: {item.question_amount}
                            </Text>
                          )} */}
                          {item.question_earn_amount != 0 && (
                            <Text
                              style={{
                                fontSize: RFValue(16),
                                color: '#000',
                                //fontFamily: 'Roboto-Regular',
                                fontWeight: '400',
                                //fontWeight: 'bold',
                                //letterSpacing: 0.4,
                              }}>
                              Total Amount Given : {item.question_earn_amount}
                            </Text>
                          )}
                          <View
                            style={{
                              flexDirection: 'row',
                              width: width * 0.6,
                              //backgroundColor: 'peru',
                              justifyContent: 'space-between',
                              marginTop: 15,
                            }}>
                            {/* {item.question_amount == null ||
                              item.question_amount == undefined ||
                              (item.question_amount == '' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setShow(index);
                                  }}
                                  style={{
                                    // height: 40,
                                    // width: 120,
                                    backgroundColor: '#E92D87',
                                    borderRadius: 7,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // marginTop: 15,
                                    padding: 10,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: RFValue(14),
                                      //fontFamily: 'Roboto - Medium',
                                      color: '#fff',
                                      fontWeight: '600',
                                    }}>
                                    {item.question_amount == null ||
                                    item.question_amount == undefined ||
                                    item.question_amount == ''
                                      ? 'Add Amount'
                                      : 'Give Answer'}
                                  </Text>
                                </TouchableOpacity>
                              ))} */}

                            <TouchableOpacity
                              onPress={() => {
                                cancelQuestion(item);
                              }}
                              style={{
                                // height: 40,
                                // width: 120,
                                backgroundColor: '#fff',
                                borderRadius: 7,
                                alignItems: 'center',
                                justifyContent: 'center',
                                //marginTop: 15,
                                borderColor: '#E92D87',
                                borderWidth: 1,
                                padding: 10,
                              }}>
                              <Text
                                style={{
                                  fontSize: RFValue(14),
                                  //fontFamily: 'Roboto - Medium',
                                  color: '#7B7B7B',
                                  fontWeight: '600',
                                }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {/* <View style={{}}>
                        <Text
                          style={{
                            fontSize: 16,
                            //fontFamily: 'Roboto-Bold',
                            color: '#000',
                            fontWeight: 'bold',
                          }}>
                          {item.question_amount}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            //fontFamily: 'Roboto-Bold',
                            color: '#000',
                            fontWeight: 'bold',
                          }}>
                          {item.question_earn_amount}
                        </Text>
                      </View> */}
                    </View>
                    {status[index] ? (
                      <>
                        {item.question_amount == null ||
                          item.question_amount == undefined ||
                          (item.question_amount == '' && (
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                width: width * 0.75,
                                height: 50,
                                //backgroundColor: 'red',
                                justifyContent: 'space-between',
                                alignSelf: 'center',
                              }}>
                              <TextInput
                                value={amount}
                                onChangeText={value => handleAmount(value)}
                                placeholder="Add Amount"
                                style={{...styles.input, color: '#151143'}}
                                placeholderTextColor={'#C7C7C7'}
                                autoCorrect={false}
                                keyboardType="numeric"
                              />
                              <TouchableOpacity
                                onPress={() => sendAmount(item, index)}
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
                                  //source={require('../../Assets/Icon/tick.png')}
                                  style={{height: '50%', width: '65%'}}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                      </>
                    ) : null}
                    {/* {status[index] ? (
                      <>
                        {item.question_amount == null ||
                        item.question_amount == undefined ||
                        item.question_amount == '' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 5,
                              width: width * 0.75,
                              height: 50,
                              //backgroundColor: 'red',
                              justifyContent: 'space-between',
                              alignSelf: 'center',
                            }}>
                            <TextInput
                              value={amount}
                              onChangeText={value => handleAmount(value)}
                              placeholder="Add Amount"
                              style={{...styles.input, color: '#151143'}}
                              placeholderTextColor={'#C7C7C7'}
                              autoCorrect={false}
                              keyboardType="numeric"
                            />
                            <TouchableOpacity
                              onPress={() => sendAmount(item, index)}
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
                                //source={require('../../Assets/Icon/tick.png')}
                                style={{height: '50%', width: '65%'}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 5,
                              width: width * 0.75,
                              height: 50,
                              //backgroundColor: 'red',
                              justifyContent: 'space-between',
                              alignSelf: 'center',
                            }}>
                            <TextInput
                              onChangeText={value => handleText(value)}
                              placeholder="Reply..."
                              style={{...styles.input, color: '#151143'}}
                              placeholderTextColor={'#C7C7C7'}
                              autoCorrect={false}
                            />
                            <TouchableOpacity
                              onPress={() => handleAnswer(item)}
                              style={{
                                width: 50,
                                height: 50,
                                backgroundColor: '#E92D87',
                                borderRadius: 7,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Image
                                //source={require('../../Assets/Icon/dollar.png')}
                                source={require('../../Assets/Icon/tick.png')}
                                style={{height: '50%', width: '65%'}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    ) : null} */}
                  </View>
                );
              })}
            </View>
          </KeyboardAvoidingScrollView>
        )}

        {/* <Modal visible={showModal} transparent={true}>
          <Pressable
            onPress={() => setShowModal(false)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: '#fff',
                alignItems: 'center',
                borderRadius: 10,
                padding: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                }}
                style={{
                  width: 25,
                  height: 25,
                  position: 'absolute',
                  top: 5,
                  right: 5,
                }}>
                <Image
                  source={require('../../Assets/Icon/close.png')}
                  style={{width: '100%', height: '100%'}}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: width * 0.75,
                  alignItems: 'center',
                  marginTop: height * 0.03,
                }}>
                <Text
                  style={{
                    color: '#8E7B85',
                    fontSize: RFValue(16),
                    textAlign: 'center',
                  }}>
                  Maximum Question Users can ask in the new Live Session
                </Text>
                <View style={{marginTop: height * 0.03}}>
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
                style={{
                  height: 50,
                  marginTop: height * 0.03,
                  backgroundColor: '#E92D87',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                }}
                onPress={() => {
                  onLiveFunc();
                }}>
                <Text style={{fontSize: RFValue(19), color: '#FFFFFF'}}>
                  Go Live Now
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal> */}
      </View>
    </SafeAreaView>
  );
};

export default LiveQuestion;

const styles = StyleSheet.create({
  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#000',
    borderWidth: 1,
    borderColor: '#E92D87',
  },
});
