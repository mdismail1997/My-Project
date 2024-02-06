import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import COLORS from '../../../conts/colors.js';
import {FONTS} from '../../../conts/theme.js';
import {calcH, calcW, fSize, STYLES} from '../../../utils/constants/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginHorizontal: calcW(0.04),
    //height: '100%',
  },
  subContainer: {
    //position: 'relative',
    //borderWidth: 1,
    marginHorizontal: calcW(0.04),
  },

  noOrderText: {
    ...FONTS.Poppins_med,
    fontSize: fSize(25),
  },
});

export default styles;
