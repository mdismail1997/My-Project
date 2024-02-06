import React, {useState, useContext} from 'react';
import {
  ImageBackground,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import RBSheet from 'react-native-raw-bottom-sheet';
import Icons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {createThumbnail} from 'react-native-create-thumbnail';

import Hud from '../../Screens/Common/Hud';
import Toast from 'react-native-toast-message';
import {base_url} from '../../Services/constants';

import {getApicall, postApiCall} from '../../Services/Network';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const BottomTab = props => {
  const {profileContextData} = useContext(ProfileContext);

  //const refRBSheet = useRef();

  const setRoute = (pageName, index) => {
    props.navigation.jumpTo(pageName);
    //setRouteState(index);
  };

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [suggestedAmount, setSuggestedAmount] = useState(false);
  const [amount, setAmount] = useState('');
  const [shownAmount, setShownAmount] = useState(false);
  const [smallModal, setSmallModal] = useState(true);

  const walletTab = async () => {
    if (profileContextData.user_type === 1) {
      props.navigation.jumpTo('Wallet');
    } else if (profileContextData.user_type === 2) {
      props.navigation.jumpTo('Balance');
    }
  };

  const chatTab = async () => {
    if (profileContextData.user_type === 1) {
      props.navigation.jumpTo('Chat');
    } else if (profileContextData.user_type === 2) {
      props.navigation.jumpTo('ChatCelebrity');
    }
  };

  const storeVideo = num => {
    console.log('video in gallery');
    //setShowModal(false);
    ImagePicker.openPicker({
      mediaType: 'video',
      useFrontCamera: true,
    })
      .then(vid => {
        console.log('Video Data==>', vid);
        //setVideo(vid.path);

        if (vid.duration >= 60000) {
          Toast.show({
            type: 'error',
            text1: 'Please upload max 1 min video as promotional video',
          });
          setShowModal(false);
        } else {
          uploadVideoFunc(vid, num);
        }
      })
      .catch(error => {
        console.log('User cancelled Video selection from Gallery', error);
      });
  };

  const newVideo = num => {
    console.log('video from camera');
    setShowModal(false);
    //refRBSheet.current.close();
    ImagePicker.openCamera({
      mediaType: 'video',
      useFrontCamera: true,
    })
      .then(vid => {
        console.log('recording video==>', vid);
        //setVideo(vid.path);

        uploadVideoFunc(vid, num);
      })
      .catch(error => {
        //console.log(error);
        console.log('User cancelled Video selection from Camera', error);
      });
  };

  const uploadVideoFunc = async (file, type) => {
    //Hud.showHud();
    setLoading(true);
    var img;
    try {
      const imgResponse = await createThumbnail({
        url:
          Platform.OS == 'ios' ? file.path?.replace('file://', '/') : file.path,
        timeStamp: 100,
      });
      console.log('Thumbnail response==>', imgResponse);
      img = imgResponse.path;
      console.log('===>', img);
    } catch (error) {
      console.log('error==>', error);
      img =
        'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132__340.png';
    }
    const data = new FormData();
    data.append('video_type', type);
    data.append('file', {
      //uri: file,
      uri:
        Platform.OS == 'ios' ? file.path?.replace('file://', '/') : file.path,
      name: 'name.mp4',
      type: file.mime,
    });
    data.append('image', {
      //uri: profileimage,
      uri: img,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
    console.log('========>', data);
    const AccessToken = await AsyncStorage.getItem('token');

    try {
      let res = await fetch(base_url + `celebritypost`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data;',
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      let responseJson = await res.json().then(response => {
        console.log('responseJson===>', response);
        Hud.hideHud();
        setLoading(false);
        if (response.success === true) {
          Toast.show({
            type: 'success',
            text1: 'Video has been uploaded',
          });
        } else {
          var myobj = response.data.file;
          var firstItem = Object.values(myobj)[0];
          //console.log('====>firstItem', firstItem);
          //console.log('====>firstItem', typeof firstItem);
          Toast.show({
            type: 'error',
            text1: firstItem,
          });
        }
      });
    } catch (error) {
      Hud.hideHud();
      setLoading(false);
      console.log('Error==>', error);
      Toast.show({
        type: 'error',
        text1: 'Error ',
      });
    } finally {
      //Hud.hideHud();
      setShowModal(false);
    }
  };

  const onLive = async () => {
    console.log('Live Function Enter here');
    setShowModal(false);
    props.navigation.navigate('LiveCelebrity');
  };

  const handleAmount = value => {
    setAmount(value);
    //setShownAmount(true);
    if (value.trim() == '') {
      setShownAmount(false);
    } else {
      setShownAmount(true);
    }
  };

  const onLiveFunc = async () => {
    if (amount.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Please Enter valid minimum Amount',
      });
    } else {
      setSuggestedAmount(false);
      //setAmount('');
      setShownAmount(false);
      const channelId = uuid();
      //const channelId = '78209773-8430-440a-9b73-31e12ff887a7';
      Hud.showHud();
      const liveData = {
        channel_id: channelId,
        amount: amount,
      };

      console.log('====>', liveData);
      await postApiCall('celebritylive', liveData, {})
        .then(response => {
          console.log('Going Live===>', response.data);
          Hud.hideHud();
          if (response.status == 200) {
            setShowModal(false);
            // props.navigation.navigate('LiveCelebrity');
            props.navigation.navigate('CelebrityOnLive', {
              type: 'create',
              channel: channelId,
            });
            setAmount('');
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
              text1: 'Error while sharing Channel ID',
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

  return (
    <ImageBackground
      source={require('../../Assets/Icon/bottom-background-image.png')}
      resizeMode="stretch"
      imageStyle={{tintColor: '#fff', position: 'absolute', bottom: 0}}
      style={{
        //flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        //height: '27%',
        height: height * 0.13,
        //backgroundColor: 'white',
        aspectRatio: 2.75,
      }}>
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          //height: '27%',
          height: height * 0.13,
          //backgroundColor: 'white',
          aspectRatio: 2.75,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            marginLeft: width * 0.078,
            marginRight: 10,
            //paddingTop: 35,
            bottom: 5,
            //width:'20%',
            width: width * 0.16,
            //height:60,
            borderWidth: 0,
            //borderColor: 'red',
            //backgroundColor:'#E92D87',
            borderRadius: 100,
          }}
          onPress={() => setRoute('Home', 0)}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: '#E92D87',
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../../Assets/Icon/Home.png')}
            />
          </View>
        </TouchableOpacity>

        {profileContextData.user_type === 2 && (
          <TouchableOpacity
            onPress={() => {
              setShowModal(true);
              setSmallModal(true);
            }}>
            <View style={styles.division}>
              <View style={styles.IconStyleChat}>
                <Image
                  source={require('../../Assets/Icon/add.png')}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}

        <Modal
          visible={showModal}
          transparent={true}
          //animationType={'slide'}
          //presentationStyle="formSheet"
        >
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              flex: 1,
              alignItems: 'center',
              //justifyContent: 'center',
            }}>
            {suggestedAmount && (
              <View
                style={{
                  //height: 80,
                  width: width * 0.9,
                  alignSelf: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 7,
                  padding: 15,
                  marginTop: height * 0.1,
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#151143',
                      fontSize: RFValue(18),
                      fontWeight: '500',
                      //fontFamily: 'Roboto-Medium',
                    }}>
                    Suggested Amount
                  </Text>
                  <TouchableOpacity
                    style={{width: 25, height: 25}}
                    onPress={() => {
                      setSuggestedAmount(false);
                      setSmallModal(true);
                    }}>
                    <Image
                      source={require('../../Assets/Icon/close.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        tintColor: '#A6A6A6',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignSelf: 'center',
                    marginVertical: height * 0.02,
                  }}>
                  <TextInput
                    value={amount}
                    onChangeText={value => handleAmount(value)}
                    placeholder="Enter Amount"
                    style={
                      shownAmount
                        ? {...styles.selectedInput, color: '#151143'}
                        : styles.input
                    }
                    placeholderTextColor={'#8E7B85'}
                    autoCorrect={false}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={() => onLiveFunc()}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: '#E92D87',
                      borderRadius: 7,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../Assets/Icon/tick.png')}
                      style={{height: '50%', width: '65%'}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {smallModal && (
              <View
                style={{
                  width: '100%',
                  //height: user === 1 ? 200 : 250,
                  //alignSelf: 'center',
                  backgroundColor: '#fff',
                  //alignItems: 'center',
                  //borderRadius: 10,
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                  position: 'absolute',
                  bottom: 0,
                  paddingBottom: height * 0.05,
                }}>
                {isLoading ? (
                  <View
                    style={{
                      width: '100%',
                      height: 240,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#E92D87" />
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        //backgroundColor: 'red',
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingRight: width * 0.05,
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: RFValue(23),
                          //fontFamily: 'Roboto-Bold',
                          fontWeight: '700',
                          color: 'black',
                          margin: 10,
                        }}>
                        Create
                      </Text>

                      <TouchableOpacity onPress={() => setShowModal(false)}>
                        <Icons name="close" size={28} color={'#000'} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => newVideo(2)}
                      style={styles.refDivision}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          backgroundColor: 'rgba(225,225,225,0.5)',
                          // backgroundColor: '#E92D87',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}>
                        <View
                          style={{
                            height: 15,
                            width: 25,
                            //marginRight: 3,
                          }}>
                          <Image
                            source={require('../../Assets/Icon/camera.png')}
                            style={{
                              width: '100%',
                              height: '100%',
                              tintColor: '#000',
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      </View>

                      <Text style={styles.rawTextStyle}>
                        Create a Reel Video
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => storeVideo(1)}
                      style={styles.refDivision}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          backgroundColor: 'rgba(225,225,225,0.5)',
                          // backgroundColor: '#E92D87',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}>
                        <Icons name="image" size={28} color={'#000'} />
                      </View>

                      <Text style={styles.rawTextStyle}>
                        Upload a Promotional Video
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        //onLive()
                        setSuggestedAmount(true);
                        setSmallModal(false);
                        // onLiveFunc();
                      }}
                      style={styles.refDivision}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          backgroundColor: 'rgba(225,225,225,0.5)',
                          // backgroundColor: '#E92D87',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 100,
                        }}>
                        <View
                          style={{
                            height: 15,
                            width: 25,
                            //marginRight: 3
                          }}>
                          <Image
                            source={require('../../Assets/Icon/live.jpg')}
                            style={{
                              width: '100%',
                              height: '100%',
                              tintColor: '#000',
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      </View>

                      <Text style={styles.rawTextStyle}>Go Live</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </Modal>
        <TouchableOpacity onPress={() => chatTab()}>
          <View style={styles.division}>
            <View style={styles.IconStyleChat}>
              <Image
                source={require('../../Assets/Icon/chat.png')}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          //onPress={() => setRoute('Wallet', 3)}
          onPress={() => walletTab()}>
          <View style={styles.division}>
            <View style={styles.IconStyleChat}>
              <Image
                source={require('../../Assets/Icon/wallet.png')}
                // style={{ width: 20, height: 19 }}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default BottomTab;
const styles = StyleSheet.create({
  IconStyleChat: {
    height: 25,
    width: 28,
    marginBottom: 0,
  },

  division: {
    //justifyContent: 'space-between',
    //alignItems: 'center',
    //backgroundColor: 'red',
    width: width * 0.15,
    height: height * 0.1,
    // alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
    //alignContent:'center',

    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    //paddingTop: 35,
  },

  Container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'black',
    width: '100%',
    height: height * 0.13,
    backgroundColor: '#ffff',
    aspectRatio: 2.75,
    borderTopEndRadius: 28,
    borderTopStartRadius: 28,
  },

  refDivision: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 7,
    alignItems: 'center',
    //backgroundColor: 'pink',
  },

  rawTextStyle: {
    fontSize: RFValue(16),
    marginLeft: 10,
    color: '#000',
  },
  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    backgroundColor: '#EBE0E5',
    color: '#000',
  },
  selectedInput: {
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
