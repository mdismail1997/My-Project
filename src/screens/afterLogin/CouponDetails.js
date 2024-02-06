import React from 'react';
import {IconButton, Toast} from 'native-base';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-community/clipboard';

/* {"coupon_code": "WINTER20", "created_at": "2022-12-29 13:21:08", "details": "Flat 20 off in winter.", "discount": 20, "discount_type": "1", "expiry_date": "2023-01-31 00:00:00", "id": 1, "person": 1, "updated_at": null, "uses": 20, "vehicle_type": 2} */
export function CouponDetails({route}) {
  const copyToClipboard = code => {
    Clipboard.setString(code);
    Toast.show({
      title: 'Copied',
      // placement: '',
    });
  };

  console.log(route.params);
  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <LinearGradient colors={['#3165CC', '#66CEE9']}>
        <View
          style={{height: 170, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.heading, styles.whiteFont]}>Discount</Text>
          <Text style={[styles.vSpacing, styles.subHeading, styles.whiteFont]}>
            {route.params.discount_type === '1'
              ? `$ ${route.params.discount.toFixed(2)}`
              : `${route.params.discount.toFixed(2)} %`}
          </Text>
          <Text style={[styles.smallFont, styles.whiteFont]}>
            Expire on: {route.params.expiry_date}
          </Text>
        </View>
      </LinearGradient>
      <View style={[styles.vSpacing, {marginHorizontal: 5, minHeight: 100}]}>
        <Text style={[styles.subHeading, styles.vSpacing]}>Coupon code</Text>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 3,
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text selectable={true} selectionColor="orange">
            {route.params.coupon_code}
          </Text>
          <IconButton
            size="md"
            variant="ghost"
            onPress={() => copyToClipboard(route.params.coupon_code)}
            _icon={{
              as: FeatherIcon,
              name: 'copy',
            }}
          />
        </View>
      </View>
      <View style={{marginHorizontal: 5, minHeight: 150}}>
        <Text style={[styles.subHeading, styles.vSpacing]}>
          Coupon description
        </Text>
        <Text>{route.params.details}</Text>
      </View>
      <View style={{marginHorizontal: 5, minHeight: 150}}>
        <Text style={[styles.subHeading, styles.vSpacing]}>Conditions</Text>
        {[
          `Every user can use this coupon ${route.params.person} time/user.`,
          `Only first ${route.params.uses} user can use this coupon.`,
        ].map((el, i) => (
          <Text key={i}>🟡 {el}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vSpacing: {
    marginBottom: 5,
  },
  fontBold: {
    fontWeight: '500',
  },
  whiteFont: {
    color: '#ffff',
  },
  heading: {
    fontSize: 22,
  },
  subHeading: {
    fontSize: 18,
  },
  smallFont: {
    fontSize: 14,
  },
});
