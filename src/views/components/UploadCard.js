import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';
import {calcH} from '../../utils/constants/common.js';
import COLORS from '../../conts/colors.js';
import icons from '../../conts/icons.js';

const UploadCard = ({text, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.sub}>
          <View style={styles.box} />
          <Text style={styles.text}>{text} </Text>
        </View>
        <FastImage
          source={icons.upload}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UploadCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.2,
    height: calcH(0.075),
    width: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.card_bg,
    marginVertical: calcH(0.01),
  },
  sub: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginHorizontal: calcH(0.015),
  },
  box: {
    height: calcH(0.02),
    width: calcH(0.02),
    borderRadius: 1,
    backgroundColor: COLORS.box_color,
    alignSelf: 'center',
    //alignItems: 'center',
    marginRight: calcH(0.015),
  },
  text: {
    color: COLORS.Profile_font_color,
    textAlign: 'center',
  },
  image: {
    height: calcH(0.038),
    width: calcH(0.053),
    marginHorizontal: calcH(0.015),
    //paddingLeft: 50,
  },
});
