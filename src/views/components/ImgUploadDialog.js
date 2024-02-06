import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import COLORS from '../../conts/colors.js';
import {FONTS} from '../../conts/theme.js';
import CustomButton from './CustomButton.js';
import {calcH, fSize} from '../../utils/constants/common.js';

const ImgUploadDialog = ({
  takePhotoFromLibrary,
  takePhotoFromCamera,
  onPressCancel,
}) => (
  <View style={styles.bottomSheet}>
    <View style={styles.headerDot} />
    <View>
      <Text style={styles.bottomSheetText}>Upload Photo</Text>
      <Text style={styles.bottomSheetText2}>Choose Your Photo</Text>
    </View>
    <View style={styles.renderContent}>
      <CustomButton
        text="Take Photo"
        style={{marginBottom: 10, backgroundColor: COLORS.white}}
        textStyle={{color: COLORS.Profile_font_color}}
        name="camera"
        color={COLORS.Profile_font_color}
        onPress={takePhotoFromCamera}
      />
      <CustomButton
        text="Choose From Library"
        style={{marginBottom: 10, backgroundColor: COLORS.white}}
        textStyle={{color: COLORS.Profile_font_color}}
        name="archive"
        color={COLORS.Profile_font_color}
        onPress={takePhotoFromLibrary}
      />
      <CustomButton
        text="Cancel"
        style={{marginBottom: 10, backgroundColor: COLORS.white}}
        textStyle={{color: COLORS.Profile_font_color}}
        onPress={onPressCancel}
        name="close-o"
        color={COLORS.Profile_font_color}
      />
    </View>
  </View>
);

export default ImgUploadDialog;

const styles = StyleSheet.create({
  renderContent: {
    bottom: -30,
    paddingTop: 10,
  },
  bottomSheetText: {
    fontSize: fSize(26),
    //fontWeight: '900',
    color: COLORS.white,
    ...FONTS.Poppins_reg,
  },
  bottomSheetText2: {
    fontSize: fSize(15),
    //fontWeight: '900',
    textAlign: 'center',
    color: COLORS.white,
    ...FONTS.Poppins_reg,
  },

  headerDot: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },

  bottomSheet: {
    backgroundColor: COLORS.header_color,
    padding: 16,
    height: calcH(0.48),
    alignItems: 'center',
    //borderWidth: 0.5,
    borderRadius: 10,
  },
});
