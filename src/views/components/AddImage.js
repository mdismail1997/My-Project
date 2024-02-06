import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import CustomButton from './CustomButton.js';

const AddImage = ({style, imageURI, onPressUpload, onPressCancel}) => {
  return (
    <View style={styles.container}>
      <Image style={[styles.image, {...style}]} source={{uri: imageURI}} />
      <CustomButton
        text="Upload Image"
        name="camera"
        onPress={onPressUpload}
        style={{backgroundColor: 'yellow'}}
        textStyle={{color: '#3533a6'}}
      />
      <CustomButton
        text="Cancel"
        name="close-o"
        onPress={onPressCancel}
        style={{backgroundColor: 'yellow', marginTop: 10}}
        textStyle={{color: '#3533a6'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -100,
    //borderWidth: 1,
    backgroundColor: '#cfcfcf',
  },
  image: {
    width: '100%',
    height: '50%',
    margin: 10,
  },
});

export default AddImage;
