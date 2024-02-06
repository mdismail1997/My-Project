import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    padding: 12,
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
  map: {
    width: wp(330),
    height: hp(250),
    borderRadius: 25,
    // alignItems: 'center',
  },
  milesText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.BLACK,
    textAlign: 'center',
    marginTop: hp(12),
  },
  buttonContainer: {
    // flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginHorizontal: wp(20),
    marginTop: hp(16),
  },
  buttonStyle: {
    width: '48%',
    marginHorizontal: 0,
  },
  applyButtonStyle: {
    width: '48%',

    borderColor: COLORS.YELLOW_GREEN,
    borderWidth: 1,
    backgroundColor: COLORS.WHITE,
  },
});
