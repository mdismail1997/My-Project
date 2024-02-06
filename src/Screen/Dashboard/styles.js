import {StyleSheet} from 'react-native';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.WHITE,
  },
  cardContainer: {
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'space-between',
    marginBottom: hp(18),
  },
  mainContainer: {
    flex: 1,
    // padding: 10,
  },
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
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(58),
  },
  listContainer: {
    // flex: 0.95,
    width: wp(158),

    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    // marginHorizontal: wp(15),

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5,
  },
  topIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
  locationTitle: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
  },
  quoteContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    marginBottom: hp(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  quote: {
    fontSize: 12,
    marginTop: 6,
    color: '#737373',
  },
  quoteAuthor: {
    fontSize: 12,
    lineHeight: 16,
    color: '#333333',
  },
  buttonJob: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.YELLOW_GREEN,
  },
  addressText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
  },
  chip: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.YELLOW_GREEN,
    borderWidth: 2,
  },

  filterContainer: {
    paddingHorizontal: wp(20),
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterIcon: {
    // height: wp(24),
    width: wp(24),
    resizeMode: 'contain',
  },
  categoryContainer: {
    height: hp(80),
    width: wp(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryIcon: {
    height: wp(30),
    width: wp(30),
    resizeMode: 'contain',
  },
  categoryTitle: {
    marginTop: hp(6),
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    textAlign: 'center',
    // width: '90%',
    flexWrap: 'wrap',
  },

  jobItemContainer: {
    marginBottom: hp(24),
    paddingBottom: hp(10),
    width: '95%',
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
    marginLeft: 12,
  },
  jobImg: {
    width: wp(60),
    height: hp(60),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#000',
  },
  priceContainer: {
    height: wp(78),
    width: wp(78),
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    top: hp(-60),
    right: wp(11),
  },
  priceText: {
    fontSize: wp(22),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.WHITE,
  },
  dateText: {
    fontSize: wp(10),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.BLACK,
    marginTop: hp(10),
    marginLeft: wp(10),
  },
  titleText: {
    fontSize: wp(16),
    marginHorizontal: wp(10),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.DARK_CHARCOAL,
    marginTop: hp(2),
  },
  descText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginHorizontal: wp(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: wp(11),
    // marginTop: hp(22),
    padding: 15,
  },
  buttonStyle: {
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.YELLOW_GREEN,
  },
  buttonText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.YELLOW_GREEN,
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: wp(10),
    width: '100%',
  },
  userText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.DARK_CHARCOAL,
    marginLeft: wp(8),
  },
  viewText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.DARK_CHARCOAL,
  },
  centeredView: {
    flex: 0.92,
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    width: '100%',
  },
  textInputViewCss: {
    borderWidth: 1,
    borderColor: COLORS.DARKGREYY,
    borderRadius: 10,
  },
  textcomCSS: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
    marginTop: hp(4),
  },
  pickertextclass: {
    fontSize: wp(14),
    color: COLORS.NICKEL,
  },

  meninputviewCSS: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputtextCSS: {
    height: hp(50),
    width: '100%',
    fontSize: wp(14),
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.NICKEL,
    borderRadius: 12,
    paddingHorizontal: wp(12),
  },
  distancecss: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
    marginTop: hp(16),
  },
  expertiseContainer: {
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    maxHeight: hp(280),
  },
  expertiseImg: {
    height: hp(160),
    width: wp(160),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'contain',
  },
  expertiseName: {
    fontFamily: FONT_FAMILY.LATO_BOLD,
    fontSize: wp(14),
    color: COLORS.BLACK,
    textAlign: 'left',
    marginLeft: 8,
    marginTop: hp(12),
  },
  expertiseType: {
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    fontSize: wp(12),
    color: COLORS.BLACK,
    textAlign: 'left',
    marginLeft: 8,
    marginTop: hp(6),
    width: wp(150),
  },
  expertisePriceContainer: {
    backgroundColor: COLORS.YELLOW_GREEN,
    borderRadius: 6,
    padding: 6,
    position: 'absolute',
    bottom: -10,
    right: 10,
    zIndex: 1,
  },
  expertisePriceText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    fontSize: wp(10),
  },
});
