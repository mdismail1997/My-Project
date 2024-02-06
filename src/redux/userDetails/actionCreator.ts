import { InitialUserDetailsType } from '../../models';
import { SET_USER_DETAILS, SET_TEMP_USER_TYPE } from './actionTypes';

// # redux side effect handle

/* import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getDataFromStorage } from '../../storage'; */

/* export const fetchUserDetails = () => {
  return async (
    dispatch: ThunkDispatch<Record<string, any>, unknown, AnyAction>
  ) => {
    dispatch(setUserData(userData));
  };
}; */

export const setUserData = (userData: InitialUserDetailsType['userData']) => ({
  type: SET_USER_DETAILS,
  payload: userData,
});

export const setTempUserType = (
  tempUserType: InitialUserDetailsType['temporaryUserType']
) => ({
  type: SET_TEMP_USER_TYPE,
  payload: tempUserType,
});
