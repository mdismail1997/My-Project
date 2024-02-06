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
  searchContainer: {
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  totalproductText: {
    //marginTop: calcH(0.02),
    color: STYLES.SUB_HEADER_COLOR,
    fontSize: fSize(12),
    marginBottom: calcH(0.02),
    ...FONTS.OpenSans_Reg,
  },
  scrollViewConatiner: {
    // maxHeight: calcH(0.58)
    //height: calcH(0.58),
    // marginBottom: calcH(0.2)
  },
  createProductContainer: {
    //alignItems: 'flex-end',
    //marginTop: calcH(0.022),
    position: 'absolute',
    bottom: 70,
    right: 5,
    //top: 100,

    //left: 10,
  },
  card: {
    alignSelf: 'center',
    height: calcH(0.1),
    backgroundColor: '#ffffff',
    marginTop: calcH(0.01),
    borderWidth: 1,
  },
  cardSubcontainer: {
    marginHorizontal: calcW(0.02),
    marginTop: calcH(0.01),
    flexDirection: 'row',
  },
  cardLeft: {
    width: calcW(0.1),
  },
  cardMiddle: {
    width: calcW(0.53),
  },
  cardRight: {
    width: calcW(0.2),
    alignItems: 'flex-end',
    marginTop: calcH(0.025),
  },
  leftImaContainer: {
    width: calcW(0.1),
    height: calcW(0.1),
    borderRadius: calcW(0.01),
  },
  leftImg: {
    width: calcW(0.125),
    height: calcW(0.15),
  },
  cardMiddleContainer: {
    marginHorizontal: calcW(0.05),
  },
  middleTopText: {
    fontSize: fSize(16),
    color: STYLES.PRIMARY_COLOR,
  },
  middleBottomtext: {
    fontSize: fSize(12),
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '500',
    paddingTop: calcH(0.002),
  },
  lastBottomtext: {
    fontSize: fSize(10),
    color: STYLES.PRIMARY_COLOR,
    paddingTop: calcH(0.002),
  },
  noOrderText: {
    ...FONTS.Poppins_med,
    fontSize: fSize(20),
    color: STYLES.HEADER_COLOR,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerItem: {
    borderWidth: 1,
    borderColor: COLORS.header_color,
    width: '50%',
    height: calcH(0.05),
    justifyContent: 'center',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default styles;
