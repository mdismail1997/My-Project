import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { fSize } from '../../utils/constants/common';

const {height, width} = Dimensions.get('window');

const CustomButton = ({
  name,
  ref,
  size,
  color,
  text,
  style,
  onPress,
  textStyle,
}) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.container, {...style}]}
        ref={ref}
        onPress={onPress}>
        <View style={styles.icon}>
          <EvilIcons name={name} size={size || 30} color={color || 'blue'} />
        </View>
        <Text style={[styles.text, {...textStyle}]}>{text} </Text>
      </TouchableOpacity>
    </>
  );
};
export default CustomButton;

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    //borderWidth: 1,
  },
  text: {
    fontSize: fSize(16),
    color: 'blue',
    textAlign: 'left',
    justifyContent: 'center',
    //borderWidth: 1,
    flex: 1,
    //fontWeight: 'bold',
    marginLeft: 10,
  },
  container: {
    flexDirection: 'row',
    height: height / 16,
    width: width * 0.78,
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginLeft: 20,
  },
});
