import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const CustomRadio = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{...styles.radioStyle, ...props.style}}>
      {props.status && (
        <View
          style={{
            width: '60%',
            height: '60%',
            backgroundColor: '#E92D87',
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomRadio;

const styles = StyleSheet.create({
  radioStyle: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#EBE0E5',
    backgroundColor: '#f0ccdd',
    marginHorizontal: 5,
    alignSelf: 'center',
  },
});
