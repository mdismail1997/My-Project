import React, {useState, useEffect, useContext} from 'react';

import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  ImageBackground,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';

//import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Toast from 'react-native-toast-message';
import {getApicall, postApiCall} from '../../Services/Network';
import Hud from '../Common/Hud';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {ProfileContext} from '../../Services/ProfileProvider';

import HeaderWithImageTitle from '../Common/HeaderWithImageTitle';

const {width, height} = Dimensions.get('window');

const LiveCelebrity = props => {
  //const profile = props.route.params.data;
  const {profileContextData} = useContext(ProfileContext);
  const [question, setQuestion] = useState('Which is your favorite song?');
  const [amount, setAmount] = useState('');
  const [shownAmount, setShownAmount] = useState(false);
  const [suggestedAmount, setSuggestedAmount] = useState(false);

  const onLive = async () => {
    if (amount.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Please Enter valid minimum Amount',
      });
    } else {
      setSuggestedAmount(false);
      setAmount('');
      setShownAmount(false);
      const channelId = uuid();
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
            props.navigation.navigate('CelebrityOnLive', {
              type: 'create',
              channel: channelId,
            });
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

  const handleAmount = value => {
    setAmount(value);
    //setShownAmount(true);
    if (value.trim() == '') {
      setShownAmount(false);
    } else {
      setShownAmount(true);
    }
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        translucent={false}
      />
      <ImageBackground
        //source={{uri: profile.profile_image}}
        source={{uri: profileContextData.profile_image}}
        //source={require('../../Assets/Images/angelinacover.png')}
        style={{height: '100%', width: '100%'}}>
        <HeaderWithImageTitle navProps={props.navigation} title={'Profile'} />

        {suggestedAmount && (
          <View
            style={{
              //height: 80,
              width: width * 0.9,
              alignSelf: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 7,
              padding: 15,
              marginTop: height * 0.03,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                //backgroundColor: 'red',
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
              <TouchableOpacity style={{width: 25, height: 25}}>
                <Image
                  source={require('../../Assets/Icon/close.png')}
                  style={{height: '100%', width: '100%', tintColor: '#A6A6A6'}}
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
                onPress={() => onLive()}
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

        <View
          style={{
            position: 'absolute',
            bottom: height * 0.05,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setSuggestedAmount(true);
            }}
            style={{
              width: 80,
              height: 80,
              //borderWidth: 9,
              //borderColor: 'rgba(225,225,225,0.7)',
              borderRadius: 100,
              alignSelf: 'center',
            }}>
            <Image
              source={require('../../Assets/Icon/cameralive.png')}
              style={{height: '100%', width: '100%'}}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: RFValue(20),
              color: '#FFFFFF',
              //fontFamily: 'Roboto-Medium',
              fontWeight: '500',
              alignSelf: 'center',
            }}>
            Make Video
          </Text>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: width * 0.55,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#E1006E',
              backgroundColor: '#000',
              marginVertical: 5,
            }}>
            <Text style={{color: '#E1006E', fontSize: 16, fontWeight: '600'}}>
              Not Interest to Answer
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LiveCelebrity;

const styles = StyleSheet.create({
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
