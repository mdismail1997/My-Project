import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Tooltip from 'react-native-walkthrough-tooltip';
import HeaderWithImageTitle from '../Common/HeaderWithImageTitle';
import Toast from 'react-native-toast-message';
import {image_url} from '../../Services/constants';
//import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Hud from '../Common/Hud';
import OnLive2 from '../Live/OnLive2';
import Promotional from '../Live/Promotional';
//import Reel from '../Live/Reel';
import Video from 'react-native-video';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
//import DashedLine from 'react-native-dashed-line';

const {width, height} = Dimensions.get('window');

const CelebrityProfilePage = props => {
  useEffect(() => {
    getApi();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getApi();
      update();
      getReelApi();
      advertisement();
    });
    //console.log('videoRef==>', videoRef.current);
    // if (videoRef.current != null) {
    //   if (!videoRef.current) {
    //     videoRef.current.seek(0);
    //   }
    // }
    return unsubscribe;
  }, [currIndex]);
  const videoRef = useRef(null);
  const channel = props.route.params.channel;
  const [selected, setSelected] = useState(1);
  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [follow, setFollow] = useState(null);
  const [like, setLike] = useState(null);

  const [favourites, setFavourites] = useState(null);
  const [status, setStatus] = useState(null);

  const [advertisementUrl, setAdvertisementUrl] = useState(null);
  const [reelsAdvertisementUrl, setReelsAdvertisementUrl] = useState(null);

  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showReelsModal, setShowReelsModal] = useState(false);

  const [reelData, setReelData] = useState(
    'https://demos.mydevfactory.com/socialnetwork/public/promotional/4e2c12d9a2d89d7c329bdc531b0e6dd7.mp4',
  );

  const [currIndex, setIndex] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);
  const option = [
    {
      id: 1,
      title: 'Live',
    },
    {
      id: 2,
      title: 'Promotional',
    },
    {
      id: 3,
      title: 'Reels',
    },
  ];

  const printText = id => {
    setSelected(id);
    //console.log('*******advertisementUrl*********', advertisementUrl);
    if (id === 2 && advertisementUrl != null && advertisementUrl != '') {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } else if (
      id === 3 &&
      reelsAdvertisementUrl != null &&
      reelsAdvertisementUrl != ''
    ) {
      setShowReelsModal(true);
      setTimeout(() => {
        setShowReelsModal(false);
      }, 3000);
    }
  };
  const update = async () => {
    setAdvertisementUrl('');
    setReelsAdvertisementUrl('');

    setSelected(1);
    setStatus(true);
  };
  const getApi = async () => {
    const celebrityData = JSON.parse(
      await AsyncStorage.getItem('celebrityData'),
    );
    const emailData1 = {
      email: celebrityData.email,
    };

    setAdvertisementUrl('');
    setReelsAdvertisementUrl('');
    //Hud.showHud();
    await postApiCall('celebrityprofilereactions', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data);
        //Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
          //setFollow(response.data.data.follow);
          setStatus(response.data.data.private);
          //setFavourites(response.data.data.favourite);
          //setLike(response.data.data.like);
          //setQuestion('');
          //setComment('');
          advertisement();
        } else {
          //setLoading(false);
          console.log('error on loading celebrity in Celebrity Page==>');
        }
      })
      .catch(function (error) {
        //Hud.hideHud();
        console.log('error in getApi Function==>', error);
        //setLoading(false);
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };
  const advertisement = async () => {
    //console.log('APi data===>', apiData);
    const advData = JSON.parse(await AsyncStorage.getItem('celebrityData'));
    const emailData = {
      email: advData.email,
    };
    Hud.showHud();
    //console.log('email in Advertisement===>', emailData);
    await postApiCall('celebrityadvertisement', emailData, {})
      .then(response => {
        //setLoading(false);
        Hud.hideHud();
        if (response.status == 200) {
          if (response.data.data.length != 0) {
            console.log('Advertisement =====>', response.data.data[0].file);
            setAdvertisementUrl(response.data.data[0].file);
            if (response.data.data.length != 1) {
              console.log(
                'ReelAdvertisement =====>',
                response.data.data[1].file,
              );
              setReelsAdvertisementUrl(response.data.data[1].file);
            }
          }
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        //setLoading(false);
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in advertisement function==>',
            error.response.data,
          );
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const getReelApi = async () => {
    const celebrityData = JSON.parse(
      await AsyncStorage.getItem('celebrityData'),
    );
    const emailData1 = {
      celebrity_email: celebrityData.email,
      video_type: 2,
    };

    Hud.showHud();
    await postApiCall('celebritypostdetails', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data);
        Hud.hideHud();
        if (response.status == 200) {
          setReelData(response.data.data);
        } else {
          console.log('error on loading Promotional Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        console.log('error in getApi Function==>', error);

        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const onChangeIndex = ({index, prevIndex}) => {
    console.log('uuuuuuuuuu', index, prevIndex);
    videoRef.current.seek(0);
    setIndex(index);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, height: '100%'}}>
        <Video
          source={{
            uri: item.file,
          }}
          ref={videoRef}
          onBuffer={onBuffer}
          onError={onError}
          style={styles.backgroundVideo}
          resizeMode="cover"
          paused={currIndex !== index}
          //paused={false}
          repeat
          poster="https://source.unsplash.com/1024x768/?any"
          posterResizeMode="cover"
        />
      </View>
    );
  };

  const onBuffer = e => {
    console.log('Buffering....', e.isBuffering);
    if (e.isBuffering == true) {
      //Hud.showHud();
    } else {
      // Hud.hideHud();
    }
  };
  const onError = e => {
    console.log('Error....', e);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
      <HeaderWithImageTitle navProps={props.navigation} title={'Profile'} />

      <View style={{height: height * 0.07}}>
        <FlatList
          data={option}
          horizontal={true}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                printText(item.id);
              }}>
              <View
                style={
                  selected === item.id
                    ? styles.IconStyleSelected
                    : styles.IconStyle
                }>
                <Text
                  style={
                    selected === item.id ? styles.textSelect : styles.text
                  }>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal visible={showModal} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '60%',
              height: '73%',
              alignSelf: 'center',
              // backgroundColor: 'red',
            }}>
            <ImageBackground
              source={{uri: advertisementUrl}}
              style={{width: '100%', height: '100%'}}
              resizeMode={'cover'}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                }}
                style={{
                  alignSelf: 'flex-end',
                  width: 15,
                  height: 15,
                }}>
                <Image
                  source={require('../../Assets/Icon/cross.png')}
                  style={{width: '100%', height: '100%'}}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </Modal>

      <Modal visible={showReelsModal} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: '70%',
              //backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                width: '88%',
                height: '10%',
                alignSelf: 'center',
                // backgroundColor: 'red',
              }}>
              <ImageBackground
                //source={require('../../Assets/Images/ad.png')}
                source={{uri: reelsAdvertisementUrl}}
                style={{width: '100%', height: '100%'}}
                resizeMode={'cover'}>
                <TouchableOpacity
                  onPress={() => {
                    setShowReelsModal(false);
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    width: 12,
                    height: 12,
                  }}>
                  <Image
                    source={require('../../Assets/Icon/cross.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{height: height * 0.85}}>
        {selected === 1 ? (
          <>
            <OnLive2
              type="join"
              channel={props.route.params.channel}
              minAmount={props.route.params.minAmount}
              data={data}
            />
          </>
        ) : null}
        {selected === 2 ? <Promotional data={data} /> : null}
        {/* {selected === 3 ? <Reel data={data} /> : null} */}

        {selected === 3 ? (
          <>
            <View style={{width: '100%', height: '100%'}}>
              <SwiperFlatList
                vertical={true}
                data={reelData}
                showsHorizontalScrollIndicator={false}
                onChangeIndex={onChangeIndex}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                //margin: 5,
                marginTop: height * 0.01,
                width: width * 0.9,
                justifyContent: 'space-between',
                //backgroundColor: 'blue',
                position: 'absolute',
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100,

                    alignItems: 'center',
                  }}>
                  {data.image === null ? (
                    <Image
                      source={{
                        uri: image_url + 'profile_no_image.jpg',
                      }}
                      //source={require('../../Assets/Images/angelina.png')}
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
                        uri: data.image,
                      }}
                      //source={require('../../Assets/Images/angelina.png')}
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
                  <Text
                    style={{
                      fontSize: RFValue(20),
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Regular',
                      fontWeight: '400',
                      //fontWeight: 'bold',
                      //letterSpacing: 0.4,
                    }}>
                    #{data.username}
                  </Text>

                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Light',
                      fontWeight: '300',
                      //letterSpacing: 0.4,
                    }}>
                    {data.bio}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: height * 0.01,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(18),
                    //fontFamily: 'Roboto-Medium',
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}>
                  {data.totalfollow}
                </Text>
              </View>
            </View>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CelebrityProfilePage;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#808080',
    //fontFamily: 'Roboto-Regular',
  },

  textSelect: {
    fontSize: 16.5,
    alignSelf: 'center',
    color: '#E1006E',
    //fontFamily: 'Roboto-Regular',
  },

  IconStyleSelected: {
    width: 100,
    height: 40,
    borderColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderBottomColor: '#E1006E',
    borderBottomWidth: 1,
  },

  IconStyle: {
    width: 100,
    height: 40,
    borderColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    color: '#fff',
  },

  toLock: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    color: '#000',
  },
  backgroundVideo: {
    height: height * 0.8,
    width: width * 0.98,
    alignSelf: 'center',
    //position: 'absolute',
  },
});
