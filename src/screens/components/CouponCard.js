import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../utils/colors';
import {calcH, calcW} from '../../utils/comon';

/* {"coupon_code": "WINTER20", "created_at": "2022-12-29 13:21:08", "details": "Flat 20 off in winter.", "discount": 20, "discount_type": "1", "expiry_date": "2023-01-31 00:00:00", "id": 1, "person": 1, "updated_at": null, "uses": 20, "vehicle_type": 2} */

export function CouponCard({couponData}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.catCard1}
      onPress={() => {
        navigation?.navigate('coupon-details', couponData);
      }}>
      <Image
        style={styles.coinIcon}
        source={require('../../../assets/images/coin.png')}
      />
      <Text style={styles.price}>
        {couponData.discount_type === '1'
          ? `$ ${couponData.discount.toFixed(2)}`
          : `${couponData.discount.toFixed(2)} %`}
      </Text>
      <Text style={styles.cashback}>discount</Text>
      <Text style={styles.date}>{couponData.expiry_date}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  catCard1: {
    width: 169,
    height: 200,
    borderRadius: calcW(0.02),
    backgroundColor: colors.white,
    marginRight: '2%',
    marginBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    //  borderWidth: 1,
  },
  coinIcon: {
    width: calcW(0.12),
    height: calcW(0.1),
  },
  price: {
    marginVertical: calcH(0.01),
    fontWeight: '400',
    fontSize: 28,
    color: '#333434',
  },
  cashback: {
    fontWeight: '400',
    fontSize: 18,
    color: '#333434',
  },
  date: {
    marginVertical: calcH(0.02),
    fontWeight: '400',
    fontSize: 14,
    color: '#626262',
  },
});
