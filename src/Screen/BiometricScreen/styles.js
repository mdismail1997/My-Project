import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  logoImg: {
    height: hp(60),
    width: wp(164),
    resizeMode: 'contain',
    marginTop: hp(94),
    alignSelf: 'center',
  },
  bioContainer: {
    height: wp(218),
    width: wp(218),
    marginTop: hp(124),

    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioImg: {
    height: wp(218),
    width: wp(218),
    resizeMode: 'contain',
  },

  scanLine: {
    width: 218,
    height: 8,
    borderRadius: 50,
    backgroundColor: COLORS.YELLOW_GREEN,
    zIndex: 1,
    alignSelf: 'center',
    // position: 'absolute',
  },
  enableText: {
    fontSize: wp(18),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.DARK_CHARCOAL,
    marginTop: hp(54),
    textAlign: 'center',
  },
});
