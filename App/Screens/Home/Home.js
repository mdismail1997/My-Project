import React, {useState, useContext, useEffect, useCallback} from 'react';

import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ImageBackground,
  RefreshControl,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {getApicall, postApiCall} from '../../Services/Network';
//import Video from 'react-native-video';
import {image_url} from '../../Services/constants';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import NotificationContext from '../../Services/Notification/NotificationContext';
import {ProfileContext} from '../../Services/ProfileProvider';
import messaging from '@react-native-firebase/messaging';
import VideoPlayer from 'react-native-video-player';
//import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';

const {width, height} = Dimensions.get('window');

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = props => {
  useEffect(() => {
    handleHeader();
    //handleCelebrity();
    sendDeviceToken();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      setSearch('');
      setShowSearch(false);
      handleHeader();
      // getNotificationStatus()
    });
    return unsubscribe;
  }, []);

  const sendDeviceToken = async () => {
    const deviceToken = await AsyncStorage.getItem('fcm_token');
    if (deviceToken == null || deviceToken == undefined) {
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.warn('have tok=====', fcmToken);
            sendDeviceToken1(fcmToken);
          } else {
            console.warn('have tok=====', 'Not registered');
          }
        })
        .catch(error => {
          console.warn('have tok error=====', error);
          Toast.show({
            type: 'error',
            text1: 'FCM token error',
          });
        });
    } else {
      sendDeviceToken1(deviceToken);
    }
  };

  const sendDeviceToken1 = async token => {
    const sendData = {
      device_token: token,
    };
    await postApiCall('updateDeviceToken', sendData, {})
      .then(response => {
        if (response.status == 200) {
          console.log('==deviceToken response==>', response.data);
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        // Request made and server responded
        if (error.response) {
          console.log('response error===>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
      handleHeader();
    });
  }, []);

  // const [emailList, setEmailList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [unreadNotification, setUnreadNotification] = useState(false);
  const notificationContext = useContext(NotificationContext);

  const {setProfileContextData, setnotificationStatusContextData} =
    useContext(ProfileContext);

  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [userType, setUserType] = useState(0);
  const [celebrityData, setCelebrityData] = useState([]);

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [videoData, setVideoData] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const searchHandler = value => {
    setSearch(value);
    if (value === '') {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  };
  const handleHeader = async () => {
    Hud.showHud();
    await getApicall('profile', {}, {})
      .then(response => {
        if (response.status == 200) {
          handleOnline();
          getNotificationStatus();
          Hud.hideHud();
          setProfileData(response.data.data);
          setUserType(response.data.data.user_type);
          setProfileContextData(response.data.data);
          if (response.data.data.notification_status == 1) {
            console.log('setnotificationStatusContextData==>isTrue');
            setnotificationStatusContextData(true);
          } else {
            setnotificationStatusContextData(false);
            console.log('setnotificationStatusContextData==>isFalse');
          }

          if (response.data.data.user_type === 1) {
            handleCelebrity();
          } else if (response.data.data.user_type === 2) {
            handleCelebrityPersonalData();
          }
        } else {
          Hud.hideHud();
          console.log('error===>response.data.data.user_type is not 1 or 2');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error in response for profile==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request for profile==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  const handleCelebrity = async () => {
    Hud.showHud();
    await getApicall('celebritylist', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
          //console.log('data in Home Screen==>', response.data.data[7]);
        } else {
          console.log('error on loading celebrity in Home Page==>');
          Toast.show({
            type: 'error',
            text2: 'error on loading celebrity in Home Page',
          });
        }
      })
      .catch(function (error) {
        // console.log('error==>', error);
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

  const celebrityArrayData = (liveArray, promotionalArray, reelsArray) => {
    if (promotionalArray == undefined && reelsArray == undefined) {
      return [...liveArray];
    } else if (promotionalArray == undefined && reelsArray != undefined) {
      return [...liveArray, ...reelsArray];
    } else if (promotionalArray != undefined && reelsArray == undefined) {
      return [...liveArray, ...promotionalArray];
    } else {
      return [...liveArray, ...promotionalArray, ...reelsArray];
    }
  };

  const videoDisplay = async (item1, item) => {
    setVideoData(item);
    setShowModal(true);
  };

  const celebrityvideoDisplay = async item => {
    setVideoUrl(item);
    setShowModal(true);
  };

  const nextPage = async item => {
    await AsyncStorage.setItem('celebrityData', JSON.stringify(item));

    props.navigation.navigate('CelebrityProfileData', {
      //celebrityData: item,
      celebrityEmail: item.email,
    });
  };

  const handleCelebrityPersonalData = async () => {
    //  console.log('Celebrity Api should be called here-------------------->');
    Hud.showHud();
    await getApicall('celebritypostlist', {}, {})
      .then(async response => {
        Hud.hideHud();
        if (response.status == 200) {
          //console.log('celebrity response===>', response.data.data.live);
          if (
            response.data.data.promotional == undefined &&
            response.data.data.reels == undefined
          ) {
            setCelebrityData(response.data.data.live);
          } else if (
            response.data.data.promotional == undefined &&
            response.data.data.reels != undefined
          ) {
            // console.log('Promotional is undefined');
            setCelebrityData([
              ...response.data.data.live,
              ...response.data.data.reels,
            ]);
          } else if (
            response.data.data.promotional != undefined &&
            response.data.data.reels == undefined
          ) {
            //console.log('reels is undefined');
            setCelebrityData([
              ...response.data.data.live,
              ...response.data.data.promotional,
            ]);
          } else {
            //console.log('Everything in defined');
            setCelebrityData([
              ...response.data.data.live,
              ...response.data.data.promotional,
              ...response.data.data.reels,
            ]);
          }
        } else {
          console.log('error on loading celebrity in Home Page==>');
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

  const handleOnline = async () => {
    const statusActiveData = {
      status: '1',
    };
    Hud.showHud();
    await postApiCall('sendonlinestatus', statusActiveData, {})
      .then(response => {
        console.log('response in Online/Offline Status==>', response.data);
        if (response.status == 200) {
          Hud.hideHud();
          console.log('Status has been set Online');
        } else {
          console.log('Status has not been set Online');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          console.log(
            'error in response sendonlinestatus==>',
            error.response.data,
          );

          Toast.show({
            type: 'error',
            text1: 'Socket Error',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error in Request in the Login page===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error in Setting in the Login page==>', error.message);
        }
      });
  };

  const getNotificationStatus = async () => {
    Hud.showHud();
    await getApicall('newnotification', {}, {})
      .then(async res => {
        if (res.status == 200) {
          Hud.hideHud();
          setUnreadNotification(res.data.success);
          if (!res.data.success) {
            notificationContext.updateNotficationStatus('N');
          } else {
            notificationContext.updateNotficationStatus('Y');
          }
        } else {
          Hud.hideHud();
          // console.log(res.message.success);
          //  setStatus(res.data);
          setUnreadNotification(res.data.success);
          notificationContext.updateNotficationStatus('N');
        }
      })
      .catch(error => {
        Hud.hideHud();
        console.error(error);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingTop: 10,
      }}>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        translucent={false}
      />

      <View
        style={{
          flexDirection: 'row',
          width: width * 0.95,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.openDrawer();
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              marginLeft: '2%',
              //marginLeft: 10,
              //marginHorizontal: '5%',
              alignItems: 'center',
              //backgroundColor:'red'
            }}>
            <Image
              //source={require('../../Assets/Images/Img.png')}
              source={{uri: profileData.profile_image}}
              style={{height: '100%', width: '100%', borderRadius: 100}}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: width * 0.01,
              marginTop: height * 0.011,
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: RFValue(15),
                color: '#7B7B7B',
                ////fontFamily: 'Rubik',
                //fontWeight: '500',
                letterSpacing: 0.4,
              }}>
              Hi,
            </Text>
            <Text
              style={{
                fontSize: RFValue(20),
                color: '#000',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
                //fontWeight: 'bold',
                letterSpacing: 0.4,
              }}>
              {profileData.name}
            </Text>
          </View>
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
            {unreadNotification == true ||
            notificationContext.usernotificationstatus == 'Y' ? (
              <Image
                source={require('../../Assets/Icon/Notification.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../Assets/Icon/noti.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      {/* ******************************************************************************************************* */}
      {userType === 1 ? (
        <>
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
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Live', {searchData: ''});
              }}
              style={{
                backgroundColor: '#E92D87',
                borderRadius: 7,
                width: 60,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
                Live
              </Text>
            </TouchableOpacity>
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
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          <KeyboardAvoidingScrollView
            bounces={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            //behavior="padding"
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#ffffff', width: width * 0.9}}>
            <View style={{marginBottom: height * 0.14}}>
              {/* **************************************************************************************** */}

              {data
                .filter(function (item1) {
                  return item1.username
                    .toLowerCase()
                    .includes(search.toLowerCase());
                })
                .map((item1, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        //height: height * 0.4,
                        height: 220,
                        width: width * 0.9,
                        //backgroundColor: 'red',
                        backgroundColor: '#ffffff',
                        borderRadius: 10,
                        marginTop: height * 0.02,
                        elevation: 1,
                        //paddingBottom: 6,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          nextPage(item1);
                        }}
                        style={{
                          flexDirection: 'row',
                          margin: 5,
                          //margin: height * 0.01,
                          width: width * 0.85,
                          justifyContent: 'space-between',
                          //backgroundColor: 'red',
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 100,
                              alignItems: 'center',
                            }}>
                            {item1.profile_image === null ||
                            item1.profile_image === undefined ||
                            item1.profile_image === '' ? (
                              <Image
                                source={{
                                  uri: image_url + 'profile_no_image.jpg',
                                }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: 100,
                                }}
                                resizeMode="cover"
                              />
                            ) : (
                              <Image
                                source={{
                                  uri: image_url + item1.profile_image,
                                }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: 100,
                                }}
                                resizeMode="cover"
                              />
                            )}
                          </View>
                          <View
                            style={{
                              marginLeft: width * 0.01,
                              marginTop: height * 0.011,
                              alignItems: 'flex-start',
                            }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: RFValue(20),
                                  color: '#000',
                                  //fontFamily: 'Roboto-Regular',
                                  fontWeight: '400',
                                  //fontWeight: 'bold',
                                  //letterSpacing: 0.4,
                                }}>
                                #{item1.username}
                              </Text>
                            </View>

                            <Text
                              style={{
                                fontSize: RFValue(14),
                                color: '#7B7B7B',
                                //fontFamily: 'Roboto-Light',
                                fontWeight: '300',
                                //letterSpacing: 0.4,
                              }}>
                              {item1.bio == 'null' || item1.bio == null
                                ? 'Bio'
                                : item1.bio}
                            </Text>
                          </View>
                        </View>

                        <View style={{}}>
                          <Text
                            style={{
                              fontSize: RFValue(18),
                              //fontFamily: 'Roboto - Medium',
                              color: '#151143',
                              fontWeight: '600',
                            }}>
                            {item1.user_count}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {item1.file == undefined ||
                      (item1.file.live.length == 0 &&
                        item1.file.promotional == undefined &&
                        item1.file.reels == undefined) ? (
                        <View
                          style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            //marginVertical: 20,
                            //backgroundColor: 'red',
                            justifyContent: 'center',
                            height: '65%',
                            width: '90%',
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#769292',
                              //fontFamily: 'Rubik',
                              fontWeight: 'normal',
                              letterSpacing: 0.9,
                            }}>
                            No Video has been uploaded
                          </Text>
                        </View>
                      ) : (
                        <View style={{}}>
                          <FlatList
                            data={celebrityArrayData(
                              item1.file.live,
                              item1.file.promotional,
                              item1.file.reels,
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => (
                              <TouchableOpacity
                                onPress={() => {
                                  videoDisplay(item1, item);
                                }}
                                style={{
                                  //height: height * 0.25,
                                  height: 130,
                                  width: 107,
                                  //width: width * 0.3,
                                  borderRadius: 10,
                                  margin: 7,
                                }}>
                                {/* {
                                  (item.image.trim() = '' ? (
                                    <ImageBackground
                                      source={{
                                        uri: 'https://source.unsplash.com/1024x768/?nature',
                                      }}
                                      //source={{uri: thumbnailImage(item.url)}}

                                      imageStyle={{borderRadius: 10}}
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        //borderRadius: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <View style={{height: 25, width: 22}}>
                                        <Image
                                          source={require('../../Assets/Icon/play.png')}
                                          style={{
                                            height: '100%',
                                            width: '100%',
                                          }}
                                        />
                                      </View>
                                    </ImageBackground>
                                  ) : (
                                    <ImageBackground
                                      source={{
                                        uri: item1.image,
                                      }}
                                      //source={{uri: thumbnailImage(item.url)}}

                                      imageStyle={{borderRadius: 10}}
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        //borderRadius: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <View style={{height: 25, width: 22}}>
                                        <Image
                                          source={require('../../Assets/Icon/play.png')}
                                          style={{
                                            height: '100%',
                                            width: '100%',
                                          }}
                                        />
                                      </View>
                                    </ImageBackground>
                                  ))
                                } */}

                                <ImageBackground
                                  source={{
                                    uri:
                                      item.image == ''
                                        ? 'https://source.unsplash.com/1024x768/?nature'
                                        : item.image,
                                  }}
                                  //source={{uri: thumbnailImage(item.url)}}

                                  imageStyle={{borderRadius: 10}}
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                    //borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <View style={{height: 25, width: 22}}>
                                    <Image
                                      source={require('../../Assets/Icon/play.png')}
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                      }}
                                    />
                                  </View>
                                </ImageBackground>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}

                      {/* =================================Modal============================================ */}
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
                            }}>
                            <View
                              style={{
                                height: '98%',
                                width: '100%',
                                marginTop: '1%',
                                justifyContent: 'center',
                                //backgroundColor: 'red',
                              }}>
                              <VideoPlayer
                                video={{uri: videoData.file}}
                                autoplay={true}
                                defaultMuted={false}
                                onEnd={() => {
                                  setShowModal(false);
                                }}
                                videoHeight={3000}
                                videoWidth={1600}
                                thumbnail={{
                                  uri:
                                    videoData.image == ''
                                      ? 'https://source.unsplash.com/1024x768/?any'
                                      : videoData.image,
                                }}
                                fullScreenOnLongPress
                                onPlayPress={() => {
                                  console.log(videoData);
                                }}
                                //disableFullscreen={false}
                                customStyles={{
                                  width: '100%',
                                  height: '100%',
                                  position: 'absolute',
                                  //borderRadius: 10,
                                }}
                              />
                            </View>
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
                                }}
                                resizeMode={'contain'}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                      {/* ===============================Exit of Modal======================================= */}
                    </View>
                  );
                })}
            </View>
          </KeyboardAvoidingScrollView>
        </>
      ) : null}
      {/* *******************************************Celebrity*************************************************** */}
      {userType === 2 ? (
        <>
          <View
            style={{
              width: width * 0.95,
              alignItems: 'flex-start',
              marginTop: height * 0.02,
              // backgroundColor: 'red',
            }}>
            <Text
              style={{
                fontSize: RFValue(25),
                //fontFamily: 'Roboto-Medium',
                color: '#151143',
                fontWeight: '500',
              }}>
              Live
            </Text>
          </View>

          {celebrityData.length == 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '30%',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#769292',
                  //fontFamily: 'Rubik',
                  fontWeight: 'normal',
                  letterSpacing: 0.9,
                }}>
                No Video Upload
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: height * 0.65,
                backgroundColor: 'white',
                borderRadius: 15,
              }}>
              <FlatList
                data={celebrityData}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      celebrityvideoDisplay(item);
                    }}
                    style={{
                      height: height * 0.63,
                      //backgroundColor: '#808080',
                      width: width * 0.6,
                      //width: width * 0.3,
                      borderRadius: 15,
                      margin: 7,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ImageBackground
                      source={
                        item.image == ''
                          ? {
                              uri: 'https://source.unsplash.com/1024x768/?any',
                            }
                          : {uri: item.image}
                      }
                      imageStyle={{borderRadius: 15}}
                      style={{
                        height: '100%',
                        width: '100%',
                        //borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={{height: 35, width: 30}}>
                        <Image
                          source={require('../../Assets/Icon/play.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                        />
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <Modal visible={showModal} transparent={true}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '95%',
                  height: '98%',
                  alignSelf: 'center',

                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    height: '97%',
                    width: '100%',
                    marginTop: '1%',
                    //backgroundColor: 'red',
                  }}>
                  <VideoPlayer
                    video={{uri: videoUrl.file}}
                    autoplay={true}
                    defaultMuted={false}
                    onEnd={() => {
                      setShowModal(false);
                    }}
                    videoHeight={3000}
                    videoWidth={1600}
                    thumbnail={{
                      uri:
                        videoUrl.image == ''
                          ? 'https://source.unsplash.com/1024x768/?any'
                          : videoUrl.image,
                    }}
                    fullScreenOnLongPress
                    onPlayPress={() => {
                      //console.log(videoData.id);
                    }}
                    //disableFullscreen={false}
                    customStyles={{
                      width: '100%',
                      height: '100%',
                      //borderRadius: 10,
                    }}
                  />
                </View>
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
                    }}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  division: {
    width: width * 0.7,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    //marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.7,
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

  input: {
    flex: 1,
    color: '#151143',
  },
});
