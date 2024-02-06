import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import COLORS from '../../conts/colors.js';
import {calcH} from '../../utils/constants/common.js';

const FloatingButton = ({onPress, containerStyle}) => {
  return (
    <View style={[styles.createProductContainer, {...containerStyle}]}>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={COLORS.FloatingButton_ColorL}
          size={calcH(0.075)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  createProductContainer: {
    //alignItems: 'flex-end',
    //marginTop: calcH(0.022),
    position: 'absolute',
    bottom: calcH(0.09),
    right: 5,
    //top: 100,
    //left: 10,
  },
});
