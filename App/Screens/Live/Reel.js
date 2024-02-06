import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Video from 'react-native-video';
import {RFValue} from 'react-native-responsive-fontsize';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Hud from '../Common/Hud';
import {image_url} from '../../Services/constants';
import {getApicall, postApiCall} from '../../Services/Network';
//import DashedLine from 'react-native-dashed-line';

const {width, height} = Dimensions.get('window');
const Reel = props => {
  useEffect(() => {
    // console.log('VideoRef', videoRef);
    if (!videoRef.current) {
      videoRef.current.seek(0);
    }
    getReelApi();
    getApi();
  }, [currIndex]);

  const onBuffer = e => {
    console.log('Buffering....', e);
  };
  const onError = e => {
    console.log('Error....', e);
  };
  const data1 = [
    {
      id: 1,
      title: 'Product 1',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?nature',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      id: 2,
      title: 'Product 2',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?water',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1',
    },
    {
      id: 3,
      title: 'Product 4',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?tree',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
  ];
  const videoRef = useRef(null);
  const [currIndex, setIndex] = useState(0);
  const [data, setData] = useState([]);

  const [reelData, setReelData] = useState(
    'https://demos.mydevfactory.com/socialnetwork/public/promotional/4e2c12d9a2d89d7c329bdc531b0e6dd7.mp4',
  );

  const getApi = async () => {
    const celebrityData = JSON.parse(
      await AsyncStorage.getItem('celebrityData'),
    );
    const emailData1 = {
      email: celebrityData.email,
    };

    Hud.showHud();
    await postApiCall('celebrityprofilereactions', emailData1, {})
      .then(response => {
        console.log('data===>', response.data.data);
        Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
        } else {
          console.log('error on loading celebrity in Celebrity Page==>');
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
    setIndex(index);
  };

  const renderItem = ({item, index}) => {
    console.log('jjjjjjjjjjj', item);
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
          poster="https://source.unsplash.com/1024x768/?tree"
          posterResizeMode="cover"
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
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
    </View>
  );
};

export default Reel;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
});
