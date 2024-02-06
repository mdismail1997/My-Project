import {Platform, StyleSheet} from 'react-native';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';
import {FONTS} from '../../../conts/theme.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STYLES.THIRD_COLOR,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerContainer: {
    flex: 1,
  },
  headerImgStyle: {
    width: calcW(0.6),
    height: calcW(0.565),
  },
  imgStyle: {
    width: calcW(0.4),
    height: calcW(0.48),
  },
  bodyContainer: {
    marginTop: calcW(0.3),
  },
  textHeader: {
    color: STYLES.HEADER_COLOR,
    fontSize: 30,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
  description_text: {
    color: STYLES.HEADER_COLOR,
    fontSize: 18,
  },
  subText: {
    color: STYLES.HEADER_COLOR,
    fontSize: 18,
    marginTop: calcW(0.015),
    fontWeight: 'normal',
    // ...FONTS.WorkSans_reg,
  },
  descriptionContainer: {
    marginTop: calcW(0.025),
    alignItems: 'center',
    //borderWidth: 1,
    marginHorizontal: calcW(0.055),
    height: calcH(0.15),
    //flexShrink: 1,
  },
  bottomContainer: {
    //marginTop: calcW(0.1),
    marginHorizontal: calcW(0.025),
    paddingHorizontal: calcW(0.06),
    //borderWidth: 1,
  },
  bottomContainer1: {
    marginTop: calcW(0.05),
    marginHorizontal: 16,
    paddingHorizontal: 20,
  },
});

export default styles;
