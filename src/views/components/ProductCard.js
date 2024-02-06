import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';

import FastImage from 'react-native-fast-image';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {calcH, calcW, fSize, STYLES} from '../../utils/constants/common.js';
import {FONTS} from '../../conts/theme.js';
import images from '../../conts/icons.js';
import COLORS from '../../conts/colors.js';

const ProductCard = ({
  image = images.product2,
  price,
  name,
  languagedata,
  order,
  date,
  isSimple,
}) => {
  return (
    <View style={styles.container}>
      {isSimple && (
        <View
          style={{
            position: 'absolute',
            top: calcH(0.005),
            right: calcH(0.005),
          }}>
          <Text
            style={{
              fontSize: fSize(11),
              color: 'white',
              backgroundColor: COLORS.darkBlue,
              //padding: calcH(0.003),
              borderRadius: 3,
              paddingHorizontal: calcH(0.008),
              paddingVertical: calcH(0.004),
              ...FONTS.WorkSans_med,
            }}>
            {isSimple}
          </Text>
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        <FastImage
          source={image}
          style={styles.leftImg}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{alignItems: 'flex-start', paddingVertical: 4}}>
          <Text style={styles.middleTopText}>
            {name?.length < 15 ? `${name}` : `${name?.substring(0, 25)}...`}
          </Text>
          <Text style={styles.middleBottomtext}>{price}</Text>
          <Text style={styles.lastBottomtext}>{order} </Text>
          <Text style={{...FONTS.Montserrat_med, color: STYLES.ORDER_COLOR}}>
            {date}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <EvilIcons
          name={languagedata == 'en' ? 'chevron-right' : 'chevron-left'}
          // name='chevron-right'
          color={'black'}
          size={calcH(0.04)}
        />
      </View>
    </View>
  );
};
export default memo(ProductCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'space-between',

    marginTop: calcH(0.015),
  },
  cardRight: {
    alignSelf: 'center',
    marginHorizontal: calcH(0.008),
  },
  leftImg: {
    width: calcW(0.125),
    height: calcW(0.2),
    alignSelf: 'center',
    marginHorizontal: calcH(0.017),
  },
  middleTopText: {
    fontSize: fSize(16),
    color: STYLES.HEADER_COLOR,
  },
  middleBottomtext: {
    fontSize: fSize(13),
    color: STYLES.ORDER_COLOR,
    ...FONTS.OpenSans_Bold,
  },
  lastBottomtext: {
    fontSize: fSize(10),
    color: STYLES.ORDER_COLOR,
    ...FONTS.WorkSans_reg,
    paddingTop: calcH(0.002),
  },
});
