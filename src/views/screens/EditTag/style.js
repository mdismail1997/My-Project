import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {calcH, calcW, fSize, STYLES} from '../../../utils/constants/common';
import COLORS from '../../../conts/colors';
import {FONTS} from '../../../conts/theme.js';

const styles = StyleSheet.create({
  headerDot: {
    width: calcW(0.15),
    height: calcH(0.009),
    borderRadius: 4,
    backgroundColor: '#00000040',
    //marginBottom: 10,
    margin: calcH(0.015),
    //borderWidth: 5,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    height: calcH(0.85),
    //alignItems: 'center',
    //borderWidth: 1,
    //borderRadius: 10,
    flex: 1,
  },
  bottomSheetText: {
    fontSize: fSize(22),
    //fontWeight: '900',
    color: COLORS.white,
    ...FONTS.Poppins_reg,
  },
  bottomSheetText2: {
    fontSize: fSize(15),
    //fontWeight: '900',
    textAlign: 'center',
    color: COLORS.white,
    ...FONTS.Poppins_reg,
  },
  a: {
    fontWeight: 'bold',
    color: 'purple',
  },
  div: {
    fontFamily: 'monospace',
  },
  p: {
    fontSize: 30,
  },
  /*******************************/
  containerModal: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 4,
    backgroundColor: '#F5FCFF',
    //borderWidth: 1,
  },
  editor: {
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 0.2,
    height: 20,
  },
  rich: {
    minHeight: calcH(0.3),
    //height: 150,
    //flex: 1,
  },
  richBar: {
    height: calcH(0.045),
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    //borderWidth: 1,
    color: COLORS.black,
  },
  tib: {
    textAlign: 'center',
    color: COLORS.black,
  },
});

export default styles;
