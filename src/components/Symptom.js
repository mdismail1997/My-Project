import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const Symptom = ({ title, onPress, value, selected }) => {
  const onSelect = (ev) => {
    onPress(ev, value);
  };

  return (
    // <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    <TouchableOpacity
      onPress={onSelect}
      style={{
        backgroundColor: selected === value ? '#2173A8' : '#fff',
        borderRadius: 5,
        //  marginHorizontal: 5,
        height: 40,
        //  marginTop: 20,
        marginHorizontal: 10,
        marginVertical: 10,
        //width: 100,
        borderColor: '#2173A8',
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: selected === value ? '#fff' : '#2173A8',
          textAlign: 'center',
          marginTop: 10,
          marginLeft: '5%',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
    // </View>
  );
};

export default Symptom;
