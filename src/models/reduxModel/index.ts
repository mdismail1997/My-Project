export interface InitialAppStateType {
  colorScheme: 'light' | 'dark';
}

export interface InitialUserDetailsType {
  userData: Record<string, any>;
}

export interface CombineReducersType {
  appDetails: InitialAppStateType;
  userDetails: InitialUserDetailsType;
}
