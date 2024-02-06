import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState, useRef, useContext, useEffect} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import {image_url} from '../../Services/constants';

import {getApicall, postApiCall} from '../../Services/Network';

const {width, height} = Dimensions.get('window');

const CancelRequest = props => {
  useEffect(() => {
    handleCancelChatData();
    handleCancelCallData();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleCancelChatData();
      handleCancelCallData();
    });
    return unsubscribe;
  }, []);

  const [data, setData] = useState([]);
  const [callData, setCallData] = useState([]);

  const handleCancelChatData = async () => {
    Hud.showHud();
    await getApicall('chat-cancel-list', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
          console.log('data in CancelRequest Screen==>', response.data.data);
        } else {
          console.log('error on loading CancelRequest Page==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        Hud.hideHud();

        if (error.response) {
          console.log('==========>', error.response.data);
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

  const handleCancelCallData = async () => {
    Hud.showHud();
    await getApicall('call-cancel-list', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          setCallData(response.data.data);
          console.log(
            'Call data in CancelRequest Screen==>',
            response.data.data,
          );
        } else {
          console.log('error on loading CancelRequest Page==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        Hud.hideHud();

        if (error.response) {
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
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <HeaderwithTitle navProps={props.navigation} title={'Requests'} />
      {data.length == 0 && callData.length == 0 ? (
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

              fontWeight: '400',
            }}>
            No Request has been Cancelled
          </Text>
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
            <>
              {data.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      //height: height * 0.4,
                      //height: 170,
                      width: width * 0.9,
                      //backgroundColor: 'white',
                      borderRadius: 10,
                      marginTop: height * 0.03,
                      paddingVertical: height * 0.01,

                      borderWidth: 0.5,
                      borderColor: '#7D7D7D',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        marginTop: height * 0.03,
                        //margin: height * 0.01,
                        width: width * 0.87,
                        justifyContent: 'space-between',
                        //backgroundColor: 'blue',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 100,

                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            item.profile_image === null
                              ? {
                                  uri: image_url + 'profile_no_image.jpg',
                                }
                              : {uri: item.profile_image}
                          }
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
                          justifyContent: 'center',
                          // backgroundColor: 'green',
                          width: width * 0.67,
                        }}>
                        <Text
                          style={{
                            fontSize: 17,
                            color: '#000',
                            //fontFamily: 'Roboto-Bold',
                            //fontWeight: '600',
                            fontWeight: 'bold',
                            //letterSpacing: 0.4,
                          }}>
                          Request chat from {item.user_name}?
                        </Text>

                        <View
                          style={{
                            width: '90%',
                            // backgroundColor: 'peru',
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              marginTop: 3,
                              //letterSpacing: 0.4,
                            }}>
                            Date:{item.date}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              marginTop: 3,
                              //letterSpacing: 0.4,
                            }}>
                            Time: {item.time}
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 40,
                            width: 120,
                            marginTop: 15,
                            backgroundColor: '#E92D87',
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                            //borderWidth: 1,
                            //borderColor: '#E92D87',
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              //fontFamily: 'Roboto - Regular',
                              color: '#ffffff',
                              fontWeight: '600',
                            }}>
                            Cancelled
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
              {callData.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      //height: 170,
                      width: width * 0.9,
                      paddingVertical: height * 0.01,

                      borderRadius: 10,
                      marginTop: height * 0.03,

                      borderWidth: 0.5,
                      borderColor: '#7D7D7D',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        marginTop: height * 0.03,
                        //margin: height * 0.01,
                        width: width * 0.87,
                        justifyContent: 'space-between',
                        //backgroundColor: 'blue',
                      }}>
                      {/* <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'green',
                  width: '100%',
                }}> */}
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
                              : {uri: item.profile_image}
                          }
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
                          justifyContent: 'center',
                          // backgroundColor: 'green',
                          width: width * 0.67,
                        }}>
                        <Text
                          style={{
                            fontSize: 17,
                            color: '#000',
                            //fontFamily: 'Roboto-Bold',
                            fontWeight: '600',
                            //fontWeight: 'bold',
                            //letterSpacing: 0.4,
                          }}>
                          Request Video chat from {item.user_name}?
                        </Text>

                        <View
                          style={{
                            width: '90%',
                            // backgroundColor: 'peru',
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              marginTop: 3,
                              //letterSpacing: 0.4,
                            }}>
                            Date:{item.date}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              marginTop: 3,
                              //letterSpacing: 0.4,
                            }}>
                            Time: {item.time}
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 40,
                            width: 120,
                            marginTop: 15,
                            backgroundColor: '#E92D87',
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                            //borderWidth: 1,
                            //borderColor: '#E92D87',
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              //fontFamily: 'Roboto - Regular',
                              color: '#ffffff',
                              fontWeight: '600',
                            }}>
                            Cancelled
                          </Text>
                        </View>
                      </View>
                      {/* </View> */}

                      {/* <View
                style={{alignSelf: 'center', justifyContent: 'center'}}></View> */}
                    </View>
                  </View>
                );
              })}
            </>
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </SafeAreaView>
  );
};

export default CancelRequest;

const styles = StyleSheet.create({});
