import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import React from 'react';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import { useState } from 'react';



const convertToBase64 = async (file) => {
  return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
  })
}

const ImagePickerVideo = props => {

  const {
    isVisible,
    onPressCancel,
    onPressPicker,
    video,
    onPressCamera,
    data,
    imageName,
  } = props;
  return (
    <Modal transparent animationType="slide" visible={isVisible}>
      <View style={styles.container}>
        <View style={[styles.itemContainer, {marginVertical: 4}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{width: '100%', alignItems: 'center'}}
            onPress={() => onPressCancel()}>
            <Text style={[styles.textStyle, {color: COLORS.COQUELICOT}]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.openPicker({
                mediaType: 'video',
                // includeBase64: true,
                multiple: true,
                maxFiles: 4,
              }).then(res => {
                RNFS.readFile(res[0].path, 'base64').then(res => {
                      onPressPicker(`data:${res[0].mime};base64,` + res);
                      
                      data(res);
                       console.log(".,,,.,.",data)
    
                    onPressCancel();
              })


                // let selectPhoto = [];
                // console.log('123546', convertToBase64(res.path));
                // console.log('video=====', res);
                // var getFilename = res[0].path.split('/');
                // var imgName = getFilename[getFilename.length - 1];
                // console.log('123546', imgName);
                // im
               
                    // onPressPicker(`data:${res.mime};base64,` + res.data);
                    // data(res);
                  
                  // console.log(res);
                

                onPressCancel();
              });
            }}
            activeOpacity={0.8}
            style={{width: '100%', alignItems: 'center'}}>
            <Text style={styles.textStyle}>Open Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.openCamera({
                mediaType: 'video',
                //  includeBase64: true,

                // multiple: true,
                // maxFiles: 4,
              }).then(res => {
                onPressPicker(`data:${res.mime};base64,` + res.data);
                // if (selectMultiple) {
                //   data(pre => [...pre, res]);
                //   onPressPicker(`data:${res.mime};base64,` + res);
                // }

                console.log('************', res);
                for (let i = 0; i < res.length; i++) {}
                onPressCancel();
              });
            }}
            activeOpacity={0.8}
            style={{width: '100%', alignItems: 'center'}}>
            <Text style={[styles.textStyle, {marginTop: hp(16)}]}>
              Open Camera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    flexDirection: 'column-reverse',
  },
  itemContainer: {
    marginHorizontal: wp(20),
    borderRadius: 12,
    padding: hp(14),
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: wp(18),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.YELLOW_GREEN,
    // fontWeight: 'bold',
  },
});
