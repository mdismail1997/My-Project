import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

import {allPadding, calcH, calcW} from '../utils/comon';
import {Switch} from 'react-native-switch';
import {BASE_URL} from '../utils/Api/apiName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Header = props => {
  const [isEnabled, setIsEnabled] = useState(true);
  const activeDriver = async status => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('Status--------------', status);
    setIsEnabled(status);
    if (status === true) {
      await axios({
        method: 'post',
        url: BASE_URL + 'active-user',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
      })
        .then(response => {
          console.log('1232222132132132132132132132 ', response);

          //setIsEnabled(response.success)
          // setFilePathDlFront(response.data.car_image_number_back)
        })
        .catch(err => {
          console.log('err', err);
          //Alert.alert(err);
        });
    } else {
      await axios({
        method: 'post',
        url: BASE_URL + 'inactive-user',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
      })
        .then(response => {
          console.log('1232222132132132132132132132 ', response);

          //setIsEnabled(response.success)
          // setFilePathDlFront(response.data.car_image_number_back)
        })
        .catch(err => {
          console.log('err', err);
          //Alert.alert(err);
        });
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: calcW(1.0),
        height: calcH(0.08),
        borderColor: 'blue',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        padding: allPadding,
        // borderColor: '#000',
        borderWidth: 0,
        elevation: 5,
      }}>
      <View
        style={{
          width: calcW(0.4),
          height: calcH(0.05),
          borderColor: '#000',
          borderWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            width: calcW(0.2),
            height: calcH(0.2),
            justifyContent: 'center',
            paddingLeft: calcW(0.05),
            marginTop: calcH(0.015),
          }}
          onPress={() => props.navigation.openDrawer()}>
          {/* <Icons name="menu-outline" color={'#000'} size={25} /> */}
          <Image
            style={{width: calcW(0.06), height: calcH(0.025)}}
            source={require('../asserts/menu-icon.png')}
          />
        </TouchableOpacity>

        <Image
          source={require('../asserts/logo.png')}
          style={styles.headerLogo}
        />
      </View>
      <View
        style={{
          //margin: calcW(0.9),
          //position: 'absolute',
          //
          left: calcW(0.2),
          flex: 1,
        }}>
        {/* <Switch
              trackColor={{ false: '#808080', true: '#ddd' }}
              thumbColor={isEnabled ? '#0E6060' : '#ddd'}
              ios_backgroundColor="#0E6060"
              onValueChange={(status) => setIsEnabled(status)}
              value={isEnabled}
            />  */}

        <Switch
          circleSize={19}
          circleBorderWidth={1}
          barHeight={22}
          switchWidthMultiplier={2}
          innerCircleStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            margin: 2,
          }}
          switchLeftPx={2}
          switchRightPx={2}
          renderActiveText={false}
          renderInActiveText={false}
          backgroundInactive={'#ddd'}
          backgroundActive={'#0E6060'}
          circleActiveColor={'#ddd'}
          circleInActiveColor={'#0E6060'}
          onValueChange={status => activeDriver(status)}
          value={isEnabled}
        />
      </View>
      <View style={{justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('notifications')}>
          <Image
            style={styles.bellIcon}
            source={require('../asserts/bell.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerLogo: {
    width: calcW(0.3),
    height: calcW(0.22),
    resizeMode: 'contain',
    left: calcW(0.04),
    // alignItems: 'flex-start',
  },
  bellIcon: {
    right: calcW(0.04),
    width: calcW(0.09),
    height: calcW(0.09),
    marginTop: calcW(0.06),
  },
  menuIcon: {
    width: calcW(0.2),
    height: calcW(0.1),
  },
});
