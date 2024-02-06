import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import COLORS from '../../conts/colors.js';
import {calcH, calcW, fSize} from '../../utils/constants/common.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {I18nManager} from 'react-native';

const NewPickerComponent = ({
  items,
  onValueChange,
  value,
  disabled,
  placeholder = {},
}) => {
  return (
    <RNPickerSelect
      onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
      placeholder={placeholder}
      style={{
        ...pickerSelectStyles,
        viewContainer: {
          alignContent: 'center',
          justifyContent: 'center',
          //borderWidth: 1,
          alignSelf: 'center',
        },
        iconContainer: {
          top: calcH(0.018),
          right: calcH(0.01),
          //borderWidth: 1,
          alignSelf: 'center',
        },
      }}
      //   style={
      //     Platform.OS === 'ios'
      //       ? pickerSelectStyles.inputIOS
      //       : pickerSelectStyles.inputAndroid
      //   }
      InputAccessoryView={() => null}
      items={items}
      value={value}
      disabled={disabled}
      fixAndroidTouchableBug={true}
      useNativeAndroidPickerStyle={false}
      //useNativeAndroidPickerStyle={false}
      Icon={() => {
        return (
          <Ionicons name="ios-arrow-down-outline" size={20} color="gray" />
        );
      }}
    />
  );
};

export default NewPickerComponent;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: fSize(13),
    paddingVertical: 10,
    paddingHorizontal: calcW(0.03),
    //borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: COLORS.textclr,
    height: calcH(0.065),
    //paddingRight: 30, // to ensure the text is never behind the icon
    paddingHorizontal: 20,
    color: '#4B4B52',
    //marginBottom: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  inputAndroid: {
    fontSize: fSize(13),
    paddingHorizontal: calcW(0.03),
    paddingVertical: 8,
    //borderWidth: 0.5,
    //borderColor: 'purple',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    borderRadius: 8,
    //color: COLORS.textclr,
    color: 'black',
    height: calcH(0.065),
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
