import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type RootTabParamList = {
  Home: undefined;
  Training: undefined;
  Library: undefined;
  Profile: undefined;
};

export type RootDrawerParamList = {
  DrawerHome: NavigatorScreenParams<RootTabParamList> | undefined;
  ChangePassword: undefined;
  Membership: undefined;
  PostAQuery: undefined;
  MyFavourite: undefined;
  About: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  Notification: undefined;
  Setting: NavigatorScreenParams<SettingStackParams> | undefined;
  Shop: undefined;
  PlayList: undefined;
};

export type SettingStackParams = {
  ChooseTheme: undefined;
  ChooseLanguage: undefined;
};

export type RootStackParamList = {
  NotFound: undefined;
  SelectLanguage: undefined;
  LogIn: undefined;
  SignUp: undefined;
  VerifyOTP: {
    email: string;
  };
  UpdatePassword: {
    email: string;
  };
  IntroSlider: undefined;
  EquiProfession: undefined;
  Dashboard: NavigatorScreenParams<RootDrawerParamList> | undefined;
  DetailsScreen: {
    id: string;
    name?: string;
    imageURL?: string;
    description?: string;
    fileType?: string;
    file?: Record<string, any>;
    tab?: string;
  };
  Search: undefined;
  AddQuery: undefined;
  QueryDetails: {
    queryId: string;
    title?: string;
    description?: string;
    reply?: string;
  };
  ProductDetails: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageURL: string;
    alt: string;
  };
  Cart: undefined;
  Checkout: undefined;
  ChooseTheme: undefined;
  ChooseLanguage: undefined;
};

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList, Screen>,
    StackScreenProps<RootStackParamList>
  >;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    DrawerScreenProps<RootDrawerParamList>
  >;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, Screen>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
