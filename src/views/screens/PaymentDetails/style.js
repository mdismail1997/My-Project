import {StyleSheet} from 'react-native';
import COLORS from '../../../conts/colors.js';
import {FONTS} from '../../../conts/theme.js';
import {calcH, calcW, fSize} from '../../../utils/constants/common.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginHorizontal: calcW(0.04),
    //height: '100%',
  },
  subContainer: {
    //position: 'relative',
    //borderWidth: 1,
    marginHorizontal: calcW(0.04),
    marginVertical: calcH(0.01),
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  cardContainer: {
    flexDirection: 'row',
    marginVertical: calcH(0.01),
    justifyContent: 'space-between',
  },
  marginLeft: {marginLeft: calcH(0.002)},
  textFont: {fontSize: fSize(12)},
  mainImage: {
    margin: calcH(0.01),
    height: calcH(0.05),
    width: calcH(0.05),
  },
  secondaryImage: {
    margin: calcH(0.01),
    height: calcH(0.042),
    width: calcH(0.042),
  },
  text: {
    ...FONTS.Montserrat_med,
    color: COLORS.Profile_font_color,
    fontSize: fSize(17),
  },
});

export default styles;
