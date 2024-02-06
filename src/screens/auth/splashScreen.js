import React, {useEffect} from 'react';
import {Text, View, StyleSheet, SafeAreaView, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {calcH, logoHeight, logoWidth} from '../../utils/comon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';

export default function SplashScreen({navigation, route}) {
  useEffect(() => {
    const get = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token);
      if (token) {
        navigation.replace('TabScreen');
      } else {
        navigation.replace('signIn');
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#66CEE9'}}>
      <LinearGradient
        colors={['#66CEE9', '#2F5ED2']}
        style={styles.linearGradient}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Image
            style={{
              resizeMode: 'contain',
              height: logoHeight,
              width: logoWidth,
            }}
            source={require('../../../assets/images/logo.png')}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <Text style={{fontSize: RFValue(22), color: 'white'}}>
            Make Ride Easy For You
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(20),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: calcH(0.01),
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
