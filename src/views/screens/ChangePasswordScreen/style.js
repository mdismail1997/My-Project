import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingTop: calcW(0.4),
    paddingHorizontal: calcH(0.03),
  },
});

export default styles;
