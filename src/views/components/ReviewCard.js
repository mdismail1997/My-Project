import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {calcH, fSize, STYLES} from '../../utils/constants/common.js';
import AppImage from './AppImage.js';
import icons from '../../conts/icons.js';
import {FONTS} from '../../conts/theme.js';
import {AirbnbRating} from '@rneui/base';

const ReviewCard = ({
  count,
  defaultRating,
  size,
  userName,
  productName,
  review,
  date,
  source,
}) => {
  return (
    <>
      <View style={styles.container}>
        <AppImage source={source} size={calcH(0.05)} />
        <Text style={styles.lastBottomtext}>{userName}</Text>
      </View>
      <View
        style={{
          alignSelf: 'baseline',
          //borderWidth: 1,
          alignItems: 'flex-start',
          marginBottom: 8,
        }}>
        <AirbnbRating
          isDisabled={true}
          count={count}
          reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
          defaultRating={defaultRating}
          size={size}
          showRating={false}
        />
        <Text style={styles.product}>{productName} </Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.date}>{review} </Text>
      </View>
    </>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //borderWidth: 1,
    //justifyContent: 'space-between',
    //marginVertical: calcH(0.015),
    marginTop: calcH(0.015),
  },
  lastBottomtext: {
    fontSize: fSize(18),
    color: STYLES.ORDER_COLOR,
    ...FONTS.OpenSans_Reg,
    paddingTop: calcH(0.002),

    marginLeft: calcH(0.02),
  },
  product: {
    fontSize: fSize(18),
    color: STYLES.ORDER_COLOR,
  },
  date: {
    fontSize: fSize(12),
    color: STYLES.ORDER_COLOR,
  },
});
