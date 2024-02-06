import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import React from 'react';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import ImagePicker from 'react-native-image-crop-picker';

const ImagePickerComp = props => {
  const {isVisible,onPressCancel,onPressPicker,onPressCamera,data,imageName,} = props;
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
                mediaType: 'photo',
                includeBase64: true,
                cropping: true,
                multiple: true,
                maxFiles: 4,
              }).then(res => {
                let selectPhoto = [];
                console.log('123546', res);
                // var getFilename = res[0].path.split('/');
                // var imgName = getFilename[getFilename.length - 1];
                // console.log('123546', imgName);
                // im
                if (res.length >= 1) {
                  for (var i = 0; i < res.length; i += 1) {
                    onPressPicker(`data:${res[i].mime};base64,` + res[i].data);
                    data(res);
                  }
                  console.log(res);
                }

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
                mediaType: 'photo',
                includeBase64: true,
                cropping: true,
                multiple: true,
                maxFiles: 4,
              }).then(res => {
                onPressPicker(`data:${res.mime};base64,` + res.data);
                // if (selectMultiple) {
                //   data(pre => [...pre, res]);
                //   onPressPicker(`data:${res.mime};base64,` + res);
                // }

                // console.log('************', res.);
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

export default ImagePickerComp;

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
