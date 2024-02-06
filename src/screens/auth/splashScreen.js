import React from 'react';
import {Text, View, StyleSheet, SafeAreaView, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {logoHeight, logoWidth} from '../../utils/comon';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({navigation}) {
  // useEffect(async() => {
  // //  function fetchMyAPI() {
  //     // const data = JSON.parse(await AsyncStorage.getItem('userToken'));
  //     // console.log('await AsyncStorage.getItem=======>', JSON.parse(await AsyncStorage.getItem('userToken')))
  //     // if (data !== null) {
  //       setTimeout(() => {
  //         navigation.navigate('signIn');
  //       }, 1000);
  //     // } else {
  //     //   setTimeout(() => {
  //     //     navigation.navigate('signIn');
  //     //   }, 1000);
  //     // }
  //   // }

  // //   fetchMyAPI()
  // //   fetch()
  // }, []);
  React.useEffect(() => {
    const fetch = async () => {
      try {
        const token = JSON.parse(await AsyncStorage.getItem('userToken'));
        console.log(token);
        if (token) {
          navigation.replace('mainNavigation');
        } else {
          navigation.replace('signIn');
        }
      } catch (error) {}
    };
    setTimeout(() => {
      fetch();
    }, 1000);
    return clearTimeout();
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
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
            source={require('../../asserts/logo.png')}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <Text style={{fontSize: 20, color: 'white'}}>
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
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
