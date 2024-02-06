import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import COLORS from '../../../conts/colors.js';
import {calcH, calcW, fSize, STYLES} from '../../../utils/constants/common';
import {FONTS} from '../../../conts/theme.js';

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  subContainer: {
    // flexDirection:'column',
    // alignItems:'center',
    // marginBottom:calcH(0.5)
  },
  inputContainer: {
    marginTop: calcH(0.01),
    //margin: calcH(0.01),
    paddingHorizontal: calcH(0.03),

    // marginVertical: calcW(0.5),
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: calcH(0.02),
    marginTop: calcH(0.04),
    //borderWidth: 1,
  },
  circleContainer: {
    width: calcH(0.16),
    height: calcH(0.16),
    borderRadius: calcH(0.16) / 2,
    //backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  imageContainer: {
    width: calcH(0.16),
    height: calcH(0.16),
    borderRadius: calcH(0.16) / 2,
  },
  editImage: {
    // marginTop: calcH(-0.06),
    // marginLeft: calcW(0.23),
    borderWidth: 0.5,
  },
  renderContent: {
    bottom: -calcH(0.02),
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
  headerDotContainer: {
    backgroundColor: COLORS.darkBlue,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 0.05,
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 1,
    paddingTop: 10,
    elevation: -1,
  },
  headerDot: {
    width: calcW(0.09),
    height: calcH(0.009),
    borderRadius: 4,
    backgroundColor: '#00000040',
    //marginBottom: 10,
    margin: 15,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    backgroundColor: COLORS.header_color,
    //padding: 16,
    height: calcH(0.7),
    alignItems: 'center',
    //borderWidth: 0.5,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
    //backgroundColor: '#dbdbd9',
  },
});

export default styles;
