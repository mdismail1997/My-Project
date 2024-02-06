import {Image} from 'react-native';
import React from 'react';
import COLORS from '../../conts/colors.js';

import FastImage from 'react-native-fast-image';

const AppImage = ({size, source, borderColor, style, resizeMode = 'cover'}) => {
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    //borderWidth: 1,
    //borderColor,
    backgroundColor: '#fff',
  };

  return (
    <FastImage
      source={source}
      style={[imageStyle, {...style}]}
      resizeMode={resizeMode}
    />
  );
};

export default AppImage;
