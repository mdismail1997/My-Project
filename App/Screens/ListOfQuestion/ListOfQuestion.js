import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import Hud from '../Common/Hud';
import {image_url} from '../../Services/constants';
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');

const ListOfQuestion = props => {
  useEffect(() => {
    getQuestion();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getQuestion();
    });
    return unsubscribe;
  }, []);

  //const [check, setCheck] = useState(false);
  const videoRef = useRef(null);
  const [data, setData] = useState([]);
  const [check, setCheck] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [closeColor, setCloseColor] = useState('#000');
  const [currIndex, setIndex] = useState(null);
  const [videoData, setVideoData] = useState('');
  const getQuestion = async () => {
    Hud.showHud();
    await getApicall('user-question-answer-list', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          console.log('user-question-answer-list data', response.data.data[0]);
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
  };

  const setShow = index => {
    let newArr = [...check];
    newArr[index] = !newArr[index];

    setCheck(newArr);
  };

  const videoDisplay = async item => {
    setVideoData(item);
    setShowModal(true);
  };
  const onBuffer = e => {
    console.log('Buffering....', e);
    e.isBuffering ? setCloseColor('#fff') : setCloseColor('#000');
  };
  const onError = e => {
    console.log('Error....', e);
    e.Error ? setCloseColor('#fff') : setCloseColor('#000');
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

        <View
          style={{
            width: width * 0.88,
            //backgroundColor: 'red',
            alignItems: 'flex-start',
            marginVertical: height * 0.03,
          }}>
          <Text
            style={{
              color: '#151143',
              fontWeight: '500',
              fontSize: RFValue(22),
              //fontFamily: 'Roboto-Medium',
            }}>
            Your Questions
          </Text>
        </View>

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
              No Question has been Send to Celebrities
            </Text>
          </View>
        ) : (
          <KeyboardAvoidingScrollView
            bounces={false}
            //behavior="padding"
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#ffffff', width: width * 0.9}}>
            <View style={{marginBottom: height * 0.14}}>
              {data.map((item, index) => {
                return (
                  <View style={styles.group} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        // setShow(index);
                        setIndex(index);
                        videoDisplay(item);
                      }}
                      style={styles.header}>
                      {/* <Text
                        style={{
                          color: '#151143',
                          fontWeight: '500',
                          fontSize: RFValue(20),
                          //fontFamily: 'Roboto-Medium',
                        }}>
                        {item.question}
                      </Text> */}
                      <View
                        style={{
                          flexDirection: 'row',
                          margin: 5,
                          //margin: height * 0.01,
                          width: '90%',
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
                              {item.name}
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
                          </View>
                        </View>
                      </View>

                      {/* {check[index] ? (
                        <View style={{height: 15, width: 15}}>
                        
                          <Image
                            source={require('../../Assets/Icon/up.png')}
                            style={{width: '100%', height: '100%'}}
                            resizeMode="contain"
                          />
                        </View>
                      ) : (
                        <View style={{height: 15, width: 15}}>
                          
                          <Image
                            source={require('../../Assets/Icon/down.png')}
                            style={{width: '100%', height: '100%'}}
                            resizeMode="contain"
                          />
                        </View>
                      )} */}
                    </TouchableOpacity>
                    {check[index] ? (
                      <View style={{margin: 5, padding: 5}}>
                        {item.text != null ? (
                          <Text
                            style={{
                              color: '#7B7B7B',
                              fontWeight: '300',
                              fontSize: RFValue(18),
                              //fontFamily: 'Roboto-Light',
                            }}>
                            {item.text}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: '#7B7B7B',
                              fontWeight: '300',
                              fontSize: RFValue(18),
                              //fontFamily: 'Roboto-Light',
                            }}>
                            The question is still pending.Celebrity has not
                            reply it yet.
                          </Text>
                        )}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
            <Modal visible={showModal} transparent={true}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '95%',
                    height: '98%',
                    alignSelf: 'center',
                    //backgroundColor: '#fff',
                    //backgroundColor: 'gray',
                    alignItems: 'center',
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      height: '97%',
                      width: '100%',
                      marginTop: '5%',
                      //backgroundColor: 'red',
                    }}>
                    <VideoPlayer
                      video={{uri: videoData.video_url}}
                      autoplay={true}
                      defaultMuted={false}
                      paused={!showModal}
                      onEnd={() => {
                        setShowModal(false);
                      }}
                      videoHeight={3000}
                      videoWidth={1600}
                      thumbnail={{
                        uri:
                          videoData.answer_image == ''
                            ? 'https://source.unsplash.com/1024x768/?any'
                            : image_url + videoData.answer_image,
                      }}
                      fullScreenOnLongPress
                      onPlayPress={() => {
                        console.log(videoData);
                      }}
                      //disableFullscreen={false}
                      customStyles={{
                        width: '100%',
                        height: '100%',
                        //borderRadius: 10,
                      }}
                    />
                  </View>
                  {/* <View style={{height: '100%', width: '100%'}}>
                    <Video
                      source={{
                        uri: videoData.video_url,
                        //uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      }}
                      onBuffer={onBuffer}
                      onError={onError}
                      style={styles.backgroundVideo}
                      resizeMode="cover"
                      //paused={ currIndex!== index}
                      paused={!showModal}
                      //repeat
                      poster={
                        videoData.answer_image == ''
                          ? 'https://source.unsplash.com/1024x768/?any'
                          : image_url + videoData.answer_image
                      }
                      posterResizeMode="cover"
                    />
                  </View>*/}
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                    }}
                    style={{
                      alignSelf: 'flex-end',
                      width: 25,
                      height: 25,
                      margin: 10,
                      position: 'absolute',
                      top: 0,
                      right: 5,
                    }}>
                    <Image
                      source={require('../../Assets/Icon/close.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        tintColor: '#fff',
                        //tintColor: closeColor,
                      }}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </KeyboardAvoidingScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListOfQuestion;

const styles = StyleSheet.create({
  group: {
    margin: height * 0.01,
    borderColor: '#7B7B7B',
    borderWidth: 0.5,
    borderRadius: 8,
    //elevation: 0.3,
    width: width * 0.9,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 5,
    paddingRight: 5,
    //backgroundColor: 'red',
  },

  textStyle: {
    fontSize: 22,
    ////fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'bold',

    color: 'black',
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    //top: 0,
  },
});
