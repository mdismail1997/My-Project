import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '../types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['doctorapp://doctorapp'],
  config: {
    screens: {
      Intro: 'intro',
      LogIn: 'login',
      SignUp: 'signup',
      NotFound: 'notfound',
      ResetPass: 'resetpass',
      OtpVerify: 'otp-verify',
    },
  },
};
