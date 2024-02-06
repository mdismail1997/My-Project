import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  userInfoContainer: {
    marginHorizontal: wp(20),
    flexDirection: 'row',
    paddingVertical: hp(10),
  },
  userProfileImage: {
    height: hp(82),
    width: wp(82),
    resizeMode: 'contain',
    borderRadius: 8,
  },
  usernameText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.LAPSI_LAZULI,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop:15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  addressText: {
    fontSize: wp(10),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginTop: hp(10),
    // width: '40%',
  },
  priceContainer: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.YELLOW_GREEN,
  },
  viewText: {
    marginTop:wp(5),
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.DARK_CHARCOAL,
  },
  priceText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.WHITE,
  },
  jobTitleText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.DARK_CHARCOAL,
    marginTop: hp(26),
    marginHorizontal: wp(20),
  },
  timeDateText: {
    fontSize: wp(10),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginTop: hp(8),
    marginHorizontal: wp(20),
    fontWeight: '700',
  },
  descText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginHorizontal: wp(20),
    marginTop: hp(8),
  },
  milesText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.BLACK,
    textAlign: 'center',
    marginTop: hp(12),
  },
  buttonContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(20),
    marginTop: hp(16),
  },
  buttonStyle: {
    width: '48%',
    marginHorizontal: 0,
  },
  applyButtonStyle: {
    marginTop: hp(16),
    borderColor: COLORS.YELLOW_GREEN,
    borderWidth: 1,
    backgroundColor: COLORS.WHITE,
  },
});
