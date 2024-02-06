import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const Selector = ({
  title,
  onPress,
  value,
  selected,
  subtitle,
  type,
  date,
  day,
  starttime,
  endtime,
}) => {
  const onSelect = (ev) => {
    onPress(ev, value);
  };

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        backgroundColor: selected === value ? '#2173A8' : '#fff',
        borderRadius: 5,
        marginHorizontal: 5,
        borderColor: selected === value ? '#fff' : '#2173A8',
        color: selected === value ? '#fff' : '#2173A8',
        //    height: 80,
        width: 130,
        paddingVertical: 10
      }}
    >
      <View
        style={{
          borderColor: '#2173A8',
          borderWidth: 1,
          marginLeft: '5%',
          borderRadius: 5,
          //   height: 80,
          // justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: selected === value ? '#fff' : '#2173A8',
            textAlign: 'center',
          }}
        >
          {day}
        </Text>
        <Text
          style={{
            color: selected === value ? '#fff' : '#2173A8',
            textAlign: 'center',
          }}
        >
          {date}
        </Text>
        <Text
          style={{
            color: selected === value ? '#fff' : '#2173A8',
            textAlign: 'center',
          }}
        >
          {starttime}-
        </Text>
        <Text
          style={{
            color: selected === value ? '#fff' : '#2173A8',
            textAlign: 'center',
          }}
        >
          {endtime}
        </Text>
        <Text
          style={{
            color: selected === value ? '#fff' : '#2173A8',
            textAlign: 'center',
          }}
        >
          {type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Selector;
