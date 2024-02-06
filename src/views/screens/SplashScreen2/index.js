import {ImageBackground, PixelRatio, StyleSheet, View} from 'react-native';
import React from 'react';

const Splash2 = () => {
  const dpi = 160 * PixelRatio.get();

  let imageSource;
  if (dpi >= 160 < 240) {
    imageSource = require('../../../../android/app/src/main/res/drawable-mdpi/launch_screen.png');
  }
  if (dpi >= 240 < 320) {
    imageSource = require('../../../../android/app/src/main/res/drawable-hdpi/launch_screen.png');
  }
  if (dpi >= 320 < 480) {
    imageSource = require('../../../../android/app/src/main/res/drawable-xhdpi/launch_screen.png');
  }
  if (dpi >= 480 < 640) {
    imageSource = require('../../../../android/app/src/main/res/drawable-xxhdpi/launch_screen.png');
  }
  if (dpi >= 640 < 1000) {
    imageSource = require('../../../../android/app/src/main/res/drawable-xxxhdpi/launch_screen.png');
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{height: '100%', width: '100%'}}
        source={imageSource}
      />
    </View>
  );
};

export default Splash2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A5A5F',
  },
});
