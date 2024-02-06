import React, {Component} from 'react';
import {Toast} from 'native-base';
import colors from '../asserts/colors.js/colors';

function commonToast({
  text,
  position = 'bottom',
  toastFor = 'error',
  duration = 2000,
} = {}) {
  if (toastFor === 'error') {
    return Toast.show({
      text: text,
      position: position,
      textStyle: {color: '#913831', fontWeight: '500', textAlign: 'center'},
      style: {backgroundColor: colors.primary},
      duration: duration,
    });
  } else {
    return Toast.show({
      text: text,
      position: position,
      textStyle: {color: '#00FF00', fontWeight: '500'},
      style: {backgroundColor: 'green'},
      duration: duration,
    });
  }
}

export default commonToast;
