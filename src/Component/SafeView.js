import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import {colorSet} from '../utils/Color';

const SafeView = ({children, style}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={[styles.container, style]}>
        <View style={[styles.view, style]}>{children}</View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colorSet.backgroundColor,
  },
  view: {
    flex: 1,
  },
});
