import { View, Text, SafeAreaView, TextInput, Image, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import { Header } from '../../components/Header/Header';
import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { otpVerifyAction, resendOtpAction } from '../../Redux/actions/AuthAction';
import Loader from '../../components/Loader';
import { HelperText } from 'react-native-paper';

const OtpVerifyScreen = props => {
  const otpInputRef = useRef([]);
  const [otpValue, setOtpValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userData = useSelector(state => state.Auth.userData);
  const isVerified = useSelector(state => state.Auth.isOtpVerified);
  const isLoading = useSelector(state => state.Auth.isLoading);
  const otpMessage = useSelector(state => state.Auth.otpMessage);
  const isOtpSent = useSelector(state => state.Auth.isOtpSent);
  const resendMessage = useSelector(state => state.Auth.resendMessage);
  const dispatch = useDispatch();

  //console.log("0999999999999999999999999", otpMessage)

  useEffect(() => {
    setErrorMessage(otpMessage);
    if (isVerified) {
      props.navigation.navigate('LogIn');
    } else {
      setErrorMessage(otpMessage);
    }
  }, [isVerified, otpMessage]);





  const onResendOtp = () => {
    let userId = userData?.data?._id;
    dispatch(resendOtpAction(userId));
  };

  const onFilledOTP = () => {
    if (otpValue === '') {
      setErrorMessage('Please enter OTP');
    } else {
      setErrorMessage('');
      let userId = userData?.data?._id;
      dispatch(otpVerifyAction(otpValue, userId));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Header title="OTP Verification" {...props} />
      <Text style={styles.titleText}>Verify OTP</Text>
      <Text style={styles.subTitleText}>We have sent a verification code</Text>
      {/* {_renderOtpInput()} */}
      <OTPInputView
        code={otpValue}
        onCodeChanged={code => setOtpValue(code)}
        pinCount={4}
        style={styles.otpContainer}
        codeInputFieldStyle={styles.otpInput}
      // onCodeFilled={() => onFilledOTP()}
      />
      {console.log("=-=-=---=-=-=-=-=-", errorMessage)}
        {errorMessage != '' && (
          <HelperText
            style={{
              marginHorizontal: wp(38),
              marginTop: 10,
              fontSize: 14,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            type="error">
            {errorMessage}
          </HelperText>
        )}
      <CustomButton
        title="Confirm"
        buttonStyle={{
          marginHorizontal: wp(38),
          marginVertical: hp(20),
        }}
        onPress={() => onFilledOTP()}
      />
      <Text style={styles.resendText}>
        Did not receive PIN?{' '}
        <Text
          style={{ color: COLORS.YELLOW_GREEN }}
          onPress={() => onResendOtp()}>
          Resend
        </Text>
      </Text>
      <Image
        source={require('../../Assets/email/Email.png')}
        style={styles.imgStyle}
      />
    </SafeAreaView>
  );
};

export default OtpVerifyScreen;
