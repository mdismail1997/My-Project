import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import COLORS from '../../conts/colors.js';
import {STORAGE_KEY} from '../../utils/constants/common.js';
import mmkv from '../../utils/constants/mmkv/index.js';
import {navigate} from '../navigator/NavigationRef.js';

const SellerNotice = props => {
  const seller = mmkv.get(STORAGE_KEY.isSeller);
  // const navigation = useNavigation();
  const isSubmitted = mmkv.get(STORAGE_KEY.isUploaded);
  //console.log('isSubmitted', isSubmitted);

  React.useEffect(() => {}, []);

  if (seller == null && isSubmitted == null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigate('UploadDocuments')}>
          <Text style={styles.text}>
            Upload your documents to get verified.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (seller == null && isSubmitted != null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigate('UploadDocuments')}>
          <Text style={styles.text}>
            Upload your documents to get verified.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    //borderWidth: 1,
    alignItems: 'center',
    backgroundColor: COLORS.header_color,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    //top: StatusBar.currentHeight,
    width: '100%',
    zIndex: 1,
  },
  text: {
    color: COLORS.white,
  },
});

export default SellerNotice;
