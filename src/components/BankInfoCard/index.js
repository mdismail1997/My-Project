import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS, FONT_FAMILY } from '../../utils/Const';
import { hp, wp } from '../../utils/ResponsiveLayout';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';

import { cardDetailsAction } from '../../Redux/actions/JobAction';

const BankInfoCard = props => {
  const { card, cardDetails } = props
  // const [card, setCard] = useState(false);
  // const cardData = useSelector(state => state.Job.cardData);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // const getCardDetails = props.navigation.addListener('focus', () => {

  //     dispatch(cardDetailsAction());
  //     setCard(cardData);
  //   // });
  //   // return getCardDetails;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   console.log('**************', cardData);
  // },[cardData]);

  const expiery = (month, year) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${months[month - 1]} ${year}`
  }

  return (

    card ?
      <View style={styles.container}>
        <View style={styles.bankNameContainer}>
          <Text style={styles.bankNameText}>{cardDetails?.brand}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.accountNameText}>{cardDetails?.name}</Text>
          <Text style={styles.dateText}>{expiery(cardDetails?.exp_month, cardDetails?.exp_year)}</Text>
          <Text style={styles.accountNumberText}>*********{`${cardDetails?.last4}`}</Text>
        </View>
        {/* <FeatherIcon
          name="edit"
          color={COLORS.BLACK}
          size={wp(18)}
          style={styles.iconStyle}
        /> */}

      </View> :


      <View style={styles.container}>

        <View style={styles.infoContainer}>
          <Text style={[styles.accountNumberText, {}]} >No Card Found. Please add!! </Text>
        </View>
      </View>
  );
};

export default BankInfoCard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bankNameContainer: {
    height: wp(44),
    width: wp(44),
    borderRadius: 50,
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankNameText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.LAPSI_LAZULI,
    textTransform: 'uppercase',
  },
  infoContainer: {
    marginLeft: wp(14),
  },
  accountNameText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.BLACK,
  },
  dateText: {
    fontSize: wp(10),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginTop: hp(4),
  },
  accountNumberText: {
    fontSize: wp(20),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.BLACK,
    marginTop: hp(8),
  },
  iconStyle: {
    alignSelf: 'flex-start',
    position: 'absolute',
    right: wp(12),
    top: hp(8),
  },
});
