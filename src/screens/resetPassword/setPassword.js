import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
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
import Hud from '../../utils/hud';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';

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

  const handlesubmit = () => {
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
      // (async () => {
      //   Hud.showHud();
      //   const rawResponse = await fetch(
      //     // 'http://mydevfactory.com/~devserver/kabou/api/driver/register',
      //     'http://kabou.us/api/driver/reset-password',
      //     {
      //       method: 'POST',
      //       headers: {
      //         Accept: 'application/json',
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(body),
      //     },
      //   );
      //   const content = await rawResponse.json();

      //   console.log(content);
      //   Hud.hideHud();
      //   if (content.success) {
      //     Toast.show({
      //       type: 'success',
      //       text1: content.message,
      //     });
      //     // navigation.navigate('userVerification', {userEmail: email});
      //     // navigation.navigate('');
      //     navigation.navigate('signIn');
      //   } else {
      //     Hud.hideHud();
      //     Toast.show({
      //       type: 'error',
      //       text1: content.message,
      //     });
      //   }
      // })();
      Hud.showHud();
      axios({
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
            navigation.navigate('signIn');
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
              <Text style={styles.headerText}>Create Password</Text>
              <Text style={styles.subText}>
                New password must be strong
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

              <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
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
    flex: Platform.OS === 'ios' ? 0.1 : null,
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
    flex: Platform.OS === 'ios' ? 0.1 : null,
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
    color: colors.activeBorder,
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
