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
import React, {useState, useEffect, useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import Toast from 'react-native-toast-message';
import {image_url} from '../../Services/constants';
//import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Hud from '../Common/Hud';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('window');

const Promotional = props => {
  useEffect(() => {
    //getApi();
    getDataValue();
    getPromotionalApi();
  }, []);

  const videoRef = useRef(null);
  const onBuffer = e => {
    console.log('Buffering....', e.isBuffering);
  };
  const onError = e => {
    console.log('Error....', e);
  };

  const [like, setLike] = useState(null);
  const [data, setData] = useState([]);
  //const [promotionalData, setPromotionalData] = useState([])
  const [promotionalData, setPromotionalData] = useState(
    'https://demos.mydevfactory.com/socialnetwork/public/promotional/4e2c12d9a2d89d7c329bdc531b0e6dd7.mp4',
  );

  const [favourites, setFavourites] = useState(null);

  // const getApi = async () => {
  //   const celebrityData = JSON.parse(
  //     await AsyncStorage.getItem('celebrityData'),
  //   );
  //   const emailData1 = {
  //     email: celebrityData.email,
  //   };

  //   Hud.showHud();
  //   await postApiCall('celebrityprofilereactions', emailData1, {})
  //     .then(response => {
  //       console.log('data===>', response.data.data);
  //       Hud.hideHud();
  //       if (response.status == 200) {
  //         //console.log(response.data.data);
  //         setData(response.data.data);

  //         setFavourites(response.data.data.favourite);
  //         setLike(response.data.data.like);
  //         //advertisement();
  //       } else {
  //         console.log('error on loading celebrity in Celebrity Page==>');
  //       }
  //     })
  //     .catch(function (error) {
  //       Hud.hideHud();
  //       console.log('error in getApi Function==>', error);

  //       if (error.response) {
  //         // Request made and server responded
  //         console.log('error==>', error.response.data);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         console.log('Request Error==>', error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.log('Error', error.message);
  //       }
  //     });
  // };

  const getDataValue = async () => {
    console.log('daaatttaaa===>', props.data);
    setData(props.data);
    setFavourites(props.data.favourite);
    setLike(props.data.like);
  };

  const getPromotionalApi = async () => {
    const celebrityData = JSON.parse(
      await AsyncStorage.getItem('celebrityData'),
    );
    const emailData1 = {
      celebrity_email: celebrityData.email,
      video_type: 1,
    };

    Hud.showHud();
    await postApiCall('celebritypostdetails', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data);
        Hud.hideHud();
        if (response.status == 200) {
          setPromotionalData(response.data.data);
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
  const handleLike = async () => {
    console.log('======>', data);
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

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <View style={{flex: 1}}>
        <Video
          source={{
            uri: promotionalData[0].file,
          }} // Can be a URL or a local file.
          ref={videoRef} // Store reference
          onBuffer={onBuffer} // Callback when remote video is buffering
          onError={onError} // Callback when video cannot be loaded
          style={{height: '100%', width: '100%'}}
          resizeMode="cover"
          paused={false}
          //paused={true}
          repeat
          //poster="https://source.unsplash.com/1024x768/?nature"
          posterResizeMode="cover"
        />
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
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
        </View>
      </View>
      <View
        style={{
          right: '6%',
          position: 'absolute',
          bottom: '7%',
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
      </View>
    </View>
  );
};

export default Promotional;

const styles = StyleSheet.create({});
