import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {color} from 'react-native-reanimated';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';

const styles = StyleSheet.create({
  container: {
    width: calcW(0.92),
    height: calcH(0.07),
    borderWidth: 1,
    borderColor: STYLES.PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconContainer: {
    width: calcH(0.025),
    height: calcH(0.025),
    marginLeft: calcW(0.05),
    color: STYLES.PRIMARY_COLOR,
  },
  searchText: {
    fontSize: 15,
    color: STYLES.PRIMARY_COLOR,
    paddingLeft: calcW(0.05),
  },
});

export default styles;
