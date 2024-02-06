import React, {useContext} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {Avatar, Badge} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {userLogoutAction} from '../../Redux/actions/AuthAction';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';
import ProfileContext from '../../Services/ProfileProvider';
import axios from 'axios';
import {AUTH_URL, BASE_URL} from '../../Services/ApiConst';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUser, getUserToken} from '../../utils/DataStore';
import {useEffect} from 'react';
import {useState} from 'react';
export const Header = props => {
  const dispatch = useDispatch();
  // const profileContext = useContext(ProfileContext);
  const Auth = useSelector(state => state.Auth);
  const [userId, setUserId] = useState('');

  return (
    <View style={styles.view}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
          <Image
            source={require('../../Assets/back.png')}
            resizeMode="contain"
            style={{width: wp(24), height: wp(20), marginRight: wp(22)}}
          />
        </TouchableOpacity>
        {props.avatar? (
          <Avatar.Image size={40} source={props.avatarImage} style={{marginRight: wp(12)}}/>
        ): null}
        <Text
          style={{
            // marginLeft: wp(22),
            fontSize: wp(18),
            fontFamily: FONT_FAMILY.LATO_REGULAR,
            color: COLORS.DARK_CHARCOAL,
            flex: 1,
          }}>
          {props.title}
        </Text>
        <TouchableOpacity onPress={props.onpress}>
          <Image
            style={{
              width: wp(25),
              height: hp(25),
              resizeMode: 'contain',
            }}
            source={props.Icon}
          />
        </TouchableOpacity>
        {props.icon ? (
          <TouchableOpacity onPress={props.onpress}>
            <Image
              style={{
                width: wp(25),
                height: hp(25),
                resizeMode: 'contain',
              }}
              source={props.IconDot}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // marginTop:30,
    // marginLeft:10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
