import {
  I18nManager,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';

import Toast from 'react-native-toast-message';

import strings from '../../components/lng/LocalizedStrings.js';
import {
  calcH,
  calcW,
  passwordRegExp,
  STYLES,
} from '../../../utils/constants/common.js';
import Input from '../../components/Input.js';
import Button from '../../components/Button.js';
import COLORS from '../../../conts/colors.js';
import {getLng} from '../../components/lng/changeLng.js';
import client from '../../../utils/constants/API/client.js';
import {createpost} from '../../../utils/constants/API/ServerRequest.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import Loader from '../../components/Loader.js';

const ResetPassword = ({navigation, route}) => {
  const [inputs, setInputs] = React.useState({
    token: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  //email sent through navigation
  const {email} = route.params;

  const data = {
    email: email.trim(),
    resetToken: inputs.token.trim(),
    newPassword: inputs.confirm_password.trim(),
  };
  console.log('data', data);
  React.useEffect(() => {
    selectedLng();
  }, []);

  const selectedLng = async () => {
    const lngData = await getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      await I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      await I18nManager.forceRTL(true);
    }
    //console.log('selected Language data==>>>', lngData);
    setLoading(false);
  };

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.token) {
      handleError('Please enter your token', 'token');
      isValid = false;
    } else if (inputs.token.length < 32) {
      handleError('Token should be at least 32 characters', 'token');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please enter password', 'password');
      isValid = false;
    } else if (!inputs.password.match(passwordRegExp)) {
      handleError(
        'Minimum eight characters, at least one letter, one number and one special character:',
        'password',
      );
      isValid = false;
    }
    if (inputs.password != inputs.confirm_password) {
      handleError(
        'Password and Conform Password not match',
        'confirm_password',
      );
      isValid = false;
    }
    if (isValid) {
      handleResetPassword();
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      let result = await createpost({
        tokenType: 'resetPassword',
        url: commonUrl.resetPassword,
        token: inputs.token,
        body: data,
      });

      console.log('result', result);
      if (result.status === 200) {
        setLoading(false);
        navigation.navigate('LoginScreen');
        Toast.show({
          text1: `Password changed successfully, Please login now`,
          type: 'success',
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <>
      {loading && <Loader visible={loading} />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{marginTop: calcH(0.19)}}>
            <Text style={styles.textHeader}>{strings.RESET_PASSWORD}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              onChangeText={text => handleOnchange(text, 'token')}
              onFocus={() => handleError(null, 'token')}
              iconName="alpha-t-circle-outline"
              placeholder={strings.ENTER_YOUR_TOKEN}
              error={errors.token}
            />
            <Input
              onChangeText={text => handleOnchange(text, 'password')}
              onFocus={() => handleError(null, 'password')}
              iconName="lock-outline"
              placeholder={strings.PASSWORD}
              error={errors.password}
              password
            />
            <Input
              onChangeText={text => handleOnchange(text, 'confirm_password')}
              onFocus={() => handleError(null, 'confirm_password')}
              iconName="lock-outline"
              placeholder={strings.CONFIRM_PASSWORD}
              error={errors.confirm_password}
              password
            />
            <Button
              title={strings.RESET_PASSWORD}
              bgColor={COLORS.BlackTie}
              onPress={validate}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  textHeader: {
    color: STYLES.PRIMARY_COLOR,
    fontSize: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: calcW(0.05),
    paddingHorizontal: calcW(0.06),

    marginTop: calcH(0.05),
  },
});
