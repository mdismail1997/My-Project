import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

export function Chip({
  title,
  bgColor = '#E2E2E2',
  selectedBgColor = '#00C9FF',
  selected,
  value,
  onPress,
  _text,
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(value)}
      style={{
        backgroundColor: selected === value ? selectedBgColor : bgColor,
        minHeight: 40,
        borderRadius: 30,
        padding: 5,
        minWidth: 70,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text {..._text}>{title}</Text>
    </TouchableOpacity>
  );
}
