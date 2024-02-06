import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {calcH, calcW, logoHeight, logoWidth} from '../../utils/comon';

export default function ScreenScrollComponent({style, children, noScroll}) {
  if (noScroll) {
    return (
      <View style={StyleSheet.compose(screenStyles.page, style)}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView style={StyleSheet.compose(screenStyles.page, style)}>
      <View>{children}</View>
    </ScrollView>
  );
}

const screenStyles = StyleSheet.create({
  page: {
    flex: 1,
    // paddingHorizontal:calcW(0.06),
    backgroundColor: '#fffff',
  },
});
