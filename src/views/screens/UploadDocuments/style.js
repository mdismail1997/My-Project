import {StyleSheet} from 'react-native';
import COLORS from '../../../conts/colors.js';
import {FONTS} from '../../../conts/theme.js';
import {calcH, fSize} from '../../../utils/constants/common.js';

const styles = StyleSheet.create({
  renderContent: {
    bottom: -calcH(0.02),
  },
  bottomSheetText: {
    fontSize: fSize(22),
    //fontWeight: '900',
    color: COLORS.white,
    ...FONTS.Poppins_reg,
  },
  bottomSheetText2: {
    fontSize: fSize(15),
    //fontWeight: '900',
    textAlign: 'center',
    color: COLORS.white,
    ...FONTS.Poppins_reg,
  },

  headerDot: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },

  bottomSheet: {
    backgroundColor: COLORS.header_color,
    padding: 16,
    height: calcH(0.7),
    alignItems: 'center',
    //borderWidth: 0.5,
    borderRadius: 10,
  },
  subContainer: {
    marginTop: calcH(0.03),
    //margin: calcH(0.01),
    paddingHorizontal: calcH(0.03),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: calcH(0.09),
  },
  marginBottom: {
    marginBottom: calcH(0.02),
  },
  noOrderText: {
    ...FONTS.Poppins_med,
    fontSize: fSize(18),
    color: COLORS.Profile_font_color,
    textAlign: 'center',
  },
});

export default styles;
