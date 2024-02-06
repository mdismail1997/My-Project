import { StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import { DEVICE_WIDTH, hp, wp } from '../../utils/ResponsiveLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
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
  EmodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%'

  },
  profileImgContainer: {
    height: wp(140),
    width: wp(140),
    borderRadius: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(28),
    backgroundColor: '#000',
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
    marginTop: hp(15),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.BLACK,

  },
  einputStyle: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp(15),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.BLACK,
  },
  locationText: {
    fontSize: wp(16),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.DARK_CHARCOAL,
  },
  category: {
    marginTop: hp(20),

    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEVICE_WIDTH * 0.9,
    // marginBottom: hp(12),
  },
  categoryContainer: {
    backgroundColor: COLORS.WHITE,
    width: DEVICE_WIDTH * 0.9,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    borderColor: COLORS.NICKEL,
    borderWidth: 1,
    borderRadius: 4,
    // marginTop: hp(20),
  },
  imageStyle: {
    width: wp(300),
    height: hp(300),
  },
  multipleImage: {
    borderColor: COLORS.NICKEL,
    marginBottom: hp(30),
    borderWidth: 1,
  },
  chip: {
    marginBottom: hp(12),
    marginEnd: wp(12),
  },
  mImgcontainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    flexDirection: 'column-reverse',
  },
  itemContainer: {
    marginHorizontal: wp(20),
    borderRadius: 12,
    padding: hp(14),
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: wp(18),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.YELLOW_GREEN,
    // fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },












  menviewcss: {
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: wp(8),
    padding: 2,
    flex: 1,
  },
  viewcss: {
    flexDirection: 'row',
    paddingVertical: hp(8),
    justifyContent: 'space-between',
  },
  textviewcss: {
    width: '65%',
    justifyContent: 'center',
    height:wp(50),
  },
  textcomoncss2: {
  
    fontSize: wp(14),
    color: COLORS.NICKEL,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  textcomoncss3: {
    fontSize: wp(14),
    color: COLORS.NICKEL,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
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
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
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


});