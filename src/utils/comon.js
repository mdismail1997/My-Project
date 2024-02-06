import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const calcH = heightInPixel => {
  return screenHeight * heightInPixel;
};
export const calcW = widthInPixel => {
  return screenWidth * widthInPixel;
};

export const buttonHeight = calcH(0.07);

export const textInputHeight = calcH(0.06);

export const allRadius = calcH(0.1);

export const allPadding = 15;

export const logoHeight = calcW(0.2);

export const logoWidth = calcW(0.38);

export const cardHeight = calcH(0.23);

export const cardButtonHeight = calcW(0.095);

export const google_api_key = 'AIzaSyClrOTZ9SMxVHzZxuTk7dLXcdFwKeJccxU';
// export const STORAGE_KEY={
//   CUSTOMER_TOKEN:'customerToken',

// }
