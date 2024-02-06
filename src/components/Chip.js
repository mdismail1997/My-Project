import React from 'react';
import { Alert, View } from 'react-native';
import { Chip } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

const RadioSelector = ({ title, onPress, value, selected, disabled }) => {
  const onSelect = (ev) => {
    console.log('lll', disabled);
    disabled ? null :
      onPress(ev, value);
  };
  const showAlert = () => {
    disabled ? Alert.alert('Alert', 'Already booked this schedule.') : null;
  };

  return (
    // <View style={{ width: "85%", flexDirection: 'row' }}>
    <Chip
      onPress={() => {

        onSelect(), showAlert();
      }}

      //textStyle={{ textAlign: 'center' }}
      style={{
        backgroundColor: disabled
          ? '#CBCBCB'
          : selected === value
            ? '#2173A8'
            : '#fff',
        borderRadius: 5,
        marginRight: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: selected === value ? '#fff' : '#2173A8',
        color: selected === value ? '#fff' : '#2173A8',
        height: 40,
        width: '29%',
        alignSelf: 'center',
      }}
      textStyle={{
        color: selected === value ? '#fff' : '#2173A8',
        textAlign: 'center',
        width: '70%',
        fontSize: RFValue(12),
      }}
    //  disabled={disabled}
    >
      {title}
    </Chip>
    // </View>
  );
};

export default RadioSelector;
