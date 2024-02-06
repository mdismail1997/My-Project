import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import commonToast from '../../utils/commonToast';
import Hud from '../../utils/hud';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';

export default forgetPassword = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showHide, setShowHide] = useState(false);

  const [showHidePassword, setShowHidePassword] = useState(true);

  const [focusEmail, setFocusEmail] = useState(false);

  const [focusPassword, setFocusPassword] = useState(false);

  const showHidePasswordFun = () => {
    setShowHide(!showHide);
    setShowHidePassword(!showHidePassword);
  };

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  const onFocusTextInputPassword = () => {
    setFocusPassword(true);
  };

  const onBlurTextInputPassword = () => {
    setFocusPassword(false);
  };

  const onCancelPress = () => {
    setEmail('');
    navigation.navigate('signIn');
  };

  const onContinuePress = () => {
    const testForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email === '') {
      commonToast({
        text: 'Please enter email',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }
    //  else if(!testForEmail.test(email)) {
    //   commonToast({
    //     text:'Please enter valid email',
    //     position:'top',
    //     toastFor:'error'
    //    })
    //    return false
    // }
    doOTPverify();
  };

  const doOTPverify = async () => {
    setIsLoading(true);
    const data = {email: email};
    console.log(data);
    Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'forgot-password',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        setIsLoading(false);
        Hud.hideHud();
        console.log('Success', response);
        if (response.data.success === true) {
          commonToast({
            text: response.data.message,
            position: 'top',
          });

          navigation.navigate('otp', {userEmail: email});
        } else {
          commonToast({
            text: response.data.message,
            position: 'top',
          });
        }
      })
      .catch(err => {
        Hud.hideHud();
        setIsLoading(false);
        console.log('err', err);
        commonToast({
          text: err,
          position: 'top',
          toastFor: 'error',
        });
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View
            style={{
              position: 'absolute',
              left: 15,
              top: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('signIn')}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconAntDesign
                color={colors.headerText}
                size={24}
                name={'arrowleft'}
              />
              <Text
                style={[styles.subText, {fontWeight: 'bold', fontSize: 18}]}>
                {'   '}Back
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: 10,
                alignItems: 'center',
                padding: allPadding,
              }}>
              <Image
                style={{
                  height: logoHeight,
                  width: logoWidth,
                  resizeMode: 'contain',
                  marginBottom: 30,
                }}
                source={require('../../../assets/images/logo.png')}
              />
              <Text style={styles.headerText}>Forget Password</Text>
              <Text style={styles.subText}>
                Enter your registered email address
              </Text>
              <View
                style={
                  focusEmail === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusEmail === true ? (
                  <Image
                    source={require('../../../assets/images/email.png')}
                    style={{
                      width: calcW(0.062),
                      height: calcH(0.024),
                      tintColor: colors.activeBorder,
                    }}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/email.png')}
                    style={{
                      width: calcW(0.062),
                      height: calcH(0.024),
                      tintColor: colors.inActiveBorder,
                    }}
                    resizeMode={'contain'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  value={email}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setEmail(text.toLowerCase())}
                  placeholderTextColor="#C9CCCF"
                />
              </View>

              <TouchableOpacity
                style={{width: '100%'}}
                // onPress={() => navigation.navigate('otp')}
                onPress={onContinuePress}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onCancelPress}>
                <Text
                  style={[styles.subText, {fontSize: 18, marginVertical: 30}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 2,
  },
  viewThree: {
    flex: 1,
  },
  inActiveBorder: {
    width: '100%',
    height: calcH(0.08),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingLeft: allPadding,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 2,
  },
  activeBorder: {
    width: '100%',
    height: calcH(0.08),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingLeft: allPadding,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 2,
  },
  headerText: {
    fontSize: 24,
    color: colors.headerText,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subText: {
    fontSize: 16,
    color: colors.subHeader,
    marginVertical: 10,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextStyle: {
    fontSize: 18,
    color: colors.white,
    // marginVertical: 10,
    textAlign: 'center',
  },
});
