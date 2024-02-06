import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {calcH, calcW, STYLES} from '../../utils/constants/common';

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
  },
  lineStyle: {
    marginTop: calcH(0.005),
    width: calcW(1),
    borderWidth: calcW(0.002),
    borderColor: STYLES.FOUR_COLO,
  },
  headerText: {
    marginTop: calcH(0.035),
  },
  headersecondText: {
    marginTop: calcH(0.08),
  },
  subheader: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'quicksand_semibold',
    color: '#000',
  },
  subsecondheader: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'quicksand_medium',
  },
  infoContainer: {
    marginTop: calcH(0.025),
    height: calcH(0.07),
    //  backgroundColor: STYLES.FOUR_COLO
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    left: calcW(0.04),
    width: '15%',
    //   backgroundColor: STYLES.PRIMARY_COLOR,
  },
  iconSize: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  iconInterestSize: {
    width: calcW(0.048),
    height: calcW(0.048),
  },
  iconMoneySize: {
    width: calcW(0.045),
    height: calcW(0.06),
  },
  titleleft: {
    color: '#979797',
    width: '25%',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'quicksand_bold',
    // backgroundColor: STYLES.SECONDARY_COLOR,
  },
  semiColon: {
    width: '5%',
  },
  titleright: {
    left: calcW(0.01),
    color: '#E2E2E2',
    width: '50%',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'quicksand_bold',
  },
  dividerStyle: {
    width: '95%',
    borderWidth: calcW(0.002),
    borderColor: STYLES.FOUR_COLO,
  },
  radioContainer: {
    // height: calcH(0.09),
    // backgroundColor: STYLES.PRIMARY_COLOR
  },
  categoryRow1: {
    height: calcH(0.15),
    // backgroundColor: STYLES.PRIMARY_COLOR,
    marginTop: calcH(0.025),
    flexDirection: 'row',
  },
  catCard2: {
    width: '48%',
    height: calcH(0.1),
    borderRadius: 15,
    marginRight: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: STYLES.FOUR_COLO,
    flexDirection: 'row',
  },
  cardText: {},
  desContainer: {
    borderRadius: 5,
    paddingBottom: 0,
    backgroundColor: STYLES.FOUR_COLO,
    // borderWidth:1,
    marginBottom: 8,
    height: calcH(0.18),
    width: '100%',
    flexDirection: 'row',
  },
  description: {
    marginBottom: calcH(0.08),
    left: calcW(0.06),
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: calcH(0.025),
    marginBottom: calcH(0.1),
  },
  btnSubContainer: {
    width: calcW(0.52),
    height: calcH(0.06),
    borderRadius: calcH(0.03),
    backgroundColor: STYLES.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    color: STYLES.THIRD_COLOR,
    fontWeight: '500',
    fontFamily: 'quicksand_medium',
  },
});

export default styles;
