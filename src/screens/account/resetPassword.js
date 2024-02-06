import React, {useState, useEffect} from 'react';
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
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import IconMaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import Hud from '../../utils/hud';

export default function SetPassword({navigation, route}) {
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');

  const [showHide, setShowHide] = useState(false);

  const [showHideCP, setShowHideCP] = useState(false);

  const [showHidePassword, setShowHidePassword] = useState(true);

  const [showHideCPassword, setShowHideCPassword] = useState(true);

  const [focusPassword, setFocusPassword] = useState(false);
  const [focusCPassword, setFocusCPassword] = useState(false);

  const [userEmail, setUserEmail] = useState('');

  const showHidePasswordFun = () => {
    setShowHide(!showHide);
    setShowHidePassword(!showHidePassword);
  };

  const showHideCPasswordFun = () => {
    setShowHideCP(!showHideCP);
    setShowHideCPassword(!showHideCPassword);
  };

  const onFocusTextInputPassword = () => {
    setFocusPassword(true);
  };

  const onBlurTextInputPassword = () => {
    setFocusPassword(false);
  };

  const onFocusTextInputCPassword = () => {
    setFocusCPassword(true);
  };

  const onBlurTextInputCPassword = () => {
    setFocusCPassword(false);
  };

  useEffect(() => {
    const passedData = route.params;

    // console.log('eeeee', passedData)
    if (passedData) {
      setUserEmail(passedData.userEmail);
    }
  }, [route.params]);

  const handlesubmit = async() => {
    if (password.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your password ',
      });
    } else if (password !== cPassword) {
      Toast.show({
        type: 'error',
        text1: 'password and confirm password in not match ',
      });
    } else {
      const body = {
        email: userEmail,
        password: password,
      };
      Hud.showHud();
     await axios({
        method: 'post',
        url: BASE_URL + 'reset-password',
        headers: {
          Accept: 'application/json',
          //authorization: 'Bearer ' + token,
        },
        data: body,
      })
        .then(response => {
          console.log(response.data);
          Hud.hideHud();
          //setProfileImg(response.data.profile_photo);
          Toast.show({
            type: 'error',
            text1: response.data.message,
          });
          if (response.data.success === true) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            navigation.navigate('homeScreen');
          }
        })
        .catch(err => {
          console.log('err', err);
          Hud.hideHud();
          Toast.show({
            type: 'error',
            text1: err.response.message,
          });
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          {/* <View style={styles.viewOne}>

          </View> */}

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
                source={require('../../asserts/logo.png')}
              />
              <Text style={styles.headerText}>
                {route.params.isChangePassword ? 'Change' : 'Reset'} Password
              </Text>
              <Text style={styles.subText}>
                Create your new password be strong
              </Text>
              <View
                style={
                  focusPassword === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusPassword === true ? (
                  <IconMaterialIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'lock-outline'}
                  />
                ) : (
                  <IconMaterialIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'lock-outline'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  value={password}
                  secureTextEntry={showHidePassword}
                  placeholder="Password"
                  onChangeText={text => setPassword(text)}
                  onBlur={() => onBlurTextInputPassword()}
                  onFocus={() => onFocusTextInputPassword()}
                  placeholderTextColor="#C9CCCF"
                />
                {showHide === true ? (
                  <TouchableOpacity onPress={() => showHidePasswordFun()}>
                    {focusPassword === true ? (
                      <IconFeather
                        color={colors.activeBorder}
                        size={24}
                        name={'eye'}
                      />
                    ) : (
                      <IconFeather
                        color={colors.inActiveBorder}
                        size={24}
                        name={'eye'}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => showHidePasswordFun()}>
                    {focusPassword === true ? (
                      <IconFeather
                        color={colors.activeBorder}
                        size={24}
                        name={'eye-off'}
                      />
                    ) : (
                      <IconFeather
                        color={colors.inActiveBorder}
                        size={24}
                        name={'eye-off'}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={
                  focusCPassword === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusCPassword === true ? (
                  <IconMaterialIcons
                    color={colors.activeBorder}
                    size={24}
                    name={'lock-outline'}
                  />
                ) : (
                  <IconMaterialIcons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'lock-outline'}
                  />
                )}

                <TextInput
                  style={styles.textInput}
                  value={cPassword}
                  secureTextEntry={showHideCPassword}
                  placeholder="Confirm Password"
                  onChangeText={text => setCPassword(text)}
                  onBlur={() => onBlurTextInputCPassword()}
                  onFocus={() => onFocusTextInputCPassword()}
                  placeholderTextColor="#C9CCCF"
                />
                {showHideCP === true ? (
                  <TouchableOpacity onPress={() => showHideCPasswordFun()}>
                    {focusCPassword === true ? (
                      <IconFeather
                        color={colors.activeBorder}
                        size={24}
                        name={'eye'}
                      />
                    ) : (
                      <IconFeather
                        color={colors.inActiveBorder}
                        size={24}
                        name={'eye'}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => showHideCPasswordFun()}>
                    {focusCPassword === true ? (
                      <IconFeather
                        color={colors.activeBorder}
                        size={24}
                        name={'eye-off'}
                      />
                    ) : (
                      <IconFeather
                        color={colors.inActiveBorder}
                        size={24}
                        name={'eye-off'}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={{width: '100%'}}
                // onPress={() => navigation.navigate('')}>
                onPress={() => handlesubmit()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.goBack()}>
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
}

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
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: '100%',
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 24,
    color: colors.textHeader,
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
    color: '#000',
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
