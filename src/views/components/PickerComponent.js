import {StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';

import {Picker} from '@react-native-picker/picker';
import COLORS from '../../conts/colors.js';
import {calcH, fSize} from '../../utils/constants/common.js';
import {FONTS} from '../../conts/theme.js';

const PickerComponent = ({
  pickerData,
  setPickerData,
  mapData,
  itemStyle,
  PickerStyle,
}) => {
  return (
    <Picker
      style={[{color: COLORS.header_color, ...FONTS.OpenSans_Reg}]}
      mode="dropdown"
      selectedValue={pickerData}
      dropdownIconColor="#4B4B"
      dropdownIconRippleColor={COLORS.blue}
      itemStyle={{height:50, width:'100%'}}
      //itemStyle={{textAlign: 'center'}}
      onValueChange={(itemValue, itemIndex) => setPickerData(itemValue)}>
      {mapData.map((i, index) => {
        return (
          <Picker.Item
            key={`${i}+${index}`}
            label={i}
            style={{
              fontSize: fSize(10),
              //backgroundColor: 'blue',
              ...FONTS.OpenSans_Reg,
              color: COLORS.header_color,
              //textAlign: 'right',
            }}
            value={i}
          />
        );
      })}
    </Picker>
  );
};

export default PickerComponent;

const styles = StyleSheet.create({});
