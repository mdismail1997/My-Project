import React from 'react';
import {View, StyleSheet, StatusBar, Text} from 'react-native';

import {useNetInfo} from '@react-native-community/netinfo';

import COLORS from '../../conts/colors.js';

const OfflineNotice = props => {
  const netInfo = useNetInfo();

  if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );

  return null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.header_color,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    //top: StatusBar.currentHeight,
    width: '100%',
    zIndex: 1,
  },
  text: {
    color: COLORS.white,
  },
});

export default OfflineNotice;
