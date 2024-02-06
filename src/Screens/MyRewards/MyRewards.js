import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Component/Header/Header';

export default function MyRewards({navigation}) {
  return (
    <View style={styles.container}>
      <Header title="Cart" navigation={navigation} icon="menu" />
      <View style={{paddingHorizontal: 20, paddingBottom: 70}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
