import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import COLORS from '../../conts/colors';
import {fSize} from '../../utils/constants/common.js';
const Button = ({
  title,
  bgColor,
  marginvertical,
  height,
  fontSize,
  containerStyle,
  color = COLORS.white,
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          height: height ? height : 55,
          width: '100%',
          backgroundColor: bgColor ? bgColor : COLORS.blue,
          marginVertical: marginvertical ? marginvertical : 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        {...containerStyle},
      ]}>
      <Text
        style={{
          color: color,
          fontSize: fontSize ? fontSize : fSize(16),
          letterSpacing: 1.5,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
