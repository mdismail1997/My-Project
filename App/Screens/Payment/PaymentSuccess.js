import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useContext} from 'react';
import {ProfileContext} from '../../Services/ProfileProvider';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

const {width, height} = Dimensions.get('window');

const PaymentSuccess = props => {
  const {profileContextData} = useContext(ProfileContext);

  console.log('=======>', profileContextData);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
      }}>
      <StatusBar backgroundColor={'#FFF'} barStyle="light-content" />

      <View
        style={{
          //justifyContent: 'center',
          alignItems: 'center',
          width: width,
          height: height,
          // borderColor: '#000',
          // borderwidth: 2,
          backgroundColor: '#fff',
          //backgroundColor: 'dimgrey',
        }}>
        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 150,
            height: 150,
            borderRadius: 200,
            backgroundColor: '#E92D87',
            marginTop: height * 0.1,
          }}>
          <Image
            source={require('../../Assets/Icon/tick.png')}
            style={{width: 60, height: 39}}
          />
        </View> */}

        <View
          style={{
            marginTop: height * 0.1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 150,
            height: 150,
          }}>
          <Image
            source={require('../../Assets/Icon/paymentTick.png')}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.03,
          }}>
          <Text style={{fontSize: RFValue(22)}}>Payment Successful</Text>

          <View
            style={{
              width: width - 40,
              backgroundColor: '#DCDCDC',
              height: 1,
              margin: '3%',
            }}
          />

          <KeyboardAvoidingScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: '#ffffff',
              width: width * 0.9,
            }}>
            <View
              style={{
                marginBottom: height * 0.05,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: height * 0.1,
                }}>
                <Text style={{fontSize: RFValue(18), color: '#000'}}>
                  Amount Added:{' '}
                </Text>
                <Text style={{fontSize: RFValue(18), color: '#E92D87'}}>
                  {profileContextData.currency} {props.route.params.amount}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: height * 0.02,
                }}>
                <Text style={{fontSize: RFValue(18), color: '#000'}}>
                  Payed by:{' '}
                </Text>
                <Text style={{fontSize: RFValue(18), color: '#E92D87'}}>
                  {props.route.params.type}
                </Text>
              </View>
            </View>
          </KeyboardAvoidingScrollView>
        </View>
        <View style={styles.customButton} activeOpacity={0.7}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
            // onPress={() => {
            //   props.navigation.replace('MyDrawer', {
            //     screen: 'BottomTabNavigation',
            //     params: {
            //       screen: 'Wallet',
            //     },
            //   })
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{...styles.buttonText, color: '#E92D87'}}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  customButton: {
    //marginVertical: '5%',
    width: width * 0.35,
    height: height * 0.08,
    //backgroundColor: '#E92D87',
    backgroundColor: '#FFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: height * 0.15,
    borderWidth: 1,
    borderColor: '#E92D87',
  },
  buttonText: {
    textAlign: 'center',
    //lineheight: 53,
    color: '#FFFFFF',
    fontSize: RFValue(18),
    //fontFamily: 'Roboto-Bold',
    letterSpacing: 0.9,
    fontWeight: 'bold',
  },
});
