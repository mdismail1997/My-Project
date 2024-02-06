import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export function getWidth(size) {
  return (size / 375) * screenSize.width;
}
export function getHeight(size) {
  return (size / 812) * screenSize.height;
}

// Global size

export const screenSize = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const calcH = heightInPixel => {
  return screenHeight * heightInPixel;
};

export const calcW = widthInPixel => {
  return screenWidth * widthInPixel;
};

export const STYLES = {
  PRIMARY_COLOR: '#c92e29', //red
  SECONDARY_COLOR: '#FF141D', // red
  THIRD_COLOR: '#FFFFFF', // white
  FOUR_COLO: '#F2F2F2', // gray
};

// export const getAndroidDevice=()=> {
//     DeviceInfo.getAndroidId().then((androidId) => {
//         return androidId;
//       });
// }
