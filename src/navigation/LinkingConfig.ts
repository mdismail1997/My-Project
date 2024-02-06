import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '../types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'equipro://equipro',
    'http://equipro-coach.com',
    'https://equipro-coach.com',
    'http://www.equipro-coach.com',
    'https://www.equipro-coach.com',
  ],
  config: {
    screens: {
      SelectLanguage: 'select-language',
      LogIn: 'login',
      SignUp: 'signup',
      NotFound: 'notfound',
      Dashboard: {
        path: 'dashboard',
        screens: {
          DrawerHome: {
            path: 'drawer-home',
            screens: {
              Home: 'home',
              Training: 'training',
              Library: 'library',
              Profile: 'profile',
            },
          },
          About: 'about',
          ChangePassword: 'change-password',
          Membership: 'membership',
          Notification: 'notification',
          PostAQuery: 'post-query',
          PrivacyPolicy: 'privacy-policy',
          MyFavourite: 'favourite',
          TermsAndConditions: 'term',
          Shop: 'shop',
          PlayList: 'playList',
          Setting: {
            path: 'setting',
            screens: {
              ChooseLanguage: 'choose-language',
              ChooseTheme: 'choose-theme',
            },
          },
        },
      },
      AddQuery: 'add-query',
      DetailsScreen: 'details/:id?/:tab?',
      EquiProfession: 'equi-profession',
      IntroSlider: 'intro',
      QueryDetails: 'query-details',
      Search: 'search',
      UpdatePassword: 'update-password',
      VerifyOTP: 'verify-otp',
      Cart: 'cart',
      Checkout: 'checkout',
      ProductDetails: 'product-details/:id',
    },
  },
};
