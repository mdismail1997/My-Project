import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileContext} from '../../Services/ProfileProvider';
const {width, height} = Dimensions.get('window');
import dynamicLinks from '@react-native-firebase/dynamic-links';

const Splash = props => {
  const {setToken} = useContext(ProfileContext);
  // useEffect(() => {
  //   setTimeout(() => {
  //     check();
  //   }, 3000);
  // }, []);

  const check = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token === null) {
      props.navigation.replace('Login');
    } else {
      props.navigation.replace('MyDrawer');
      setToken(token);
    }
  };
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log('=======splash=link========>', link);
        handleDynamicLink(link);
      });
  }, []);

  // useEffect(() => {
  //   const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
  //   // When the component is unmounted, remove the listener
  //   return () => unsubscribe();
  // }, []);

  const handleDynamicLink = link => {
    console.log('handleDynamicLink', link);
    if (link == null) {
      setTimeout(() => {
        check();
      }, 3000);
    } else {
      handleDynamicLink1(link);
    }
  };

  const handleDynamicLink1 = async link => {
    // Handle dynamic link inside your own application
    console.log('====link========>', link.url);
    const AccessToken = await AsyncStorage.getItem('token');
    const User = await AsyncStorage.getItem('userType');
    if (AccessToken != null) {
      if (User == 1) {
        let emailData = link.url.split('=').pop();
        console.log('emailData:', emailData);

        props.navigation.navigate('MyDrawer', {
          screen: 'BottomTabNavigation',
          params: {
            screen: 'CelebrityProfileData',
            params: {celebrityEmail: emailData},
          },
        });
      } else {
        props.navigation.replace('MyDrawer', {
          screen: 'BottomTabNavigation',
          params: {
            screen: 'Home',
          },
        });
      }
    } else {
      props.navigation.replace('Login');
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          width: '100%',
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={styles.stretch}
          source={require('../../Assets/Icon/Logo.png')}
        />
      </View>
    </SafeAreaView>

    // <SafeAreaView style={{flex:1,}}>

    // <Image style={{height:height,width:width,}}
    //     source={require('../../Assets/Icon/splash.jpg')}
    // />

    // </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  stretch: {
    width: '50%',
    height: '30%',
    resizeMode: 'contain',
  },
});
