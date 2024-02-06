import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text, TextInput, Button, HelperText} from 'react-native-paper';
import {Header} from '../../components/Header/Header';
import OTPTextInput from 'react-native-otp-textinput';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

export const VerifyOtp = props => {
  console.log('route++++++', props.route.params);
  const navigation = useNavigation();
  const [otp, setOtp] = useState(props.route.params.otp);
  const [id, setId] = useState(props.route.params.id);

  useEffect(async () => {
    try {
      const value = await AsyncStorage.getItem('tokenId');
      if (value !== null) {
        setId(value);
        console.log('Id+++', value);
      }
    } catch (error) {}
  }, [navigation]);

  const otpApi = () => {
    console.log('===response==id', id);
    fetch(
      `https://nodeserver.mydevfactory.com:6098/api/users/verify-otp/${otp}/${id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(response => {
        console.log('===response==otp', response);
        if (response.success === true) {
          props.navigation.navigate('MyBottomTabs');
        }
      })
      .catch(error => {
        console.error('error', error);
      });
  };
  // const otpApi = async () => {
  //     try {
  //         const res = await axios({
  //             method: 'GET',
  //             url: 'https://nodeserver.mydevfactory.com:6098/api/users/verify-otp/'+1376+"631841f80e8c197ad64a8976",
  //             data:{},
  //             headers: {
  //                 'Accept': 'application/json',
  //                 'Content-Type': 'application/json'
  //             },
  //         })
  //         console.log('resotp+++++', res)
  //         return res
  //     } catch (error) {
  //         console.warn('error', error)
  //         handleNaviagte("error")
  //     }
  // }
  // const handleNaviagte = (res) => {
  //     if (res) {
  //         // navigation.navigate('');
  //     }
  //     else {
  //         alert('res :', res)

  //     }
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 22}}>
        <Header title="OTP Verification" navProps={props.navigation} />
        <View style={{marginTop: 101}}>
          <Text style={styles.verifytextCSS}>Verify OTP</Text>
          <Text style={styles.emailtextCSS}>
            {' '}
            We have sent a verification code
          </Text>
        </View>
        <View style={{marginTop: 50, alignItems: 'center'}}>
          <OTPTextInput
            tintColor={'#737373'}
            offTintColor={'#737373'}
            textInputStyle={{
              width: '18%',
              height: 65,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 2,
              marginHorizontal: 10,
              borderBottomWidth: 2,
              marginTop: 2,
              shadowColor: '#8FCD2D',
              shadowOffset: {width: 2, height: 4},
              shadowOpacity: 0.5,
              shadowRadius: 3,
              elevation: 10,
            }}
            defaultValue={otp}
            inputCount={4}
            handleTextChange={text => {
              setOtp(text);
            }}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Button
            style={{fontSize: 32}}
            mode="contained"
            color="#8FCD2D"
            uppercase={false}
            contentStyle={{height: 54}}
            labelStyle={{color: '#fff', fontSize: 16}}
            onPress={() => otpApi()}>
            Confirm
          </Button>

          <View style={styles.view}>
            <Text style={styles.didtextCSS}>Did not resive PIN?</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('VerifyEmail')}>
              <Text style={[styles.didtextCSS, {color: '#8FCD2D'}]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 81}}>
          <Image
            source={require('../../Assets/Email.png')}
            style={styles.imagefingerCSS}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  head: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 30,
  },
  imagefingerCSS: {
    width: 181,
    height: 140,
    resizeMode: 'contain',
  },
  verifytextCSS: {
    color: '#000',
    fontSize: 35,
    fontWeight: '700',
    fontFamily: 'Lato',
  },
  emailtextCSS: {
    color: '#737373',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Lato',
    marginTop: 12,
  },
  didtextCSS: {
    fontSize: 16,
    fontWeight: '500',
    color: '#707070',
    margin: 2,
  },
  view: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
