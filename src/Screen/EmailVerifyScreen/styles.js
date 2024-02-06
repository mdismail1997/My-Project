import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  titleText: {
    fontSize: wp(36),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.BLACK,
    marginTop: hp(100),
    marginLeft: wp(38),
  },
  subTitleText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginLeft: wp(38),
    marginTop: hp(12),
  },
  otpInput: {
    height: wp(52),
    width: wp(52),
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.NICKEL,
    textAlign: 'center',
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    fontSize: wp(18),
  },
  resendText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.NICKEL,
    textAlign: 'center',
  },
  imgStyle: {
    marginTop: hp(60),
    alignSelf: 'center',
    width: wp(176),
    height: wp(176),
    resizeMode: 'contain',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: wp(38),
    marginTop: hp(40),
  },
});
