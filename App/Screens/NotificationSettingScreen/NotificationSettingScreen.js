import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import Hud from '../Common/Hud';

import {postApiCall} from '../../Services/Network';
import {Switch} from 'react-native-switch';
import Toast from 'react-native-toast-message';
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const NotificationSettingScreen = props => {
  const {notificationStatusContextData, setnotificationStatusContextData} =
    useContext(ProfileContext);
  const [isActive, setActive] = useState(notificationStatusContextData);

  const onChangeActive = async val => {
    //setActive(val);
    console.log('=======>', val);

    const notificationStatus = {status: val ? 1 : 0};
    console.log('notificationStatus===>', notificationStatus);
    Hud.showHud();
    await postApiCall('notificationstatus', notificationStatus, {})
      .then(async response => {
        Hud.hideHud();
        console.log('=======>', response.data);
        if (response.status == 200) {
          setActive(val);
          setnotificationStatusContextData(val);
          //AsyncStorage.setItem('notificationStatus', val ? '1' : '0');
        } else {
          console.log('error===>response.data.data.user_type is not 1 or 2');
          Toast.show({
            type: 'error',
            text1: 'Error during Notification status setting',
          });
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error in response for header==>', error.response.data);

          Toast.show({
            type: 'error',
            text1: 'Error during Notification status setting',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.9,
          marginTop: height * 0.03,
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
              color: '#000',
              fontWeight: '500',
              fontSize: RFValue(25),
              //fontFamily: 'Roboto-Medium',
            }}>
            Notification
          </Text>
        </View>

        <View />
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: width * 0.85,
          justifyContent: 'space-between',
          marginTop: height * 0.03,
        }}>
        <View>
          <Text
            style={{
              fontSize: RFValue(20),
              color: '#8E7B85',
              //fontFamily: 'Roboto-Reqular',
              fontWeight: '300',
              //letterSpacing: 0.4,
            }}>
            Allow Notifications
          </Text>
        </View>

        <View>
          <Switch
            value={isActive}
            circleSize={19}
            circleBorderWidth={0}
            barHeight={25}
            switchWidthMultiplier={2.6}
            switchLeftPx={2}
            switchRightPx={2}
            innerCircleStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 2,
            }}
            renderActiveText={false}
            renderInActiveText={false}
            backgroundInactive={'#e8e8e8'}
            backgroundActive={'#e8e8e8'}
            circleActiveColor={'#E92D87'}
            circleInActiveColor={'#808080'}
            onValueChange={status => onChangeActive(status)}
          />
        </View>
      </View>

      <View style={{marginTop: '20%', alignSelf: 'center'}}>
        {isActive ? null : (
          <Text
            style={{
              fontSize: 18,
              color: '#769292',
              //fontFamily: 'Rubik',
              fontWeight: 'normal',
            }}>
            No Notification will be send to you
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationSettingScreen;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
  },

  imagesty: {width: '100%', height: '100%'},
});
