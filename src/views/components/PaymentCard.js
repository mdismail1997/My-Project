import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';
import icons from '../../conts/icons.js';
import {calcH, fSize} from '../../utils/constants/common.js';
import {FONTS} from '../../conts/theme.js';
import COLORS from '../../conts/colors.js';
import strings from './lng/LocalizedStrings.js';

const PaymentCard = ({
  totalAmount = 0,
  width = '100%',
  source,
  firstText,
  textStle,
  imageStyle,
  text,
}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
      }}>
      <FastImage source={source} style={[styles.image, {...imageStyle}]} />
      <View style={[styles.textContainer, {...textStle}]}>
        <Text style={[styles.text1]}>{`aed${totalAmount}`} </Text>
        <Text style={[styles.text, {...text}]}>{firstText} </Text>
        <Text style={[styles.text, {lineHeight: 12, fontSize: fSize(12)}]}>
          {strings.OVERALL}
        </Text>
      </View>
    </View>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  text: {
    ...FONTS.Montserrat_med,
    color: COLORS.Profile_font_color,
    fontSize: fSize(17),
  },
  text1: {
    color: COLORS.Profile_font_color,
    fontSize: fSize(19),
  },
  textContainer: {
    marginVertical: calcH(0.028),
    marginLeft: calcH(0.02),
    //borderWidth: 1,
    top: -5,
  },
  image: {
    height: calcH(0.06),
    width: calcH(0.06),
    margin: calcH(0.028),
  },
});
