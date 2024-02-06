import React, {Component} from 'react';
import {View, Text, StyleSheet, PixelRatio, Dimensions} from 'react-native';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: calcW(0.35),
    //paddingBottom: calcW(0.1),
    backgroundColor: STYLES.THIRD_COLOR,
    //borderWidth:1
  },
  afterContainer: {
    flex: 1,
    paddingTop: calcW(0.35),
    //paddingBottom: calcW(0.2),
    backgroundColor: STYLES.EIGHT_COLOR,
    //borderWidth: 1,
    //position: 'absolute',
   
  },
  textHeader: {
    color: STYLES.PRIMARY_COLOR,
    fontSize: 25,
    textAlign: 'center',
  },
  subHeader: {
    marginTop: calcW(0.02),
    fontSize: 15,
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '400',
    textAlign: 'center',
  },
  forgotPasswordHeader: {
    marginTop: calcW(0.0005),
    alignItems: 'center',
    fontSize: 15,
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '400',
  },
  orHeaderContainer: {
    marginTop: calcW(0.09),
    flexDirection: 'row',
    height: calcH(0.07),
    alignItems: 'center',
  },
  orHeader: {
    fontSize: 15,
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '400',
  },
  googleContainer: {
    flexDirection: "row",
		alignItems: "center",
		borderWidth: 0.5,
		alignSelf: "center",
		//padding: 5,
		paddingHorizontal: 20,
		borderColor: STYLES.SIVEN_COLOR,
		height: calcH(0.05),
  },
  leftImg: {
    width: calcW(0.06),
    height: calcH(0.035),
    //marginLeft: calcH(0.18),
  },
  googleText: {
    marginLeft: calcH(0.01),
    color: STYLES.PRIMARY_COLOR,
  },
  signupHeader: {
    marginTop: calcW(0.09),
    fontSize: 15,
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '400',
  },
  signupHeader2: {
    marginTop: calcW(0.09),
    fontSize: 15,
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '500',
  },
  inputStyle: {
    width: calcW(0.9),
    height: calcH(0.09),
    marginLeft: calcW(0.02),
    color: STYLES.THIRD_COLOR,
    borderWidth: 2,
  },
  inputContainer: {
    flex: 1,
    marginTop: calcH(0.01),
    alignItems: 'center',
  },
  bottomContainer1: {
    marginTop: calcH(0.04),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContainer: {
    width: calcW(0.8),
    height: calcH(0.06),
    backgroundColor: STYLES.SIVEN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation:3
  },
  // btnTxt: {
  //   fontSize: 18,
  //   color: STYLES.THIRD_COLOR,
  //   textTransform: 'uppercase',
  //   fontWeight: '500',
  //   fontFamily: 'sans-serif-light',
  // },
  signUpTxtContainer: {
    flexDirection: 'row-reverse',
    marginTop: calcH(0.05),
    color: STYLES.PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 16,
  },
  input_container: {
    marginTop: calcH(0.02),
  },

  container2: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'column',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: calcW(0.4),
    height: calcW(0.4),
    // resizeMode:'contain'
  },
  orCantiner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.01),
  },
  orTxt: {
    fontSize: 19,
    color: STYLES.THIRD_COLOR,
    fontWeight: '500',
    // fontFamily:'Roboto'
  },
  bottomContainer: {
    marginTop: calcH(0.06),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomTxt: {
    fontSize: 14,
    color: STYLES.THIRD_COLOR,
    fontWeight: '300',
    //  fontFamily:'Roboto'
  },
  bottomTxt2: {
    fontSize: 14,
    color: STYLES.SECONDARY_COLOR,
    fontWeight: '300',
    //  fontFamily:'Roboto',
    paddingLeft: calcW(0.02),
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: calcH(0.02),
    marginTop: calcH(0.25),
  },
  topText: {
    fontSize: 30,
    fontWeight: '500',
    //  fontFamily:'Roboto',
    color: STYLES.THIRD_COLOR,
  },

  btnContainer1: {
    marginTop: calcH(0.04),
  },
  inputContainer3: {
    marginTop: calcH(0.025),
    marginHorizontal: calcH(0.02),
  },

  forgotContainer: {
    flexDirection: 'row-reverse',
    //    marginTop:calcH(0.00)
  },
  forgotTxt: {
    fontSize: 16,
    fontWeight: '500',
    //  fontFamily:'Roboto',
    color: STYLES.THIRD_COLOR,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
  },
  modalView: {
    width: calcW(0.9),
    height: calcH(0.4),
    backgroundColor: STYLES.THIRD_COLOR,
    borderRadius: calcH(0.01),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  crossContainer: {
    flexDirection: 'row-reverse',
    marginTop: calcH(0.01),
    marginLeft: calcW(0.03),
  },
  crossIcon: {
    width: calcH(0.03),
    height: calcH(0.03),
  },
  inputContainer2: {
    width: calcW(0.8),
    height: calcH(0.07),
    borderWidth: 1,
    borderColor: STYLES.THIRD_COLOR,
    marginTop: calcH(0.01),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1,
    //borderColor: '#413839',
    color: STYLES.THIRD_COLOR,
  },
  inputStyle: {
    width: calcW(0.7),
    height: calcH(0.06),
    marginLeft: calcW(0.02),
    color: STYLES.PRIMARY_COLOR,
  },

  inputSubContainer: {
    width: calcW(0.85),
    height: calcH(0.07),
    borderRadius: calcH(0.01),
    borderWidth: 1,
    borderColor: STYLES.THIRD_COLOR,
    marginTop: calcH(0.01),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topModalTxt: {
    marginTop: calcH(0.02),
    alignItems: 'center',
  },
  topTxt: {
    fontSize: 18,
    fontWeight: '400',
    color: STYLES.PRIMARY_COLOR,
  },
  btnContainer2: {
    // width:calcW(0.8),
    height: calcH(0.07),
    backgroundColor: STYLES.SIVEN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  btnTxt: {
    fontSize: 15,
    color: STYLES.THIRD_COLOR,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  socialIconContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginVertical: calcH(0.02),
		//borderWidth: 1,
	},
});

export default styles;
