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
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import {ProfileContext} from '../../Services/ProfileProvider';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import RadioForm from 'react-native-simple-radio-button';
const {width, height} = Dimensions.get('window');

const ListOfQuestionCelebrity = props => {
  useEffect(() => {
    getQuestion();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getQuestion();
    });
    return unsubscribe;
  }, []);

  const [status, setStatus] = useState([]);
  const [text, setText] = useState('');
  //const [check, setCheck] = useState(false);
  const [data, setData] = useState([]);
  const [totalQuestionStatus, setTotalQuestionStatus] = useState(false);

  const [value, setValue] = useState(10);
  var choice = [
    {label: '10', value: 10},
    {label: '20', value: 20},
    {label: '30', value: 300},
  ];

  const getQuestion = async () => {
    Hud.showHud();
    await getApicall('celebritylistquestion', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          console.log(response.data);
          setData(response.data.data);
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

  const handleAnswer = async item => {
    console.log('===item===>', item);
    const answerData = {
      question_id: item.id,
      answer: text,
      currency: item.currency,
    };
    console.log('AnswerData==>', answerData);

    await postApiCall('celebrityanswer', answerData, {})
      .then(response => {
        console.log('response==>', response.data);
        setStatus([]);
        Toast.show({
          type: 'success',
          text1: 'Reply has been send.',
        });

        let temp = data.filter(item1 => {
          return item1.id != item.id;
        });

        setData([...temp]);
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          console.log('error in response==>', error.response.status);
          // if (error.response.data.data.length != 0) {
          //   var myobj = error.response.data.data;
          //   var firstItem = Object.values(myobj)[0];
          // } else {
          //   var firstItem = error.response.data.message;
          // }

          // Toast.show({
          //   type: 'error',
          //   text1: firstItem,
          // });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error.request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error.Setting===>', error.message);
        }
      });
  };
  const handleText = value => {
    setText(value);
  };
  const setShow = index => {
    let newArr = [...status];
    newArr[index] = !newArr[index];

    setStatus(newArr);
  };

  const onLiveFunc = async () => {
    console.log('===onLiveFunc===>');

    const channelId = uuid();
    //const channelId = '78209773-8430-440a-9b73-31e12ff887a7';
    Hud.showHud();
    const liveData = {
      channel_id: channelId,
    };

    console.log('====>', liveData);

    await postApiCall('celebrity-live', liveData, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          props.navigation.navigate('CelebrityOnLive', {
            type: 'create',
            channel: channelId,
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
    setValue(val);
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

          <View>
            <Text
              style={{
                color: '#151143',
                fontWeight: '500',
                fontSize: RFValue(22),
                //fontFamily: 'Roboto-Medium',
              }}>
              List of Questions
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Notification');
            }}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                height: height * 0.05,
                width: width * 0.06,
                marginHorizontal: '5%',
              }}>
              <Image
                source={require('../../Assets/Icon/Notification.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>

        {data.length === 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: height * 0.2,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#769292',
                //fontFamily: 'Rubik',
                fontWeight: 'normal',
              }}>
              No Question has been left to answer
            </Text>
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
                Maximum Question User will asked in the new Live Session
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
                onLiveFunc();
              }}>
              <Text style={{fontSize: 19, color: '#FFFFFF'}}>Go Live Now</Text>
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
                      //height: height * 0.4,
                      //height: 130,
                      width: width * 0.9,
                      backgroundColor: 'white',
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
                              uri: image_url + item.profile_image,
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
                            width: width * 0.55,
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
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
                              fontSize: 15,
                              color: '#000',
                              //fontFamily: 'Roboto-Regular',
                              fontWeight: '400',
                              //letterSpacing: 0.4,
                              marginTop: 3,
                            }}>
                            {item.question}
                          </Text>

                          <TouchableOpacity
                            onPress={() => {
                              setShow(index);
                            }}
                            style={{
                              height: 40,
                              width: 120,
                              backgroundColor: '#E92D87',
                              borderRadius: 7,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: 15,
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                //fontFamily: 'Roboto - Medium',
                                color: '#fff',
                                fontWeight: '600',
                              }}>
                              Add Amount
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={{}}>
                        <Text
                          style={{
                            fontSize: 16,
                            //fontFamily: 'Roboto-Bold',
                            color: '#000',
                            fontWeight: 'bold',
                          }}>
                          {item.currency}
                          {item.question_amount}
                        </Text>
                      </View>
                    </View>
                    {status[index] ? (
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
                          placeholder="Add Amount"
                          style={{...styles.input, color: '#151143'}}
                          placeholderTextColor={'#C7C7C7'}
                          autoCorrect={false}
                          keyboardType="numeric"
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
                            source={require('../../Assets/Icon/dollar.png')}
                            //source={require('../../Assets/Icon/tick.png')}
                            style={{height: '50%', width: '65%'}}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                );
              })}

              <TouchableOpacity
                style={{
                  width: width * 0.65,
                  height: 50,
                  marginTop: height * 0.05,
                  backgroundColor: '#E92D87',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  onLiveFunc();
                }}>
                <Text style={{fontSize: 19, color: '#FFFFFF'}}>
                  Go Live Now
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListOfQuestionCelebrity;

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
