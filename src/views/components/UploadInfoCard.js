import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';

import COLORS from '../../conts/colors.js';
import {calcH} from '../../utils/constants/common.js';

const UploadInfoCard = ({text, onPress, source, containerStyle}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, {...containerStyle}]}>
        <FastImage source={source} style={styles.image} resizeMode="cover" />
        <Text style={styles.text}>{text} </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UploadInfoCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    height: calcH(0.08),
    width: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.white,
    // marginVertical: calcH(0.01),
  },
  sub: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginHorizontal: calcH(0.015),
  },

  text: {
    color: COLORS.black,
    textAlign: 'center',
    marginLeft: 10,
  },
  image: {
    height: calcH(0.06),
    width: calcH(0.06),
    //flex: 1,
    // width: '100%',
    // height: '100%',
    marginHorizontal: calcH(0.015),
    //paddingLeft: 50,
  },
});
