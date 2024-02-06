import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import { calcW } from '../utils/comon';

const CustomButton = ({
  onPress,
  text,
  color,
  size = 24,
  iconName,
  textStyle,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.listRow, {...containerStyle}]}
      onPress={onPress}>
      <Text style={[styles.textleft, {...textStyle}]}>{text}</Text>
      <IconAntDesign
        styles={styles.arrowTurn}
        color={color}
        size={size}
        name={iconName}
      />
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  textleft: {
    alignItems: 'flex-start',
    color: '#121212',
    fontSize: calcW(0.045),

  },
});
