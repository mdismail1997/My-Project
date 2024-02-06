import { CHANGE_PASSWORD, CHANGE_PASSWORD_FAILED, CHANGE_PASSWORD_SUCCESS, FORGOT_PASSWORD, FORGOT_PASSWORD_FAILED, FORGOT_PASSWORD_SUCCESS, OTP_VERIFY, OTP_VERIFY_FAILED, OTP_VERIFY_SUCCESS, RESEND_OTP, RESEND_OTP_FAILED, RESEND_OTP_SUCCESS, USER_LOGIN, USER_LOGIN_FAILED, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_LOGOUT_FAILED, USER_LOGOUT_SUCCESS, USER_SIGNUP, USER_SIGNUP_SUCCESS, USER_SIGNUP_FAILED, LOCATION_CHANGE } from '../actions/types';

const INITIAL_STATE = {
  loginSuccess: false,
  userData: [],
  errorMessage: '',
  isLoading: false,
  signUpSuccess: false,
  isOtpVerified: false,
  otpMessage: '',
  isOtpSent: false,
  resendMessage: '',
  forgotMessage: '',
  signUpError: '',
  forgotPasswordSuccess: false,
  userToken: '',
  changeMessage: '',
  logoutSuccess: false,
  logoutData: '',
  currentLocation:null,
  // changePasswordSuccess:false,
};

export default AuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, isLoading: true };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loginSuccess: action.loginSuccess,
        userData: action.payload,
        isLoading: false,
        userToken: action.payload?.data?.token,
      };
    case USER_LOGIN_FAILED:
      return {
        ...state,
        loginSuccess: action.loginSuccess,
        errorMessage: action.payload,
        isLoading: false,
      };
    case USER_SIGNUP:
      return { ...state, isLoading: action.isLoading };
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        signUpSuccess: action.loginSuccess,
        userData: action.payload,
        isLoading: action.isLoading,
      };
    case USER_SIGNUP_FAILED:
      return {
        ...state,
        signUpSuccess: action.loginSuccess,
        signUpError: action.payload,
        isLoading: action.isLoading,
      };
    case OTP_VERIFY:
      return { ...state, isLoading: action.isLoading };
    case OTP_VERIFY_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        isOtpVerified: action.isOtpVerified,
        otpMessage: action.otpMessage,
      };
    case OTP_VERIFY_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        isOtpVerified: action.isOtpVerified,
        otpMessage: action.otpMessage,
      };
    case RESEND_OTP:
      return { ...state, isLoading: action.isLoading };
    case RESEND_OTP_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        isOtpSent: action.isOtpSent,
        resendMessage: action.otpMessage,
      };
    case RESEND_OTP_FAILED:
      return {
        ...state,
        isLoading: action.isLoading,
        isOtpSent: action.isOtpSent,
        resendMessage: action.otpMessage,
      };
    case FORGOT_PASSWORD:
      return { ...state, isLoading: action.isLoading };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotMessage: action.forgotMessage,
        forgotPasswordSuccess: action.forgotPasswordSuccess,
        isLoading: action.isLoading,
      };
    case FORGOT_PASSWORD_FAILED:
      return {
        ...state,
        forgotMessage: action.forgotMessage,
        forgotPasswordSuccess: action.forgotPasswordSuccess,
        isLoading: action.isLoading,
      };
    case CHANGE_PASSWORD:
      return { ...state, isLoading: action.isLoading };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changeMessage: action.changeMessage,
        changePasswordSuccess: action.changePasswordSuccess,
        isLoading: action.isLoading,
      };
    case CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        changeMessage: action.changeMessage,
        changePasswordSuccess: action.changePasswordSuccess,
        isLoading: action.isLoading,
      };

    case USER_LOGOUT:
      return { ...state, isLoading: true };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        logoutSuccess: true,
        loginSuccess:false,
        userData: action.payload,
        logoutData:action.payload,
        isLoading: false,
      };
    case USER_LOGOUT_FAILED:
      return {
        ...state,
        logoutSuccess: action.loginSuccess,
        errorMessage: action.payload,
        isLoading: false,
      };
    default:
      return { ...state };


  }


};


