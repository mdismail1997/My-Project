import {Dimensions} from 'react-native';
import {Toast} from 'native-base';
import colors from './colors';

const width = Dimensions.get('window').width - 20;

function commonToast({
  text,
  position = 'bottom',
  toastFor = 'error',
  duration = 2000,
}) {
  if (toastFor === 'error') {
    return Toast.show({
      description: text,
      placement: position,
      style: {
        backgroundColor: colors.primary,
        width,
      },
      duration: duration,
    });
  } else {
    return Toast.show({
      description: text,
      placement: position,
      style: {backgroundColor: '#009007', width},
      duration: duration,
    });
  }
}

export default commonToast;
