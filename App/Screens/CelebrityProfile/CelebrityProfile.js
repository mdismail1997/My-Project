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
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
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
import {ProfileContext} from '../../Services/ProfileProvider';
const {width, height} = Dimensions.get('window');

const CelebrityProfile = props => {
  const {profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    getApi();
    update();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getApi();
      //update();
    });
    return unsubscribe;
  }, []);

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
  const [amountModal, setAmountModal] = useState(false);
  const [celebrityAmount, setCelebrityAmount] = useState('');

  const [showTooltip, setShowTooltip] = useState(false);

  const update = async () => {
    setAdvertisementUrl('');
    setReelsAdvertisementUrl('');
    setFollow(false);
    setLike(false);

    setSelected(1);
    setStatus(true);
    setQuestion('');
    setComment('');
  };
  const getApi = async () => {
    const celebrityData = JSON.parse(
      await AsyncStorage.getItem('celebrityData'),
    );

    const emailData1 = {
      email: celebrityData.email,
    };
    //console.log('email===>', emailData1);
    setAdvertisementUrl('');
    setReelsAdvertisementUrl('');
    Hud.showHud();
    await postApiCall('celebrityprofilereactions', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data);
        Hud.hideHud();
        if (response.status == 200) {
          //console.log(response.data.data);
          setData(response.data.data);
          setFollow(response.data.data.follow);
          setStatus(response.data.data.private);
          setFavourites(response.data.data.favourite);
          setLike(response.data.data.like);
          setQuestion('');
          setComment('');
          advertisement();
          //setLoading(false);
        } else {
          //setLoading(false);
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
          //ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
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
  //const data = props.route.params.celebrityData;
  const option = [
    {
      id: 1,
      title: 'Live',
      status: 'It is live',
    },
    {
      id: 2,
      title: 'Promotional',
      status: 'It is Promotional',
    },
    {
      id: 3,
      title: 'Reels',
      status: 'It is Reels',
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
          //ToastAndroid.show(response.data.data, ToastAndroid.SHORT);
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
          //ToastAndroid.show('Favourite added', ToastAndroid.SHORT);
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
          //ToastAndroid.show('Favourite is already added', ToastAndroid.SHORT);
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
          setFollow(true);
          //ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
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
          // ToastAndroid.show('You are already following', ToastAndroid.SHORT);
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

  const handleShare = async () => {
    //console.log('Share');
    try {
      const result = await Share.share({
        title: 'Celebrity Profile!',
        message: `Please check the profile!\r\n\r\nhttps://www.youtube.com/watch?v=vXzpEJeVmi8&t=4s\r\n\r\nLet's get moving!`,
        url: 'https://www.youtube.com/watch?v=vXzpEJeVmi8&t=4s',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('It has been Share');
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share has been dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const handleQuestionAmount = value => {
    setCelebrityAmount(value);
  };

  const sendQuestion = async () => {
    //console.log('question=>', question);
    //console.log('Question button has been clicked');
    const questionData = {
      email: data.email,
      question: question,
      amount: celebrityAmount,
      currency: profileContextData.currency,
    };
    await postApiCall('addquestion', questionData, {})
      .then(response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Toast.show({
            type: 'success',
            text1: 'Question has been successfully send',
          });
          setQuestion('');
          setAmountModal(false);
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
          //ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
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
          // console.log('error==>', error.response.data);
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
          console.log('error in response==>', error.response.data);
          if (error.response.data.data.length === 0) {
            var firstItem = error.response.data.message;
          } else {
            var myobj = error.response.data.data;
            var firstItem = Object.values(myobj)[0];
          }

          console.log('====>firstItem', firstItem);
          // console.log('====>firstItem', typeof firstItem);
          //ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
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
        //setFollow(true);
        //ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
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
    //setLoading(true);
    //console.log('Next email===>', data.email);
    // const celebrityList = JSON.parse(
    //   await AsyncStorage.getItem('celebrityEmailList'),
    // );

    //console.log('List===>', celebrityList);

    //var temp = [];
    Hud.showHud();
    const celebrityEmail = {
      celebrity_email: data.email,
    };
    console.log('Present email===>', celebrityEmail);
    await postApiCall('celebritynotinterest', celebrityEmail, {})
      .then(async response => {
        console.log('=======>', response.data.email);
        //Hud.hideHud();
        if (response.status == 200) {
          console.log('Next email==>', response.data.email);
          if (response.data.email != undefined && response.data.email != null) {
            await AsyncStorage.setItem(
              'celebrityData',
              JSON.stringify(response.data),
            );
            getApi();
          } else {
            props.navigation.navigate('Home');
          }
          //setLoading(false);
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
    // for (var i = 0; i < celebrityList.length; i++) {
    //   if (data.email === celebrityList[i].email) {
    //     if (i + 1 < celebrityList.length) {
    //       await AsyncStorage.setItem(
    //         'celebrityData',
    //         JSON.stringify(celebrityList[i + 1]),
    //       );
    //       break;
    //     } else {
    //       console.log('First celebrity===>', celebrityList[0]);
    //       await AsyncStorage.setItem(
    //         'celebrityData',
    //         JSON.stringify(celebrityList[0]),
    //       );
    //       break;
    //     }
    //   }
    // }
    //getApi();
  };
  // console.log('Data in celebrity Profile page ==>', data);

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      /> */}

      {/* <ImageBackground
        source={
          selected == 1
            ? require('../../Assets/Images/chesterunsplash.png')
            : selected == 2
            ? require('../../Assets/Images/chesterunsplash.png')
            : require('../../Assets/Images/reel.png')
        }
        style={{height: '100%', width: '100%'}}
        blurRadius={!status ? 0 : 10}
        resizeMode="cover"> */}
      <View
        style={{
          //justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          //backgroundColor: 'blue',
        }}>
        <HeaderWithImageTitle navProps={props.navigation} title={'Profile'} />

        {/* ************************************************************************************* */}

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

            <View
              style={{
                flexDirection: 'row',
                //margin: 5,
                marginTop: height * 0.01,
                width: width * 0.9,
                justifyContent: 'space-between',
                //backgroundColor: 'blue',
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
                  //backgroundColor: 'green',
                  //alignItems: 'flex-end',
                  marginTop: height * 0.01,
                  //justifyContent: 'center',
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

                {selected == 1 ? (
                  <View style={{width: 20, height: 26, marginTop: 10}}>
                    <Image
                      source={require('../../Assets/Icon/unlock.png')}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="cover"
                    />
                  </View>
                ) : null}
              </View>
            </View>

            {selected != 3 ? (
              <View
                style={{
                  right: '6%',
                  //alignSelf: 'flex-end',
                  //width: width * 0.3,
                  //height: height * 0.4,
                  //backgroundColor: 'red',
                  position: 'absolute',
                  bottom: '14%',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => handleLike()}
                  style={{width: 27, height: 26}}>
                  <Image
                    source={require('../../Assets/Icon/Like.png')}
                    style={
                      like
                        ? {
                            height: '100%',
                            width: '100%',
                            tintColor: '#E92D87',
                          }
                        : {height: '100%', width: '100%', tintColor: '#fff'}
                    }
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
                    style={
                      favourites
                        ? {
                            height: '100%',
                            width: '100%',
                            tintColor: '#E92D87',
                          }
                        : {height: '100%', width: '100%', tintColor: '#fff'}
                    }
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

                {selected == 1 ? (
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
                    </TouchableOpacity>

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
                ) : null}
              </View>
            ) : null}
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
              {/* <Image
                  source={require('../../Assets/Icon/locked.png')}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="contain"
                /> */}
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

            {/* <View
                style={{
                  height: height * 0.5,
                  width: width * 0.9,
                  backgroundColor: 'red',
                  position: 'absolute',
                  bottom: 0,
                }}></View> */}

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
                    {data.image === null ? (
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
                          uri: data.image,
                        }}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 100,
                        }}
                        resizeMode="cover"
                      />
                    )}
                    {/* <Image
                        source={require('../../Assets/Images/angelina.png')}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 100,
                        }}
                        resizeMode="cover"
                      /> */}
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
                      {data.email}
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
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

export default CelebrityProfile;

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
