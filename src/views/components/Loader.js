import React from 'react';
import {
  useWindowDimensions,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  I18nManager,
} from 'react-native';
import COLORS from '../../conts/colors';
import strings from '../components/lng/LocalizedStrings';
import styles from './CommonButton/style.js';

const Loader = ({visible = false}) => {
  const {width, height} = useWindowDimensions();

  return (
    visible && (
      <View style={[style.container, {height, width}]}>
        <View style={style.loader}>
          <ActivityIndicator size="large" color={COLORS.blue} />
          <Text style={style.text}>{strings.LOADING}</Text>
        </View>
      </View>
    )
  );
};

const style = StyleSheet.create({
  loader: {
    height: 70,
    backgroundColor: COLORS.white,
    marginHorizontal: 50,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  text: {marginLeft: 10, fontSize: 16, color: COLORS.Profile_font_color},
});

export default Loader;
