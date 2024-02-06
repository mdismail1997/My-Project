import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {ProfileContext} from '../../Services/ProfileProvider';

const {width, height} = Dimensions.get('window');

const HeaderWithImageTitle = props => {
  const {profileContextData} = useContext(ProfileContext);

  return (
    <View
      style={{
        flexDirection: 'row',
        width: width * 0.9,
        justifyContent: 'space-between',
        marginTop: height * 0.03,
        //backgroundColor: 'blue',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <View
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
          source={{uri: profileContextData.profile_image}}
          //source={require('../../Assets/Images/Img.png')}
          style={{height: '100%', width: '100%', borderRadius: 100}}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: RFValue(25),
            fontWeight: '500',
            color: '#fff',
          }}>
          {props.title}
        </Text>
      </View>

      <View
        onPress={() => {
          //props.navProps.navigate('Notification');
        }}
        style={{
          height: height * 0.05,
          width: width * 0.06,
          marginHorizontal: '5%',
        }}>
        {/* <View
          style={{
            height: height * 0.05,
            width: width * 0.06,
            marginHorizontal: '5%',
          }}>
         

          {unreadNotification == true ||
          notificationContext.usernotificationstatus == 'Y' ? (
            <Image
              source={require('../../Assets/Icon/notificationwhite.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../Assets/Icon/noti.png')}
              style={{width: '100%', height: '100%', tintColor: '#fff'}}
              resizeMode="contain"
            />
          )}
        </View> */}
      </View>
    </View>
  );
};

export default HeaderWithImageTitle;

const styles = StyleSheet.create({});
