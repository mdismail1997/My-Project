import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function ButtonWhite(props) {
  return (
    <TouchableOpacity onPress={() => props.handleClick()} style={styles.button}>
      <Text style={styles.buttontext}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4B4B52',
    paddingVertical: 13,
    width: '100%',
    marginVertical: 10,
    borderRadius: 2,
  },
  buttontext: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    textAlign: 'center',
  },
});
