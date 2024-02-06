import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getDataFromStorage } from '../../storage';
import { InitialAppStateType } from '../../models';
import { SET_APP_THEME } from './actionTypes';
import { DOCTOR_APP_COLOR_SCHEME } from '../../constants/appConstant';

export const fetchAppDetails = () => {
  return async (
    dispatch: ThunkDispatch<InitialAppStateType, unknown, AnyAction>
  ) => {
    const selectedTheme = await getDataFromStorage(DOCTOR_APP_COLOR_SCHEME);
    dispatch(
      setAppTheme(
        (selectedTheme ?? 'light') as InitialAppStateType['colorScheme']
      )
    );
  };
};

export const setAppTheme = (appTheme: InitialAppStateType['colorScheme']) => ({
  type: SET_APP_THEME,
  payload: appTheme,
});
