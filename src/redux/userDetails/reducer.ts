import { AnyAction } from 'redux';
import { InitialUserDetailsType } from '../../models';
import { SET_USER_DETAILS, SET_TEMP_USER_TYPE } from './actionTypes';

const initialState: InitialUserDetailsType = {
  userData: {},
  temporaryUserType: 'Patient',
};

export const userDetailsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        userData: action.payload,
      };
    case SET_TEMP_USER_TYPE:
      return {
        ...state,
        temporaryUserType: action.payload,
      };

    default:
      return state;
  }
};
