import {StyleSheet, Text, View} from 'react-native';
import {hp, wp} from '../../utils/ResponsiveLayout';

import {COLORS, FONT_FAMILY} from '../../utils/Const';

export const styles = StyleSheet.create({
  profileImgContainer: {
    height: wp(140),
    width: wp(140),
    borderRadius: 140,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: hp(28),
    marginBottom: hp(15),
  },
  profileImageStyle: {height: wp(140), width: wp(140), borderRadius: 140},
  viewText: {
    marginTop:wp(5),
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.DARK_CHARCOAL,
  },
  jobItemContainer: {
    marginBottom: hp(24),
    paddingBottom: hp(10),
    width: '100%',
    flex: 1,

    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
