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
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {getApicall, postApiCall} from '../../Services/Network';

import Tooltip from 'react-native-walkthrough-tooltip';
import HeaderWithImageTitle from '../Common/HeaderWithImageTitle';
import Toast from 'react-native-toast-message';
import {image_url} from '../../Services/constants';
//import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Hud from '../Common/Hud';
import Video from 'react-native-video';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {ProfileContext} from '../../Services/ProfileProvider';
import RBSheet from 'react-native-raw-bottom-sheet';

const {width, height} = Dimensions.get('window');

const CelebrityProfileData = props => {
  const {profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    const blur = props.navigation.addListener('blur', () => {
      setIndex(-1);
    });
    return blur;
  }, [props.navigation, currIndex]);

  useEffect(() => {
    getApi(props.route.params.celebrityEmail);

    const unsubscribe = props.navigation.addListener('focus', async () => {
      getApi(props.route.params.celebrityEmail);
    });
    return unsubscribe;
  }, [props.route.params.celebrityEmail]);

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
  const videoRef = useRef(null);

  const refRBSheet = useRef();
  const [currIndex, setIndex] = useState(0);

  const [selected, setSelected] = useState(1);
  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [like, setLike] = useState(null);

  const [favourites, setFavourites] = useState(null);
  const [status, setStatus] = useState(null);

  const [advertisementUrl, setAdvertisementUrl] = useState(null);
  const [reelsAdvertisementUrl, setReelsAdvertisementUrl] = useState(null);

  const [data, setData] = useState([]);
  const [liveVideoData, setLiveVideoData] = useState([]);
  const [promotionalVideoData, setPromotionalVideoData] = useState([]);
  const [reelsVideoData, setReelsVideoData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const [amountModal, setAmountModal] = useState(false);
  const [celebrityAmount, setCelebrityAmount] = useState('');

  const [showTooltip, setShowTooltip] = useState(false);

  const [email, setEmail] = useState('');

  const [questionModal, setQuestionModal] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [channelId, setChannelId] = useState('');

  const getApi = async celebrityEmail => {
    update();
    const emailData1 = {
      email: celebrityEmail,
    };

    Hud.showHud();
    await postApiCall('celebrityprofilereactions', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data.live_schedule_data);
        Hud.hideHud();
        if (response.status == 200) {
          setEmail(celebrityEmail);
          setData(response.data.data);
          if (response.data.data.live_schedule_data != null) {
            setChannelId(response.data.data.live_schedule_data.chanel_id);
          }
          setQuestionList(response.data.data.questions);
          setStatus(response.data.data.private);
          setFavourites(response.data.data.favourite);
          setLike(response.data.data.like);
          setQuestion('');
          setComment('');
          advertisement();
          if (
            response.data.data.celebrity_post.live !== undefined &&
            response.data.data.celebrity_post.live.length !== 0
          ) {
            setLiveVideoData(response.data.data.celebrity_post.live);
          }

          if (
            response.data.data.celebrity_post.promotional !== undefined &&
            response.data.data.celebrity_post.promotional.length !== 0
          ) {
            setPromotionalVideoData(
              response.data.data.celebrity_post.promotional,
            );
          }
          if (
            response.data.data.celebrity_post.reels !== undefined &&
            response.data.data.celebrity_post.reels.length !== 0
          ) {
            setReelsVideoData(response.data.data.celebrity_post.reels);
          }
        } else {
          console.log('error on loading celebrity in Celebrity Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
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
    const emailData = {
      email: props.route.params.celebrityEmail,
    };
    Hud.showHud();
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
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in advertisement function==>',
            error.response.data,
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };
  const update = () => {
    setAdvertisementUrl('');
    setReelsAdvertisementUrl('');

    setLike(false);

    setSelected(1);
    setStatus(true);
    setQuestion('');
    setComment('');
  };

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

  const questionHandel = value => {
    setQuestion(value);
  };
  const handleComment = value => {
    setComment(value);
  };

  const handleLike = async () => {
    const sendData = {
      email: data.email,
    };
    await postApiCall('celebritylike', sendData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          setLike(true);
          Toast.show({
            type: 'success',
            text1: response.data.data,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Celebrity has not been liked yet',
          });
        }
      })
      .catch(function (error) {
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

  const handleFavourites = async () => {
    const sendFavouritesData = {
      email: data.email,
    };
    await postApiCall('celebrityfavourites', sendFavouritesData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          setFavourites(true);
          Toast.show({
            type: 'success',
            text1: 'Favourite added',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Not added as Favourite',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
          Toast.show({
            type: 'info',
            text1: 'Favourite is already added',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error.request==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('error.Setting===>', error.message);
        }
      });
  };

  const handleFollow = async () => {
    const sendData1 = {
      email: data.email,
    };
    await postApiCall('celebrityfollow', sendData1, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: response.data.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Celebrity has not been follow',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
          Toast.show({
            type: 'info',
            text1: 'You are already following',
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

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://qspace1.page.link/qspace?celebrityEmail=${email}`,
          domainUriPrefix: 'https://qspace1.page.link',
          android: {
            packageName: 'com.qspace',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'com.qspace',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      console.log('link:', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };

  const handleShare = async () => {
    //console.log('Share');
    const getLink = await generateLink();
    //const getLink = await buildLink();
    console.log('==========>', getLink);
    try {
      Share.share({
        message: getLink,
        url: getLink,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };
  const handleQuestionAmount = value => {
    setCelebrityAmount(value);
  };

  const sendQuestion = () => {
    if (data.live_schedule_data == null) {
      Alert.alert('Live has not being scheduled by the celebrity yet.');
    } else {
      sendQuestion1();
    }
  };

  const sendQuestion1 = async () => {
    //console.log('question=>', question);
    const questionData = {
      email: data.email,
      question: question,
      amount: celebrityAmount,
      chanel_id: data.live_schedule_data.chanel_id,
    };

    console.log('======>', questionData);
    await postApiCall('user-add-question', questionData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Question has been successfully send',
          });
          setQuestion('');
          setAmountModal(false);
          let tempArr = {
            id: response.data.data.id,
            question: question,
            answer: '',
            chanel_id: channelId,
          };
          setQuestionList([...questionList, tempArr]);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Question has not been successfully send',
          });
        }
      })
      .catch(function (error) {
        setAmountModal(false);
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          if (error.response.data.data.length === 0) {
            var firstItem = error.response.data.message;
          } else {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          }

          console.log('====>firstItem', firstItem);
          // console.log('====>firstItem', typeof firstItem);
          Toast.show({
            type: 'error',
            text1: firstItem,
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

  const sendHandle = async () => {
    //console.log('comment==>', comment);

    const commentData = {
      email: data.email,
      comment: comment,
    };
    console.log('comment==>', commentData);
    await postApiCall('celebritycomment', commentData, {})
      .then(response => {
        console.log('response==>', response.data);
        //setFollow(true);
        //ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: response.data.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Comment has not been successfully send',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded

          console.log('error in response==>', error.response.data);
          if (error.response.data.data.length === 0) {
            var firstItem = error.response.data.message;
          } else {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          }

          console.log('====>firstItem', firstItem);
          // console.log('====>firstItem', typeof firstItem);

          Toast.show({
            type: 'error',
            text1: firstItem,
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

  const handleAmountValue = value => {
    setAmount(value);
  };

  const handleAmount = async () => {
    console.log('Amount==>', amount);
    setShowTooltip(false);
    //setStatus(true);
    const privateData = {
      celebrity_email: data.email,
      amount: amount,
    };
    console.log('PrivateData==>', privateData);
    await postApiCall('celebritymakepublic', privateData, {})
      .then(response => {
        console.log('response==>', response.data);

        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Congratulation',
            text2: 'You can now see Celebrity Profile',
          });
          setStatus(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Sorry',
            text2: 'You cannot see Celebrity Profile for now',
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
          if (error.response.data.data.length != 0) {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          } else {
            var firstItem = error.response.data.message;
          }
          // Request made and server responded
          console.log('====>firstItem', firstItem);
          Toast.show({
            type: 'error',
            text1: firstItem,
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
  const notInterested = async () => {
    console.log('notInterested function');

    Hud.showHud();
    const celebrityEmail = {
      celebrity_email: data.email,
    };
    console.log('Present email===>', celebrityEmail);
    await postApiCall('celebritynotinterest', celebrityEmail, {})
      .then(async response => {
        console.log('=======>', response.data.email);

        if (response.status == 200) {
          console.log('Next email==>', response.data.email);
          if (response.data.email != undefined && response.data.email != null) {
            getApi(response.data.email);
          } else {
            props.navigation.navigate('Home');
          }
        } else {
          console.log('Issue in notInterested function');
          //setLoading(false);
          Hud.hideHud();
        }
      })
      .catch(function (error) {
        //setLoading(false);
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in response of notInterested function ==>',
            error.response.data,
          );
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(
            'error request in notInterested function ===>',
            error.request,
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  const onBuffer = e => {
    // console.log('Buffering....', e.isBuffering);
    if (e.isBuffering == true) {
      //Hud.showHud();
    } else {
      // Hud.hideHud();
    }
  };
  const onError = e => {
    console.log('Error....', e);
  };
  const onChangeIndex = ({index, prevIndex}) => {
    console.log('uuuuuuuuuu', index, prevIndex);
    videoRef.current.seek(0);
    setIndex(index);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1}}>
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
          poster={
            item.image == ''
              ? 'https://source.unsplash.com/1024x768/?any'
              : item.image
          }
          posterResizeMode="cover"
        />
      </View>
    );
  };

  const dateFunc = date => {
    let date1 = new Date(date);
    const istDateString = date1.toLocaleString();

    let date2 = istDateString.split(' ');
    let adjustDate = istDateString;

    //console.log('=============>', istDateString);
    if (date2[5] != undefined) {
      adjustDate =
        date2[0] +
        ', ' +
        date2[1] +
        ' ' +
        date2[3] +
        ' ' +
        date2[5] +
        ' ' +
        date2[4];
    }

    return adjustDate;
  };

  const sendAmount = () => {
    if (celebrityAmount.trim() == '') {
      setAmountModal(false);
      Toast.show({
        type: 'error',
        text1: 'Please Enter your amount',
      });
    } else {
      sendAmount1();
    }
  };

  const sendAmount1 = async () => {
    console.log('======>', questionData, celebrityAmount);
    const amountData = {
      question_id: questionData.id,
      amount: celebrityAmount,
      //celebrityemail: data.email,
    };
    console.log('=================>', amountData);
    await postApiCall('pay-for-answer', amountData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Amount Send',
          });
          setQuestion('');
          setCelebrityAmount('');
          setAmountModal(false);
          setQuestionModal(false);

          let tempArr = questionList;
          tempArr.map(item => {
            if (item.id == questionData.id) {
              item.amount_status = '1';
            }
          });
          setQuestionList([...tempArr]);
          setQuestionData(null);
        } else {
          Toast.show({
            type: 'error',
            text1: response.data.message,
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          setAmountModal(false);
          setQuestionModal(false);
          console.log('error in response==>', error.response.data);
          // if (error.response.data.data.length === 0) {
          //   var firstItem = error.response.data.message;
          // } else {
          //   var myobj = error.response.data.data;
          //   var firstItem = Object.values(myobj)[0];
          // }

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
      style={{flex: 1, backgroundColor: '#000', alignItems: 'center'}}>
      <HeaderWithImageTitle navProps={props.navigation} title={'Profile'} />
      {!status ? (
        <>
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
          <View style={{height: height * 0.8}}>
            {selected === 1 && (
              <>
                {liveVideoData.length === 0 ? (
                  <>
                    <View
                      style={{
                        alignSelf: 'center',
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
                          <Image
                            source={{
                              uri:
                                data.image == null
                                  ? image_url + 'profile_no_image.jpg'
                                  : data.image,
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
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          color: '#769292',
                          //fontFamily: 'Rubik',
                          fontWeight: 'normal',
                          letterSpacing: 0.9,
                        }}>
                        No Live Video
                      </Text>
                    </View>

                    <View
                      style={{
                        position: 'absolute',
                        bottom: '15%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        marginTop: 15,
                        width: width * 0.89,
                        height: 50,
                        //backgroundColor: 'red',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        value={question}
                        onChangeText={value => questionHandel(value)}
                        placeholder="Ask about something?"
                        style={{
                          ...styles.input,
                          backgroundColor: '#FFF',
                          color: '#000',
                        }}
                        placeholderTextColor={'#C7C7C7'}
                        autoCorrect={false}
                      />

                      <TouchableOpacity
                        onPress={() => setAmountModal(true)}
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
                          style={{height: '50%', width: '50%'}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{width: '100%', height: '100%'}}>
                      <SwiperFlatList
                        vertical={true}
                        data={liveVideoData}
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
                          <Image
                            source={{
                              uri:
                                data.image === null
                                  ? image_url + 'profile_no_image.jpg'
                                  : data.image,
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
                    {data.live_schedule_data != null && (
                      <View
                        style={{
                          width: '100%',
                          //backgroundColor: 'red',
                          //height: 50,
                          position: 'absolute',
                          top: height * 0.1,
                          alignSelf: 'center',
                          padding: 7,
                        }}>
                        <Text
                          style={{
                            fontSize: RFValue(18),
                            color: '#FFFFFF',
                            //fontFamily: 'Roboto-Light',
                            fontWeight: '300',
                            //letterSpacing: 0.4,
                          }}>
                          Live Streaming is at :{' '}
                          {dateFunc(data.live_schedule_data.live_date_time)}
                        </Text>
                        {/* <Text
                          style={{
                            fontSize: RFValue(18),
                            color: '#FFFFFF',
                            //fontFamily: 'Roboto-Light',
                            fontWeight: '300',
                            //letterSpacing: 0.4,
                          }}>
                       
                          {dateFunc(data.live_schedule_data.live_date_time)}
                        </Text> */}
                      </View>
                    )}
                    <View
                      style={{
                        right: '6%',
                        position: 'absolute',
                        bottom: '20%',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() => handleLike()}
                        style={{width: 27, height: 26}}>
                        <Image
                          source={require('../../Assets/Icon/Like.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            tintColor: like ? '#E92D87' : '#fff',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          handleFavourites();
                        }}
                        style={{width: 27, height: 26, marginTop: 17}}>
                        <Image
                          source={require('../../Assets/Icon/heart.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            tintColor: favourites ? '#E92D87' : '#fff',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleShare()}
                        style={{width: 27, height: 26, marginTop: 15}}>
                        <Image
                          source={require('../../Assets/Icon/share.png')}
                          style={{height: '100%', width: '100%'}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          onPress={() => handleFollow()}
                          style={{
                            width: width * 0.23,
                            height: 40,
                            marginTop: 15,
                            alignItems: 'center',
                            backgroundColor: '#E1006E',
                            justifyContent: 'center',
                            borderRadius: 7,
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              //fontFamily: 'Roboto-Medium',
                              fontSize: 16,
                            }}>
                            Follow
                          </Text>
                        </TouchableOpacity>
                        {data.live_schedule_data != null && (
                          <TouchableOpacity
                            onPress={() => {
                              refRBSheet.current.open();
                            }}
                            style={{
                              width: width * 0.28,
                              height: 40,
                              marginTop: 15,
                              alignItems: 'center',
                              backgroundColor: '#000000CC',
                              justifyContent: 'center',
                              borderRadius: 7,
                              borderWidth: 1,
                              borderColor: '#E1006E',
                            }}>
                            <Text
                              style={{
                                color: '#E1006E',
                                //fontFamily: 'Roboto-Medium',
                                fontSize: 15,
                              }}>
                              Questions
                            </Text>
                          </TouchableOpacity>
                        )}

                        {/* <TouchableOpacity
                          onPress={() => {
                            notInterested();
                          }}
                          style={{
                            width: width * 0.28,
                            height: 40,
                            marginTop: 15,
                            alignItems: 'center',
                            backgroundColor: '#000000CC',
                            justifyContent: 'center',
                            borderRadius: 7,
                            borderWidth: 1,
                            borderColor: '#E1006E',
                          }}>
                          <Text
                            style={{
                              color: '#E1006E',
                              //fontFamily: 'Roboto-Medium',
                              fontSize: 15,
                            }}>
                            Not Interest
                          </Text>
                        </TouchableOpacity> */}
                        {data.live_schedule_data != null && (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 15,
                              width: width * 0.89,
                              height: 50,
                              //backgroundColor: 'red',
                              justifyContent: 'space-between',
                            }}>
                            <TextInput
                              value={question}
                              onChangeText={value => questionHandel(value)}
                              placeholder="Ask about something?"
                              style={{
                                ...styles.input,
                                backgroundColor: '#000',
                                color: '#fff',
                              }}
                              placeholderTextColor={'#C7C7C7'}
                              autoCorrect={false}
                            />

                            <TouchableOpacity
                              onPress={() => setAmountModal(true)}
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
                                style={{height: '50%', width: '50%'}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                        <Modal visible={amountModal} transparent={true}>
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
                                height: '30%',
                                //backgroundColor: 'red',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: '90%',
                                  height: 120,
                                  backgroundColor: '#fff',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 10,
                                  position: 'absolute',

                                  //paddingBottom: 10,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    width: '90%',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: RFValue(18),
                                      //fontFamily: 'Roboto-Medium',
                                      fontWeight: '500',
                                    }}>
                                    Enter the Amount
                                  </Text>
                                  <TouchableOpacity
                                    style={{
                                      height: 20,
                                      width: 20,
                                    }}
                                    onPress={() => setAmountModal(false)}>
                                    <Image
                                      source={require('../../Assets/Icon/close.png')}
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        tintColor: '#000',
                                      }}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: 15,
                                    width: width * 0.82,
                                    height: 50,

                                    justifyContent: 'space-between',
                                    marginBottom: 10,
                                  }}>
                                  <TextInput
                                    onChangeText={value =>
                                      handleQuestionAmount(value)
                                    }
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    style={{
                                      ...styles.toLock,
                                      backgroundColor: '#EBE0E5',
                                      color: '#151143',
                                    }}
                                    placeholderTextColor={'#8E7B85'}
                                    autoCorrect={false}
                                  />

                                  <TouchableOpacity
                                    onPress={() => {
                                      sendQuestion();
                                      setAmountModal(false);
                                    }}
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
                                      style={{height: '50%', width: '50%'}}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Modal>
                      </View>
                    </View>
                  </>
                )}
              </>
            )}
            {selected === 2 && (
              <>
                {promotionalVideoData.length === 0 ? (
                  <>
                    <View
                      style={{
                        alignSelf: 'center',
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
                          <Image
                            source={{
                              uri:
                                data.image == null
                                  ? image_url + 'profile_no_image.jpg'
                                  : data.image,
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
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          color: '#769292',
                          //fontFamily: 'Rubik',
                          fontWeight: 'normal',
                          letterSpacing: 0.9,
                        }}>
                        No Promotional Video
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{width: '100%', height: '100%'}}>
                      <SwiperFlatList
                        vertical={true}
                        data={promotionalVideoData}
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
                          <Image
                            source={{
                              uri:
                                data.image == null
                                  ? image_url + 'profile_no_image.jpg'
                                  : data.image,
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
                    <View
                      style={{
                        right: '6%',
                        position: 'absolute',
                        bottom: '14%',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() => handleLike()}
                        style={{width: 27, height: 26}}>
                        <Image
                          source={require('../../Assets/Icon/Like.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            tintColor: like ? '#E92D87' : '#fff',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          handleFavourites();
                        }}
                        style={{width: 27, height: 26, marginTop: 17}}>
                        <Image
                          source={require('../../Assets/Icon/heart.png')}
                          style={{
                            height: '100%',
                            width: '100%',
                            tintColor: favourites ? '#E92D87' : '#fff',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleShare()}
                        style={{width: 27, height: 26, marginTop: 15}}>
                        <Image
                          source={require('../../Assets/Icon/share.png')}
                          style={{height: '100%', width: '100%'}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
            {selected === 3 && (
              <>
                {reelsVideoData.length === 0 ? (
                  <>
                    <View
                      style={{
                        alignSelf: 'center',
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
                          <Image
                            source={{
                              uri:
                                data.image === null
                                  ? image_url + 'profile_no_image.jpg'
                                  : data.image,
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
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          color: '#769292',
                          //fontFamily: 'Rubik',
                          fontWeight: 'normal',
                          letterSpacing: 0.9,
                        }}>
                        No Reels Video
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{width: '100%', height: '100%'}}>
                      <SwiperFlatList
                        vertical={true}
                        data={reelsVideoData}
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
                          <Image
                            source={{
                              uri:
                                data.image === null
                                  ? image_url + 'profile_no_image.jpg'
                                  : data.image,
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
                )}
              </>
            )}
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setShowTooltip(true)}
            style={{
              width: 25,
              height: 30,
              marginTop: 10,
              alignSelf: 'flex-end',
              right: '10%',
            }}>
            <Tooltip
              isVisible={showTooltip}
              placement="bottom"
              arrowSize={{width: 16, height: 13}}
              onClose={() => setShowTooltip(false)}
              content={
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: RFValue(18),
                      //fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                    }}>
                    Enter the Amount
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      width: width * 0.82,
                      height: 50,
                      //backgroundColor: 'red',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                    <TextInput
                      onChangeText={value => handleAmountValue(value)}
                      placeholder="Amount"
                      keyboardType="numeric"
                      style={{
                        ...styles.toLock,
                        backgroundColor: '#EBE0E5',
                        color: '#151143',
                      }}
                      placeholderTextColor={'#8E7B85'}
                      autoCorrect={false}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        handleAmount();
                      }}
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
                        style={{height: '50%', width: '50%'}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              }>
              <Image
                source={require('../../Assets/Icon/locked.png')}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </Tooltip>
          </TouchableOpacity>

          <View
            style={{
              right: '6%',
              position: 'absolute',
              bottom: '14%',
              alignItems: 'flex-end',
            }}>
            <View style={{width: 27, height: 26}}>
              <Image
                source={require('../../Assets/Icon/Like.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  tintColor: '#8A8A8A',
                }}
                resizeMode="contain"
              />
            </View>

            <View style={{width: 27, height: 26, marginTop: 17}}>
              <Image
                source={require('../../Assets/Icon/heart.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  tintColor: '#8A8A8A',
                }}
                resizeMode="contain"
              />
            </View>

            <View style={{width: 27, height: 26, marginTop: 15}}>
              <Image
                source={require('../../Assets/Icon/share.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  tintColor: '#8A8A8A',
                }}
                resizeMode="contain"
              />
            </View>

            <View
              style={{
                width: width * 0.89,
                // alignSelf: 'center',
                //alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'space-between',
                //backgroundColor: 'blue',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{
                      uri:
                        data.image === null
                          ? image_url + 'profile_no_image.jpg'
                          : data.image,
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
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
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
                      fontSize: 12,
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Light',
                      fontWeight: '300',
                      //letterSpacing: 0.4,
                    }}>
                    {data.bio}
                  </Text>
                </View>
              </View>
              <View style={{}}>
                <View
                  style={{
                    width: width * 0.23,
                    height: 40,
                    marginTop: 15,
                    alignItems: 'center',
                    backgroundColor: '#8A8A8A',
                    justifyContent: 'center',
                    borderRadius: 7,
                    alignSelf: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      //fontFamily: 'Roboto-Medium',
                      fontSize: 16,
                    }}>
                    Follow
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    notInterested();
                  }}
                  style={{
                    width: width * 0.28,
                    height: 40,
                    marginTop: 15,
                    alignItems: 'center',
                    backgroundColor: '#000000CC',
                    justifyContent: 'center',
                    borderRadius: 7,
                    borderWidth: 1,
                    borderColor: '#8A8A8A',
                    alignSelf: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#8A8A8A',
                      //fontFamily: 'Roboto-Medium',
                      fontSize: 15,
                    }}>
                    Not Interest
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                width: width * 0.89,
                height: 50,
                //backgroundColor: 'red',
                justifyContent: 'space-between',
              }}>
              <TextInput
                onChangeText={value => handleComment(value)}
                placeholder="Comment.."
                style={{
                  ...styles.input,
                  backgroundColor: '#8A8A8A',
                  //color: '#151143',
                }}
                placeholderTextColor={'#C7C7C7'}
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() => sendHandle()}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#8A8A8A',
                  borderRadius: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../Assets/Icon/send.png')}
                  style={{height: '50%', width: '50%'}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <RBSheet
        height={370}
        animationType="slide"
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        closeOnSwipeDown={false}
        customStyles={{
          container: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          },
          wrapper: {
            backgroundColor: 'transparent',
            // backgroundColor: 'rgba(0,0,0,0.3)',
            //backgroundColor: 'rgba(225,225,225,0.1)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}>
          <View
            style={{
              height: '98%',
              width: '100%',
              //backgroundColor: 'red',
            }}>
            {questionList.length == 0 ? (
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
                  No Question
                </Text>
                {/* <TouchableOpacity
                  style={{
                    marginVertical: height * 0.05,
                    width: width * 0.5,
                    backgroundColor: '#E92D87',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: 50,
                  }}
                  onPress={() => {
                    refRBSheet.current.close();
                    setTimeout(() => {
                      setQuestionModal(true);
                    }, 300);
                  }}>
                  <Text style={{fontSize: RFValue(15), color: '#FFFFFF'}}>
                    Add Question
                  </Text>
                </TouchableOpacity> */}
              </View>
            ) : (
              <>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={{width: '100%'}}
                  contentContainerStyle={{}}>
                  <View
                    style={{
                      marginBottom: height * 0.02,
                      width: '100%',
                    }}>
                    {questionList
                      .filter(item => item.chanel_id == channelId)
                      .map((item, index1) => {
                        return (
                          <View
                            key={index1}
                            style={{
                              marginVertical: 5,
                              flexDirection: 'row',
                              // height: 100,
                              alignSelf: 'center',

                              width: '95%',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: '85%',
                                //justifyContent: 'space-between',
                                marginBottom: 5,
                                //backgroundColor: 'pink',
                                alignSelf: 'center',
                              }}>
                              <Text
                                style={{
                                  width: '90%',
                                  fontSize: RFValue(15),
                                  color: '#000',
                                  fontWeight: '500',
                                }}>
                                <Text
                                  style={{
                                    width: '95%',
                                    fontSize: RFValue(15),
                                    color: '#000',
                                    fontWeight: 'bold',
                                  }}>
                                  {'Que: '}
                                </Text>
                                {item.question}
                              </Text>
                              {/* {item.answer != '' && item.amount_status != '' && (
                              <Text
                                style={{
                                  width: '95%',
                                  fontSize: RFValue(14),
                                  color: '#000',
                                  fontWeight: '300',
                                }}>
                                <Text
                                  style={{
                                    width: '95%',
                                    fontSize: RFValue(15),
                                    color: '#000',
                                    fontWeight: 'bold',
                                  }}>
                                  {'Ans: '}
                                </Text>
                                {item.answer}
                              </Text>
                            )} */}
                            </View>

                            <TouchableOpacity
                              onPress={() => {
                                setQuestionData(item);
                                refRBSheet.current.close();
                                setTimeout(() => {
                                  setAmountModal(true);
                                }, 300);
                              }}
                              style={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#E92D87',
                                borderRadius: 7,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                              }}>
                              <Image
                                source={require('../../Assets/Icon/dollar.png')}
                                style={{height: '50%', width: '50%'}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                  </View>
                </ScrollView>
                {/* <TouchableOpacity
                          style={{
                            marginVertical: height * 0.01,
                            marginRight: width * 0.05,
                            backgroundColor: '#E92D87',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 10,
                            alignSelf: 'flex-end',
                          }}
                          onPress={() => {
                            refRBSheet.current.close();
                            setTimeout(() => {
                              setQuestionModal(true);
                            }, 300);
                          }}>
                          <Text
                            style={{fontSize: RFValue(15), color: '#FFFFFF'}}>
                            Add Question
                          </Text>
                        </TouchableOpacity> */}
              </>
            )}
          </View>
        </View>
      </RBSheet>
      <Modal visible={amountModal} transparent={true}>
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
              height: '30%',
              //backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                width: '90%',
                height: 120,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                position: 'absolute',

                //paddingBottom: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '90%',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: RFValue(18),
                    //fontFamily: 'Roboto-Medium',
                    fontWeight: '500',
                  }}>
                  Enter the Amount
                </Text>
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  onPress={() => setAmountModal(false)}>
                  <Image
                    source={require('../../Assets/Icon/close.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      tintColor: '#000',
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  width: width * 0.82,
                  height: 50,
                  //backgroundColor: 'red',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <TextInput
                  onChangeText={value => handleQuestionAmount(value)}
                  placeholder="Amount"
                  keyboardType="numeric"
                  style={{
                    ...styles.toLock,
                    backgroundColor: '#EBE0E5',
                    color: '#151143',
                  }}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                />

                <TouchableOpacity
                  onPress={() => {
                    // sendAmount()
                    questionData != null ? sendAmount() : sendQuestion();
                  }}
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
                    style={{height: '50%', width: '50%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={questionModal} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '90%',
              height: 120,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              position: 'absolute',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: RFValue(18),
                  //fontFamily: 'Roboto-Medium',
                  fontWeight: '500',
                }}>
                Ask Question
              </Text>
              <TouchableOpacity
                style={{
                  height: 20,
                  width: 20,
                }}
                onPress={() => setQuestionModal(false)}>
                <Image
                  source={require('../../Assets/Icon/close.png')}
                  style={{
                    height: '100%',
                    width: '100%',
                    tintColor: '#000',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                width: width * 0.82,
                height: 50,
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <TextInput
                value={question}
                onChangeText={value => setQuestion(value)}
                placeholder="Ask about something?"
                style={{
                  ...styles.toLock,
                  backgroundColor: '#EBE0E5',
                  color: '#151143',
                }}
                placeholderTextColor={'#8E7B85'}
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() => {
                  //sendQuestion();
                  setQuestionModal(false);
                  setAmountModal(true);
                }}
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
                  style={{height: '50%', width: '50%'}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CelebrityProfileData;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: height * 0.8,
    width: width * 0.98,
    alignSelf: 'center',
    //position: 'absolute',
  },
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
    //borderWidth: 1,
    //borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderBottomColor: '#E1006E',
    borderBottomWidth: 1,
  },

  IconStyle: {
    width: 100,
    height: 40,
    //backgroundColor: '#fff',
    borderColor: '#808080',
    //borderWidth: 1,
    //borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#fff',
  },

  toLock: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#000',
  },
});
