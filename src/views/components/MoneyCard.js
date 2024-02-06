import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FONTS} from '../../conts/theme.js';
import COLORS from '../../conts/colors.js';
import {fSize} from '../../utils/constants/common.js';

const MoneyCard = ({orderNumber, date, cost}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            color: COLORS.textclr,
            fontSize: fSize(12),
          }}>
          {orderNumber}
        </Text>
        <Text style={{...FONTS.Montserrat_med, fontSize: fSize(12)}}>
          {date}
        </Text>
      </View>
      <Text style={styles.cost}>{`aed${cost}`} </Text>
    </View>
  );
};

export default MoneyCard;

const styles = StyleSheet.create({
  cost: {
    ...FONTS.Montserrat_med,
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: fSize(15),
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
});
