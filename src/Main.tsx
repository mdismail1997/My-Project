import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, useColorScheme, Platform, Linking } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { ColorMode, NativeBaseProvider, extendTheme } from 'native-base';
import { RNAdvanceComponentProvider } from 'react-native-advance-components';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { PERMISSIONS } from 'react-native-permissions';
import { fetchAppDetails, setAppTheme } from './redux';
import {
  EQUIPRO_LAST_PLAYED_AUDIO_ID,
  THEME_PERSISTENCE_KEY,
} from './utils/constants';
import { linking } from './navigation/LinkingConfig';
import { RootNavigator } from './navigation/RootNavigation';
import { LoadingScreen } from './screens/LoadingScreen';
import {
  ThemeMode,
  CombineReducersType,
  InitialAppStateType,
  ColorScheme,
  PermissionType,
} from './models';
import {
  getUserToken,
  setDataIntoStorage,
  getDataFromStorage,
} from './storage';
import './language/i18n';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';
import { appTheme } from './colorScheme';
import { DropdownAlert } from './components/DropdownAlert';
import { checkAndRequestPermission } from './utils/utility';

interface HandleUrlType {
  url: string | null;
}

export const Main = () => {
  const themeMode = useColorScheme() as ThemeMode;
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const dispatch =
    useDispatch<ThunkDispatch<InitialAppStateType, unknown, AnyAction>>();
  const { i18n } = useTranslation();

  const onlyOnMount = useRef<boolean>(true);
  const isFirstEffectCall = useRef<boolean>(false);
  const isMount = useRef<boolean>(true);
  const navigationRef = useNavigationContainerRef();

  const [theme, setTheme] = useState(appTheme.light);
  const [isReady, setIsReady] = useState(false);
  const [isLogIn, setIsLogIn] = useState<boolean>(false);
  const [isOffline, setOfflineStatus] = useState(false);

  const handleLogIn = async () => {
    const credential = await getUserToken();
    if (credential?.password) {
      setIsLogIn(true);
    }
  };

  const handleUrl = async (data: HandleUrlType) => {
    if (data.url === 'trackplayer://notification.click') {
      const audioID = await getDataFromStorage(EQUIPRO_LAST_PLAYED_AUDIO_ID);
      const canOpen = await Linking.canOpenURL(
        `equipro://equipro/details/${audioID}/audio`
      );
      if (canOpen) {
        await Linking.openURL(`equipro://equipro/details/${audioID}/audio`);
      }
    }
  };

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    Linking.getInitialURL().then((url) => {
      console.log('=========>', url);
      if (url) {
        handleUrl({ url: url });
      }
    });
    const emitterSubscription = Linking.addEventListener('url', handleUrl);

    return () => {
      removeNetInfoSubscription();
      emitterSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (onlyOnMount.current) {
      const permission = Platform.select({
        android: [
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ],
        ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY],
      });

      checkAndRequestPermission(permission as PermissionType[]);
      onlyOnMount.current = false;
    }
  }, []);

  useEffect(() => {
    // # tracking device theme change
    const setAdminData = async () => {
      await setDataIntoStorage(THEME_PERSISTENCE_KEY, themeMode);
      dispatch(setAppTheme(themeMode));
      setTheme(appTheme[themeMode]);
    };
    if (isFirstEffectCall.current) {
      setAdminData();
    }
    isFirstEffectCall.current = true;
  }, [dispatch, themeMode]);

  // ##### Set theme ####
  useEffect(() => {
    setTheme(appTheme[globalState.colorScheme]);
  }, [globalState.colorScheme]);
  // #########

  // #### Set Language ####
  useEffect(() => {
    i18n.changeLanguage(globalState.language);
  }, [globalState.language, i18n]);
  // #########

  useEffect(() => {
    // # Restoring app theme and language from previous use
    isMount.current = true;
    if (isMount.current === true) {
      handleLogIn();
      dispatch(fetchAppDetails());
      const restoreState = async () => {
        try {
          const themeName = await getDataFromStorage(THEME_PERSISTENCE_KEY);
          if (themeName !== null) {
            dispatch(setAppTheme(themeName as ColorScheme));
            setTheme(appTheme[themeName as ColorScheme]);
          } else {
            dispatch(setAppTheme(themeMode));
            dispatch(setAppTheme(themeMode));
          }
        } catch (e) {
          // Ignore
        }

        setIsReady(true);
      };

      restoreState();
    }

    return () => {
      isMount.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colorModeManager = {
    get: async (): Promise<ColorMode> => {
      try {
        let val = await getDataFromStorage(THEME_PERSISTENCE_KEY);
        setTheme(val !== null ? appTheme[val as ColorScheme] : appTheme.light);
        return val === 'blue' ? 'dark' : (val as ColorMode);
      } catch (e) {
        console.log('===========Color Change============', e);
        // # Need to update
        return globalState.colorScheme === 'blue'
          ? 'dark'
          : globalState.colorScheme;
      }
    },
    set: async (value: ThemeMode) => {
      try {
        await setDataIntoStorage(THEME_PERSISTENCE_KEY, value);
      } catch (e) {
        console.log('++++++++++++++++', e);
      }
    },
  };

  // ####### Add custom font as default font ########## //

  const NBTheme = extendTheme({
    fontConfig: {
      Poppins: {
        100: {
          normal: 'Poppins-Thin',
          italic: 'Poppins-ThinItalic',
        },
        200: {
          normal: 'Poppins-ExtraLight',
          italic: 'Poppins-ExtraLightItalic',
        },
        300: {
          normal: 'Poppins-Light',
          italic: 'Poppins-LightItalic',
        },
        400: {
          normal: 'Poppins-Regular',
          italic: 'Poppins-Italic',
        },
        500: {
          normal: 'Poppins-Medium',
          italic: 'Poppins-MediumItalic',
        },
        600: {
          normal: 'Poppins-SemiBold',
          italic: 'Poppins-SemiBoldItalic',
        },
        700: {
          normal: 'Poppins-Bold',
          italic: 'Poppins-BoldItalic',
        },
        800: {
          normal: 'Poppins-ExtraBold',
          italic: 'Poppins-ExtraBoldItalic',
        },
        900: {
          normal: 'Poppins-Black',
          italic: 'Poppins-BlackItalic',
        },
      },
    },
    fonts: {
      heading: 'Poppins',
      body: 'Poppins',
      mono: 'Poppins',
    },
    colors: {
      primary: {
        50: '#e8eefd',
        100: '#b9cdf9',
        200: '#8aacf4',
        300: '#5b8af0',
        400: '#2d69ec',
        500: '#1350d2',
        600: '#0f3ea4',
        700: '#0b2c75',
        800: '#061b46',
        900: '#020917',
      },
    },
  });

  // ####### End of adding custom font as default font ########## //

  if (!isReady) {
    return null;
  }

  return (
    <NativeBaseProvider theme={NBTheme} colorModeManager={colorModeManager}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <RNAdvanceComponentProvider mode={themeMode}>
        <SafeAreaProvider>
          {isOffline && (
            <DropdownAlert
              isVisible={isOffline}
              status="error"
              message="Oops, you are offline!"
            />
          )}
          <NavigationContainer
            ref={navigationRef}
            theme={theme}
            linking={linking}
            fallback={<LoadingScreen />}
            documentTitle={{
              formatter: (options, route) => `${options?.title ?? route?.name}`,
            }}
          >
            <RootNavigator isLogin={isLogIn} />
          </NavigationContainer>
        </SafeAreaProvider>
      </RNAdvanceComponentProvider>
    </NativeBaseProvider>
  );
};
