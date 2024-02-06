import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {calcH, calcW, fSize, STYLES} from '../../utils/constants/common.js';
import {FONTS} from '../../conts/theme.js';
import images from '../../conts/icons.js';

const ProductDetailsCard = ({
  image = images.product2,
  price,
  name,
  languagedata,
  order,
  date,
  stat,
  statStyle,
}) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Image source={image} style={styles.leftImg} />
        <View
          style={{
            alignItems: 'flex-start',
            paddingVertical: calcH(0.01),
            marginLeft: calcW(0.02),
            borderWidth: 0,
          }}>
          <Text style={styles.middleTopText}>
            {name?.length < 15 ? `${name}` : `${name?.substring(0, 25)}...`}
          </Text>
          <Text style={styles.lastBottomtext}>{order} </Text>
          <Text style={{...FONTS.Montserrat_med, color: STYLES.ORDER_COLOR}}>
            {date}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={[styles.stat, {...statStyle}]}>{stat}</Text>
        <Text style={styles.middleBottomtext}>{price}</Text>
      </View>
    </View>
  );
};
export default ProductDetailsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //borderWidth: 1,
    justifyContent: 'space-between',
    //marginVertical: calcH(0.015),
    marginTop: calcH(0.015),
  },
  stat: {
    ...FONTS.WorkSans_reg,
  },
  cardRight: {
    // borderWidth: 1,
    alignSelf: 'flex-start',
    marginHorizontal: calcH(0.008),
  },
  leftImg: {
    width: calcW(0.155),
    height: calcW(0.16),
    alignSelf: 'center',
    //marginHorizontal: calcH(0.017),
    //paddingHorizontal: calcH(0.017),
  },
  middleTopText: {
    fontSize: fSize(16),
    color: STYLES.HEADER_COLOR,
  },
  middleBottomtext: {
    fontSize: fSize(15),
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '500',
    //paddingTop: calcH(0.002),
  },
  lastBottomtext: {
    fontSize: fSize(11),
    color: STYLES.ORDER_COLOR,
    ...FONTS.WorkSans_reg,
    paddingTop: calcH(0.002),
  },
});
