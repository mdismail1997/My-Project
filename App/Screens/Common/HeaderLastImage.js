import React, {useContext, useState} from 'react';
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

const HeaderLastImage = props => {
  const {profileContextData} = useContext(ProfileContext);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.87,
        marginTop: height * 0.02,
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <TouchableOpacity
        style={{
          height: 18,
          width: 10,

          marginLeft: 10,
        }}
        onPress={() => props.navProps.goBack()}>
        <Image
          source={require('../../Assets/Icon/back.png')}
          style={{
            height: '100%',
            width: '100%',
            tintColor: 'black',
          }}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: '#151143',
          fontWeight: 'bold',
          fontSize: RFValue(25),
          //fontFamily: 'Roboto-Bold',
        }}>
        {props.title}
      </Text>

      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 100,
          //marginLeft: '2%',
          //marginLeft: 10,
          //marginHorizontal: '5%',
          alignItems: 'center',
          //backgroundColor:'red'
        }}>
        <Image
          source={{uri: profileContextData.profile_image}}
          //source={require('../../Assets/Images/angelina.png')}
          style={{height: '100%', width: '100%', borderRadius: 100}}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default HeaderLastImage;

const styles = StyleSheet.create({});
