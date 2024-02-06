import React, {useState, useContext} from 'react';
import {View, Text, SafeAreaView, Keyboard, ToastAndroid} from 'react-native';
import Toast from 'react-native-toast-message';

import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';

import {STORAGE_KEY, passwordRegExp} from '../../../utils/constants/common';
import {createPut} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';

import styles from './style';
import {AuthContext} from '../../components/context.js';
import mmkv from '../../../utils/constants/mmkv/index.js';
import strings from '../../components/lng/LocalizedStrings';

const ChangePasswordScreen = ({navigation, route}) => {
  const {loginState, signOut} = useContext(AuthContext);

  const [inputs, setInputs] = React.useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const setToastMsg = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.TOP);
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.old_password) {
      handleError('Please enter your old password', 'old_password');
      isValid = false;
    } else if (inputs.old_password.length < 5) {
      handleError('Min password length of 5', 'old_password');
      isValid = false;
    }
    if (!inputs.new_password) {
      handleError('Please enter password', 'new_password');
      isValid = false;
    } else if (!inputs.new_password.match(passwordRegExp)) {
      handleError(
        'Minimum eight characters, at least one letter, one number and one special character:',
        'new_password',
      );
      isValid = false;
    }

    if (inputs.new_password != inputs.confirm_password) {
      handleError(
        'New Password and Confirm Password does not match',
        'confirm_password',
      );
      isValid = false;
    }

    if (isValid) {
      console.log(inputs);
      passwordchange();
    }
  };

  const passwordchange = async () => {
    setLoading(true);
    const {id} = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);
    try {
      console.log('userName', id);
      let result = await createPut({
        tokenType: 'self',
        url: `${commonUrl.changePassword}=${id}`,
        body: {
          currentPassword: inputs.old_password,
          newPassword: inputs.new_password,
        },
      });
      console.log(result.data);
      if (result.status === 200) {
        setLoading(false);
        Toast.show({
          text1: `Your password has been changed successfully.`,
          text2: `Please login again.`,
          type: 'success',
        });

        signOut();
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'success',
      });
      console.log(error);
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <View style={styles.inputContainer}>
        <Input
          onChangeText={text => handleOnchange(text, 'old_password')}
          onFocus={() => handleError(null, 'old_password')}
          iconName="lock-outline"
          placeholder={`${strings.OLD_PASSWORD}`}
          error={errors.old_password}
          password
        />
        <Input
          onChangeText={text => handleOnchange(text, 'new_password')}
          onFocus={() => handleError(null, 'new_password')}
          iconName="lock-outline"
          placeholder={`${strings.New_Password}`}
          error={errors.new_password}
          password
        />
        <Input
          onChangeText={text => handleOnchange(text, 'confirm_password')}
          onFocus={() => handleError(null, 'confirm_password')}
          iconName="lock-outline"
          placeholder={`${strings.CONFIRM_PASSWORD}`}
          error={errors.confirm_password}
          password
        />
        <Button
          title={`${strings.UPDATE}`}
          bgColor={COLORS.BlackTie}
          onPress={validate}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
