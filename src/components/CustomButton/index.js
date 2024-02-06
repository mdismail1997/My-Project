/**
 * Component for custom button
 */

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import Icon from 'react-native-vector-icons/dist/FontAwesome'

const CustomButton = props => {
  // Props
  const {title, onPress, buttonStyle, titleStyle, disable, backgroundColor} =
    props;

  return (
    <TouchableOpacity
      disabled={disable}
      activeOpacity={0.8}
      style={[styles.buttonContainer, buttonStyle, backgroundColor]}
      onPress={() => onPress !== undefined && onPress()}>
        {props.icon?(
           <Icon
           name="share-square-o"
           size={25}
           color={COLORS.WHITE}
         />
        ): null}
      <Text style={[styles.titleColor, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    minHeight: hp(52),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLORS.YELLOW_GREEN,
    marginHorizontal: wp(20),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  titleColor: {
    fontSize: wp(14),
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
});
