import {View, Text, SafeAreaView, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {Header} from '../../components/Header/Header';
import CustomButton from '../../components/CustomButton';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {HelperText, TextInput} from 'react-native-paper';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {useDispatch, useSelector} from 'react-redux';
import {forgotPasswordAction} from '../../Redux/actions/AuthAction';
import Loader from '../../components/Loader';

const EmailVerifyScreen = props => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const forgotPasswordSuccess = useSelector(
    state => state.Auth.forgotPasswordSuccess,
  );
  const forgotMessage = useSelector(state => state.Auth.forgotMessage);
  const isLoading = useSelector(state => state.Auth.isLoading);

  useEffect(() => {
    if (forgotPasswordSuccess) {
      Alert.alert(forgotMessage);
    }
  }, [forgotPasswordSuccess]);

  const onPressSubmit = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email === '') {
      setErrorMessage('Please insert email id');
    } else if (emailRegex.test(email) === false) {
      setErrorMessage('Please insert valid email id');
    } else {
      forgotPassword();
    }
  };

  const forgotPassword = () => {
    const data = {
      email: email,
    };
    dispatch(forgotPasswordAction(data));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title="Verification" />
      {isLoading && <Loader />}
      <Text style={styles.titleText}>Verify Email</Text>
      <Text style={styles.subTitleText}>Enter your register Email address</Text>
      <TextInput
        // error={touched.password === true && errors.password !== undefined}
        mode="outlined"
        label="Email Id"
        placeholder=""
        onChangeText={text => setEmail(text)}
        value={email}
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          borderColor: COLORS.NICKEL,
          marginHorizontal: wp(38),
          marginTop: hp(50),
        }}
        activeOutlineColor={COLORS.NICKEL}
        outlineColor={COLORS.NICKEL}
      />
      <HelperText type="error" style={{marginHorizontal: wp(38)}}>
        {errorMessage}
      </HelperText>
      <CustomButton
        title="Submit"
        buttonStyle={{
          marginHorizontal: wp(38),
          marginVertical: hp(20),
        }}
        onPress={() => onPressSubmit()}
      />
      <Image
        source={require('../../Assets/file/file.png')}
        style={styles.imgStyle}
      />
    </SafeAreaView>
  );
};

export default EmailVerifyScreen;
