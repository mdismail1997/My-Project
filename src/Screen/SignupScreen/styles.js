import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  welcomeText: {
    fontSize: wp(36),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    marginTop: hp(28),
    marginLeft: wp(36),
    color: COLORS.BLACK,
  },
  subHeading: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginHorizontal: wp(36),
    marginTop: hp(12),
  },
  forgotText: {
    fontSize: wp(14),
    color: COLORS.YELLOW_GREEN,
    textAlign: 'right',
    marginRight: wp(38),
    marginTop: hp(26),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(38),
    marginVertical: hp(20),
  },
  verticleLine: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.YELLOW_GREEN,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    // width: '100%',
    justifyContent: 'space-between',
    marginHorizontal: wp(38),
  },
  socialButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    height: hp(52),
    flex: 0.48,
    paddingVertical: hp(16),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  socialButtonText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_BOLD,
  },
  socialIcon: {
    height: wp(16),
    width: wp(16),
    resizeMode: 'contain',
    marginRight: wp(14),
  },
  orText: {
    fontSize: wp(14),
    margin: wp(10),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  singupContainer: {
    marginTop: hp(70),
    marginBottom: hp(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  singupText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
  },
  termsContainer: {
    marginHorizontal: wp(38),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(22),
  },
  termsText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
  },
});
