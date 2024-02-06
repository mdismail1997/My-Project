import {View} from 'react-native';
import React from 'react';
import COLORS from '../../conts/colors.js';

const Separator = ({width = '100%', style, padding = 10}) => {
  return (
    <View
      style={{
        width,
        borderBottomColor: COLORS.separator_color,
        borderBottomWidth: 0.8,
        alignSelf: 'center',
        padding: padding,
        ...style,
      }}
    />
  );
};

export default Separator;
