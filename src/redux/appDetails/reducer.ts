import { AnyAction } from 'redux';
import { InitialAppStateType } from '../../models';
import { SET_APP_THEME, SET_APP_LANGUAGE } from './actionTypes';

const initialState: InitialAppStateType = {
  colorScheme: 'dark',
  appLanguage: 'en',
};

export const appDetailsReducer = (
  state = initialState,
  action: AnyAction
): InitialAppStateType => {
  switch (action.type) {
    case SET_APP_THEME:
      return {
        ...state,
        colorScheme: action.payload,
      };

    case SET_APP_LANGUAGE:
      return {
        ...state,
        appLanguage: action.payload,
      };

    default:
      return state;
  }
};
