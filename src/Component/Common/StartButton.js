import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function StartButton(props) {
  return (
    <TouchableOpacity onPress={() => props.handleClick()} style={styles.button}>
      <Text style={styles.buttontext}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#727273',
    borderRadius:3,
    width:'90%',
    height:20,
    alignItems:'center',


  },
  buttontext: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    
  },
});
