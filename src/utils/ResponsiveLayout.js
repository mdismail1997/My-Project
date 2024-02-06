/**
 *
 * Util file which returns given dimension as display pixel
 */

import {Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';

// Width
export const wp = dimension => {
  return wp2dp((dimension / 375) * 100 + '%');
};
// Height
export const hp = dimension => {
  return hp2dp((dimension / 812) * 100 + '%');
};

// Device height and width
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
