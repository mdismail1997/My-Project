import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import React from 'react';

import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const PleaseWait = props => {
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{backgroundColor: '#FFFFFF', alignItems: 'center'}}>
        <View
          style={{
            height: height * 0.3,
            width: width * 0.45,
            alignSelf: 'center',
            marginTop: height * 0.05,
          }}>
          <Image
            source={require('../../Assets/Icon/waitlogo.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            width: width * 0.75,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: RFValue(30),
              fontWeight: '600',
              //fontFamily: 'Roboto-Medium',
            }}>
            Please Wait!
          </Text>

          <Text
            style={{
              fontSize: RFValue(17),
              //fontFamily: 'Roboto-Regular',
              fontWeight: '400',
              marginTop: height * 0.03,
            }}>
            Profile bas been submitted to verification.
          </Text>
          <Text
            style={{
              fontSize: RFValue(17),
              //fontFamily: 'Roboto-Regular',
              fontWeight: '400',
            }}>
            When its verified you’ll get the mail.
          </Text>
        </View>

        <View style={{width: width * 0.8, height: 50, marginTop: height * 0.1}}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#E92D87',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => props.navigation.replace('Login')}>
            <Text style={{fontSize: 19, color: '#FFFFFF'}}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PleaseWait;
