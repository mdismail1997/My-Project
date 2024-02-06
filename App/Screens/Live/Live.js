import React, {useState, useEffect, useContext} from 'react';

import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  TextInput,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';

import Header from '../Common/Header';
import Toast from 'react-native-toast-message';

import {image_url} from '../../Services/constants';
import {getApicall, postApiCall} from '../../Services/Network';
import Hud from '../Common/Hud';
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const Live = props => {
  const {setQuestionList, profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    getCelebrityLiveApi();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getCelebrityLiveApi();
    });
    return unsubscribe;
  }, []);

  const [listData, setListData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const searchHandler = value => {
    setSearch(value);
    if (value === '') {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  };

  // console.log('====================>', props.route.params.searchData, search);

  const getCelebrityLiveApi = async () => {
    setSearch(props.route.params.searchData);
    Hud.showHud();
    await getApicall('celebritylivelist', {}, {})
      .then(response => {
        Hud.hideHud();
        if (response.status == 200) {
          console.log('Celebrity Live List===>', response.data.data);
          setListData(response.data.data);
          // let temp = response.data.data.filter(item => {
          //   return item.chanel_id != '41ea3ce9-f227-4d59-bfd9-1b2c2a35d518';
          // });

          // setListData([...temp]);
        } else {
          console.log('error on loading celebrity Live List==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);

        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
          Toast.show({
            type: 'error',
            text1: response.data.data.message,
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

  const questionData = async item => {
    Hud.showHud();

    await getApicall(
      `celebrity-question-list-by-email?celebrity_email=${item.email}`,
      {},
      {},
    )
      .then(response => {
        console.log('data===>', response.data.data.questions[0]);
        //Hud.hideHud();
        if (response.status == 200) {
          if (response.data.data.profile_data.private == false) {
            // setQuestionList(response.data.data.questions);
            // props.navigation.navigate('OnLive', {
            //   type: 'join',
            //   channel: item.chanel_id,
            //   data: response.data.data.profile_data,
            //   questionList: response.data.data.questions,
            // });
            console.log('======response.data=========>', response.data);
            sendLiveStatus(response.data.data, item.chanel_id);
          } else {
            Alert.alert(
              'You are not eligible to see Live of this celebrity for now',
            );
          }
        } else {
          console.log('error on loading celebrity in Celebrity Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        console.log('error in post Function==>', error);

        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const sendLiveStatus = async (data, channel) => {
    console.log('==========>', data.profile_data);
    const sendData = {
      user_id: profileContextData.id,
      celebrity_id: data.profile_data.id,
      chanel_id: channel,
    };
    console.log('=====sendData======>', sendData);
    await postApiCall('user-join-live-streaming', sendData, {})
      .then(response => {
        console.log('data===>', response.data);
        Hud.hideHud();
        if (response.status == 200) {
          setQuestionList(data.questions);
          props.navigation.navigate('OnLive', {
            type: 'join',
            channel: channel,
            data: data.profile_data,
            questionList: data.questions,
          });
        } else {
          console.log('error on loading celebrity in Celebrity Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        console.log('error in post Function==>', error);

        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data.message);
          setQuestionList(data.questions);
          props.navigation.navigate('OnLive', {
            type: 'join',
            channel: channel,
            data: data.profile_data,
            questionList: data.questions,
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <Header navProps={props.navigation} />

      <View
        style={{
          width: width * 0.95,
          alignItems: 'flex-start',
          marginTop: height * 0.02,
          marginLeft: 15,
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: width * 0.9,
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: height * 0.01,
          marginBottom: height * 0.01,
          //backgroundColor: 'red',
        }}>
        <View style={showSearch ? styles.divisionSelect : styles.division}>
          <TouchableOpacity
            style={{
              height: 50,
              width: 18,

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
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              returnKeyType="search"
              style={{
                flex: 1,
                color: '#151143',
              }}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#E92D87',
            borderRadius: 10,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{width: 30, height: 30}}>
            <Image
              source={require('../../Assets/Icon/camera.png')}
              style={{height: '100%', width: '100%'}}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {listData.length === 0 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '25%',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: '#769292',
              //fontFamily: 'Rubik',
              fontWeight: 'normal',
            }}>
            No Celebrity is Live for now
          </Text>
        </View>
      ) : (
        <View
          style={{
            height: height * 0.65,
            //height: 240,
            // width: width * 0.9,
            backgroundColor: 'white',
            borderRadius: 15,
            //marginTop: height * 0.01,
          }}>
          {/* <View style={{height: height * 0.65}}> */}

          <FlatList
            data={listData.filter(function (item) {
              return (
                item.email.toLowerCase().startsWith(search.toLowerCase()) ||
                item.chanel_id.toLowerCase().startsWith(search.toLowerCase()) ||
                item.name.toLowerCase().startsWith(search.toLowerCase()) ||
                item.username.toLowerCase().startsWith(search.toLowerCase())
              );
            })}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  questionData(item);
                }}
                style={{
                  //height: height * 0.25,
                  height: height * 0.6,
                  //backgroundColor: 'red',
                  width: width * 0.6,
                  //width: width * 0.3,
                  borderRadius: 15,
                  margin: 7,
                }}>
                <ImageBackground
                  imageStyle={{borderRadius: 10}}
                  source={
                    item.profile_image === null
                      ? {
                          uri: image_url + 'profile_no_image.jpg',
                        }
                      : {
                          uri: image_url + item.profile_image,
                        }
                  }
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  resizeMode="cover">
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
          {/* </View> */}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Live;

const styles = StyleSheet.create({
  division: {
    width: width * 0.75,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    //marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.75,
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
