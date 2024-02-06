import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import COLORS from '../../conts/colors.js';
import {calcH, fSize} from '../../utils/constants/common.js';

const CustomErrorText = ({error}) => {
  if (error) {
    return (
      <View>
        <Text style={styles.text}>{error} </Text>
      </View>
    );
  }
};

export default CustomErrorText;

const styles = StyleSheet.create({
  text: {
    //marginVertical: calcH(0.005),
    marginBottom: calcH(0.008),
    color: COLORS.red,
    fontSize: fSize(12),
    top: -calcH(0.003),
  },
});
