import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function ButtonWhite1(props) {
  return (
    <TouchableOpacity onPress={() => props.handleClick()} style={styles.button}>
      <Text style={styles.buttontext}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5F5F64',
    paddingVertical: 13,
    width: '100%',
    marginVertical: 10,
    borderRadius: 2,
  },
  buttontext: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#5F5F64',
    textAlign: 'center',
  },
});
