import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getDataFromStorage } from '../../storage';
import { InitialAppStateType, ColorScheme } from '../../models';
import { EQUIPRO_SELECTED_LANGUAGE } from '../../utils/constants';
import { SET_APP_THEME, SET_APP_LANGUAGE } from './actionTypes';

export const fetchAppDetails = () => {
  return async (
    dispatch: ThunkDispatch<InitialAppStateType, unknown, AnyAction>
  ) => {
    const selectedLanguage = await getDataFromStorage(
      EQUIPRO_SELECTED_LANGUAGE
    );
    dispatch(
      setAppLanguage(
        (selectedLanguage ?? 'en') as InitialAppStateType['appLanguage']
      )
    );
  };
};

export const setAppTheme = (appTheme: ColorScheme) => ({
  type: SET_APP_THEME,
  payload: appTheme,
});

export const setAppLanguage = (language: 'en' | 'de') => ({
  type: SET_APP_LANGUAGE,
  payload: language,
});
