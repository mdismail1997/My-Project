import { StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import { DEVICE_WIDTH, hp, wp } from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  profileImgContainer: {
    height: wp(140),
    width: wp(140),
    borderRadius: 140,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(28),
  },
  profileImageStyle: { height: wp(140), width: wp(140), borderRadius: 140 },
  editIconContainer: {
    height: wp(43),
    width: wp(43),
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
    alignSelf: 'center',
    top: hp(-46),
    left: wp(56),
  },
  inputStyle: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp(16),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.BLACK,
  },
  bankContainer: {
    marginTop: hp(30),
    marginHorizontal: wp(20),
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:'blue'
  },
  bankInfoText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.DARK_CHARCOAL,
  },
  selectionContainer: {
    // padding: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 4,
    borderColor: COLORS.NICKEL,
    borderWidth: 1,
    marginTop: hp(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  categoryContainer: {
    backgroundColor: COLORS.WHITE,
    width: DEVICE_WIDTH * 0.39,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    borderColor: COLORS.NICKEL,
    borderWidth: 1,
    borderRadius: 4,
  },
  category: {
    marginTop: hp(12),

    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEVICE_WIDTH * 0.8,
    // marginBottom: hp(12),
  },
  textinputStyle: {
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
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
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },








  containerBank: {
    // flex: 1,
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.25,
    borderColor: COLORS.YELLOW_GREEN,
    // shadowColor: '#000',
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  containerBankname:{
    height: wp(44),
    width: wp(44),
    borderRadius: 50,
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerName: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.WHITE,
    textTransform: 'uppercase',
},
logoStyle: {
  alignSelf: 'flex-start',
  position: 'absolute',
  right: wp(12),
  top: hp(8),
},
infoContainer: {
  marginLeft: wp(14),
},
accountNameText: {
  fontSize: wp(14),
  fontFamily: FONT_FAMILY.LATO_BOLD,
  color: COLORS.BLACK,
},
accountText: {
  fontSize: wp(16),
  fontFamily: FONT_FAMILY.LATO_BOLD,
  color: COLORS.BLACK,
  marginTop: hp(8),
},
accountNumberText: {
  fontSize: wp(20),
  fontFamily: FONT_FAMILY.LATO_BOLD,
  color: COLORS.BLACK,
  marginTop: hp(8),
},

});
