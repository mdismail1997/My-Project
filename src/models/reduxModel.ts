import { ColorScheme } from './appTheme';

export interface InitialAppStateType {
  colorScheme: ColorScheme;
  appLanguage: 'en' | 'de';
}

export interface InitialUserDetailsType {
  userData: {
    [key: string]: any;
    favoriteTrainings: any[];
    cart: number;
    cartItems: any[];
  };
  isFetching: boolean;
}

export interface CombineReducersType {
  appDetails: InitialAppStateType;
  userDetails: InitialUserDetailsType;
}
