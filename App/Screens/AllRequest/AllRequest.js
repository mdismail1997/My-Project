import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
//import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import {image_url} from '../../Services/constants';

import {getApicall, postApiCall} from '../../Services/Network';

const {width, height} = Dimensions.get('window');

const AllRequest = props => {
  useEffect(() => {
    handleRequestData();
    handleVideoRequestData();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleRequestData();
      handleVideoRequestData();
    });
    return unsubscribe;
  }, []);

  const [data, setData] = useState([]);
  const [videoData, setVideoData] = useState([]);

  const handleRequestData = async () => {
    //old_url=userchatrequestlist
    Hud.showHud();
    await getApicall('chat-request-list', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
          console.log('data in AllRequest chat Screen==>', response.data.data);
        } else {
          console.log('error on loading AllRequest Page==>');
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

  const handleVideoRequestData = async () => {
    Hud.showHud();
    //oldUrl=usercallrequestlist
    await getApicall('call-request-list', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          setVideoData(response.data.data);
          console.log(
            'Call data in AllRequest call Screen==>',
            response.data.data,
          );
        } else {
          console.log('error on loading AllRequest Page==>');
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

  const acceptHandle = async item => {
    console.log('Accepted data', item);
    Hud.showHud();
    const sendData = {
      chat_request_id: item.id,
      approval: 1,
    };
    await postApiCall('accept-chat-request', sendData, {})
      .then(response => {
        console.log('response==>', response.data);
        Hud.hideHud();
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Request has been Accepted',
          });
          //handleRequestData();
          var tempArr = data.filter(i => i.id != item.id);
          setData([...tempArr]);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Request has not been selected',
          });
        }
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

          Toast.show({
            type: 'info',
            text1: firstItem,
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

  const acceptCallHandle = async item => {
    console.log('Accepted data', item);
    Hud.showHud();
    const sendData = {
      call_request_id: item.id,
      approval: '1',
    };
    await postApiCall('accept-call-request', sendData, {})
      .then(response => {
        console.log('response==>', response.data);
        Hud.hideHud();
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Request has been Accepted',
          });

          // handleVideoRequestData();
          var tempArr1 = videoData.filter(i => i.id != item.id);
          setVideoData([...tempArr1]);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Request has not been selected',
          });
        }
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

  const cancelHandle = async item => {
    console.log('Cancelled data', item);

    Alert.alert(
      //title
      'Request Cancel',
      //body
      'Are you sure want to cancel the Request ?',
      [
        {
          text: 'Yes',
          onPress: () => cancelSelected(item),
        },
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

  const cancelSelected = async item => {
    console.log('Cancelled data', item);
    Hud.showHud();
    const sendData = {
      chat_request_id: item.id,
      approval: 0,
    };
    await postApiCall('accept-chat-request', sendData, {})
      .then(response => {
        Hud.hideHud();
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Request has been Cancelled',
          });
          props.navigation.navigate('CancelRequest');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Request has not been Cancelled',
          });
        }
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

  const cancelCallHandle = async item => {
    console.log('Cancelled data', item);

    Alert.alert(
      //title
      'Request Cancel',
      //body
      'Are you sure want to cancel the Request ?',
      [
        {
          text: 'Yes',
          onPress: () => cancelCallSelected(item),
        },
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

  const cancelCallSelected = async item => {
    console.log('Cancelled data', item);
    Hud.showHud();
    const sendData = {
      call_request_id: item.id,
      approval: '0',
    };
    await postApiCall('accept-call-request', sendData, {})
      .then(response => {
        Hud.hideHud();
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Request has been Cancelled',
          });
          props.navigation.navigate('CancelRequest');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Request has not been Cancelled',
          });
        }
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
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <HeaderwithTitle navProps={props.navigation} title={'Requests'} />

      {data.length == 0 && videoData.length == 0 ? (
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
            No New request has been Send
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
                      height: 150,
                      width: width * 0.9,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginTop: height * 0.03,
                      elevation: 1,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        marginTop: height * 0.03,
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
                            width: width * 0.45,
                          }}>
                          <Text
                            style={{
                              fontSize: 17,
                              color: '#000',
                              ////fontFamily: 'Roboto-Bold',
                              //fontWeight: '600',
                              fontWeight: 'bold',
                              //letterSpacing: 0.4,
                            }}>
                            Request Chat from {item.user_name}?
                          </Text>

                          <Text
                            style={{
                              fontSize: 15,
                              color: '#7B7B7B',
                              ////fontFamily: 'Roboto-Light',
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
                              ////fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              marginTop: 3,
                              //letterSpacing: 0.4,
                            }}>
                            Time:{item.time}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity
                          onPress={() => {
                            acceptHandle(item);
                          }}
                          style={{
                            height: 40,
                            width: 75,
                            backgroundColor: '#E92D87',
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              //fontFamily: 'Roboto - Medium',
                              color: '#fff',
                              fontWeight: '600',
                            }}>
                            Accept
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            cancelHandle(item);
                          }}
                          style={{
                            height: 40,
                            width: 75,
                            marginTop: 10,
                            backgroundColor: '#fff',
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#E92D87',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
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
                );
              })}

              {videoData.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      //height: height * 0.4,
                      height: 150,
                      width: width * 0.9,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginTop: height * 0.03,
                      elevation: 1,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        marginTop: height * 0.03,
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
                            width: width * 0.45,
                          }}>
                          <Text
                            style={{
                              fontSize: 17,
                              color: '#000',
                              //fontFamily: 'Roboto-Bold',
                              fontWeight: '600',
                              fontWeight: 'bold',
                              //letterSpacing: 0.4,
                            }}>
                            Request Video call from {item.user_name}?
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
                            Time:{item.time}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity
                          onPress={() => {
                            acceptCallHandle(item);
                          }}
                          style={{
                            height: 40,
                            width: 75,
                            backgroundColor: '#E92D87',
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              //fontFamily: 'Roboto - Medium',
                              color: '#fff',
                              fontWeight: '600',
                            }}>
                            Accept
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            cancelCallHandle(item);
                          }}
                          style={{
                            height: 40,
                            width: 75,
                            marginTop: 10,
                            backgroundColor: '#fff',
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#E92D87',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
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
                );
              })}
            </>
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </SafeAreaView>
  );
};

export default AllRequest;

const styles = StyleSheet.create({});
