import { AnyAction } from 'redux';
import { InitialAppStateType } from '../../models';
import { SET_APP_THEME } from './actionTypes';

const initialState: InitialAppStateType = {
  colorScheme: 'dark',
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

    default:
      return state;
  }
};
