import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChangePasswordAPI, forgotPasswordAPI, loginAPI, logoutAPI, resendOtpAPI, signUpAPI, verifyOtpAPI, } from '../../Services/ApiService';
import { setUser } from '../../utils/DataStore';
import { CHANGE_PASSWORD, CHANGE_PASSWORD_FAILED, CHANGE_PASSWORD_SUCCESS, FORGOT_PASSWORD, FORGOT_PASSWORD_FAILED, FORGOT_PASSWORD_SUCCESS, OTP_VERIFY, OTP_VERIFY_FAILED, OTP_VERIFY_SUCCESS, RESEND_OTP, USER_LOGIN, USER_LOGIN_FAILED, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_LOGOUT_FAILED, USER_LOGOUT_SUCCESS, USER_SIGNUP, USER_SIGNUP_FAILED, USER_SIGNUP_SUCCESS, } from './types';

// User login
export const userLoginAction = body => {
  return async dispatch => {
    dispatch({ type: USER_LOGIN });
    try {
      const response = await loginAPI(body);
      await AsyncStorage.setItem('USER', JSON.stringify(response));
      if (response.success) {
        userLoginSuccess(dispatch, response);
      } else {
        userLoginFailed(dispatch, response);
      }
    } catch (error) {
      console.log('Error: ', error);
      userLoginFailed(dispatch, error);
    }
  };
};
export const userChangePasswordAction = data => {
  return async dispatch => {
    dispatch({ type: CHANGE_PASSWORD });
    try {
      const response = await ChangePasswordAPI(data);
      console.log('response  =======', data);
      if (response.success) {
        onChangePasswordSuccess(dispatch, response);
      } else {
        onChangePasswordFailed(dispatch, response);
      }
    } catch (error) {
      console.log('Error: ', error);
      onChangePasswordFailed(dispatch, error);
    }
  };
};
// User login success
const userLoginSuccess = (dispatch, response) => {
  dispatch({
    type: USER_LOGIN_SUCCESS,
    loginSuccess: true,
    payload: response,
  });
};

// User login failed
const userLoginFailed = (dispatch, response) => {
  dispatch({
    type: USER_LOGIN_FAILED,
    loginSuccess: false,
    payload: response?.message,
  });
};

// User signup
export const userSignupAction = body => {
  return async dispatch => {
    dispatch({ type: USER_SIGNUP, isLoading: true });
    try {
      const response = await signUpAPI(body);
      if (response.success === true) {
        userSignupSuccess(dispatch, response);
      } else {
        userSignupFailed(dispatch, response);
      }
    } catch (error) {
      console.log('signup action error: ', error);
      userSignupFailed(dispatch, error);
    }
  };
};

// User signup success
const userSignupSuccess = (dispatch, response) => {
  dispatch({
    type: USER_SIGNUP_SUCCESS,
    payload: response,
    isLoading: false,
    loginSuccess: true,
  });
};

// User signup failed
const userSignupFailed = (dispatch, response) => {
  dispatch({
    type: USER_SIGNUP_FAILED,
    payload: response.message,
    isLoading: false,
    loginSuccess: false,
  });
};

// OTP Verify
export const otpVerifyAction = (otp, userId) => {
  return async dispatch => {
    dispatch({ type: OTP_VERIFY, isLoading: true });
    try {
      const response = await verifyOtpAPI(otp, userId);
      console.log('otp res: ', response);
      if (response.success) {
        otpVerificationSuccess(dispatch, response);
      } else {
        otpVerificationFailed(dispatch, response);
      }
    } catch (error) {
      console.log('OTP Error: ', error);
      otpVerificationFailed(dispatch, error);
    }
  };
};

const otpVerificationSuccess = (dispatch, response) => {
  dispatch({
    type: OTP_VERIFY_SUCCESS,
    isOtpVerified: true,
    otpMessage: response.message,
  });
};

const otpVerificationFailed = (dispatch, response) => {
  dispatch({
    type: OTP_VERIFY_FAILED,
    isOtpVerified: false,
    otpMessage: response.message,
  });
};

// Resend OTP
export const resendOtpAction = userId => {
  return async dispatch => {
    dispatch({ type: RESEND_OTP, isLoading: true });
    try {
      const response = await resendOtpAPI(userId);
      console.log('otp res ', response);
      if (response.success) {
        onResendOtpSuccess(dispatch, response);
      } else {
        onResendOtpFailed(dispatch, response);
      }
    } catch (error) {
      onResendOtpFailed(dispatch, error);
    }
  };
};

const onResendOtpSuccess = (dispatch, response) => {
  dispatch({
    type: OTP_VERIFY_SUCCESS,
    isLoading: false,
    isOtpSent: true,
    resendMessage: response.message,
  });
};

const onResendOtpFailed = (dispatch, response) => {
  dispatch({
    type: OTP_VERIFY_FAILED,
    isLoading: false,
    isOtpSent: false,
    resendMessage: response.message,
  });
};

// Forgot Password
export const forgotPasswordAction = emailId => {
  return async dispatch => {
    dispatch({ type: FORGOT_PASSWORD, isLoading: true });
    try {
      const response = await forgotPasswordAPI(emailId);
      if (response.success) {
        onForgotPasswordSuccess(dispatch, response);
      } else {
        onForgotPasswordFailed(dispatch, response);
      }
    } catch (error) {
      onForgotPasswordFailed(dispatch, error);
    }
  };
};

const onForgotPasswordSuccess = (dispatch, response) => {
  dispatch({
    type: FORGOT_PASSWORD_SUCCESS,
    forgotMessage: response.message,
    isLoading: false,
    forgotPasswordSuccess: true,
  });
};
const onForgotPasswordFailed = (dispatch, response) => {
  dispatch({
    type: FORGOT_PASSWORD_FAILED,
    forgotMessage: response.message,
    isLoading: false,
    forgotPasswordSuccess: false,
  });
};
// ChangePassword

const onChangePasswordSuccess = (dispatch, response) => {
  dispatch({
    type: CHANGE_PASSWORD_SUCCESS,
    changeMessage: response.message,
    isLoading: false,
    changePasswordSuccess: true,
  });
};
const onChangePasswordFailed = (dispatch, response) => {
  dispatch({
    type: CHANGE_PASSWORD_FAILED,
    changeMessage: response.message,
    isLoading: false,
    changePasswordSuccess: false,
  });
};

export const userLogoutAction = body => {
  return async dispatch => {
    dispatch({ type: USER_LOGOUT });
    try {
      const response = await logoutAPI();
      console.log('Action logout', response);
      if (response.success) {
        userLogoutSuccess(dispatch, response);
      } else {
        userLogoutFailed(dispatch, response);
      }
    } catch (error) {
      console.log('error', error);
      userLogoutFailed(dispatch, error);
    }
  };
};

const userLogoutSuccess = (dispatch, response) => {
  dispatch({
    type: USER_LOGOUT_SUCCESS,
    loginSuccess: false,
    payload: response,
  });
};

// User login failed
const userLogoutFailed = (dispatch, response) => {
  dispatch({
    type: USER_LOGOUT_FAILED,
    loginSuccess: false,
    payload: response.message,
  });
};

