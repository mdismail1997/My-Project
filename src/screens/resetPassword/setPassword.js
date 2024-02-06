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
import IconFontisto from 'react-native-vector-icons/dist/Fontisto';
import IconMaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import commonToast from '../../utils/commonToast';

export default setPassword = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showHide, setShowHide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHideCP, setShowHideCP] = useState(false);

  const [showHidePassword, setShowHidePassword] = useState(true);

  const [showHideCPassword, setShowHideCPassword] = useState(true);

  const [focusPassword, setFocusPassword] = useState(false);
  const [focusCPassword, setFocusCPassword] = useState(false);

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

    console.log('eeeee', passedData);
    if (passedData) {
      setUserEmail(passedData.userEmail);
    }
  }, [route.params]);

  const doContinuePress = async () => {
    const testForPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (password === '') {
      commonToast({
        text: 'Please enter password',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (password.length < 8) {
      commonToast({
        text: 'Your password must be at least 8 characters',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (!testForPassword.test(password)) {
      commonToast({
        text: 'Your password must be at least one uppercase letter, one lowercase letter, one special character and one number ',
        position: 'top',
        toastFor: 'error',
        duration: 4000,
      });
      return false;
    }
    if (password !== cPassword) {
      commonToast({
        text: 'Your both passwords must be the same',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }

    doChangePwd();
  };

  const doChangePwd = async () => {
    setIsLoading(true);
    const data = {
      email: userEmail,
      password: password,
    };
    console.log(data);

    await axios({
      method: 'post',
      url: BASE_URL + 'reset-password',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(response => {
        setIsLoading(false);

        if (response.data.success === true) {
          commonToast({
            text: response.data.message,
            position: 'top',
          });

          navigation.navigate('signIn');
        }
        console.log('Success', response.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('err', err);
        commonToast({
          text: err,
          position: 'top',
          toastFor: 'error',
        });
      });
  };

  const onCancelPress = () => {
    setPassword(' ');
    setCPassword(' ');
    navigation.navigate('signIn');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
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
                onPress={doContinuePress}>
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
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
