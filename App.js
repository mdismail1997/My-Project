import React from 'react';
import {AuthContext} from './src/views/components/context';
import {STORAGE_KEY} from './src/utils/constants/common';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import Toast from 'react-native-toast-message';

import {DrawerContent} from './src/views/navigator/DrawerContent';

import MainTabScreen from './src/views/navigator/MainTabScreen';
import RootStackScreen from './src/views/navigator/RootStackScreen';

import SplashScreen from 'react-native-splash-screen';

import {I18nManager, LogBox, BackHandler} from 'react-native';
import Splash2 from './src/views/screens/SplashScreen2/index.js';
import OfflineNotice from './src/views/components/OfflineNotice.js';
import {createGet} from './src/utils/constants/API/ServerRequest.js';

import * as commonUrl from './src/utils/constants/API/commonUrl';
import cache from './src/utils/constants/cache.js';
import mmkv from './src/utils/constants/mmkv/index.js';
import SellerNotice from './src/views/components/SellerNotice.js';
import {navigationRef} from './src/views/navigator/NavigationRef.js';
import {getLng} from './src/views/components/lng/changeLng';
import strings from './src/views/components/lng/LocalizedStrings';
import {Alert} from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const Drawer = createDrawerNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    //userData: {},
    //counter: 1,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
          //userData: action.email,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'SET_LOADING':
        return {
          ...prevState,
          isLoading: action.loading,
        };
      // case 'PROFILE_IMAGE':
      //   return {
      //     ...prevState,
      //     userData: action.profile_image,
      //   };
      // case 'UPDATE_COUNTER':
      //   return {
      //     ...prevState,
      //     counter: initialLoginState.counter + 1,
      //   };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  console.log('loginState-', loginState);
  const authContext = React.useMemo(
    () => ({
      signIn: async foundUser => {
        //dispatch({type: 'SET_LOADING', loading: true});
        //console.log('foundUser', foundUser);
        try {
          // const userToken = await AsyncStorage.getItem(
          //   STORAGE_KEY.CUSTOMER_TOKEN,
          // );
          const userToken = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);
          console.log('userToken', userToken);
          //setLoading(false);
          dispatch({
            type: 'LOGIN',
            id: foundUser.id,
            token: userToken,
            //email: foundUser.email,
          });
          //dispatch({type: 'SET_LOADING', loading: false});
        } catch (e) {
          console.log(e);
        }
      },
      signOut: async () => {
        try {
          //await AsyncStorage.removeItem(STORAGE_KEY.CUSTOMER_TOKEN);
          // await AsyncStorage.removeItem(STORAGE_KEY.CUSTOMER_DETAILS);

          mmkv.remove(STORAGE_KEY.CUSTOMER_TOKEN);
          mmkv.remove(STORAGE_KEY.CUSTOMER_DETAILS);
          mmkv.remove(STORAGE_KEY.isSeller);
          mmkv.remove(STORAGE_KEY.isUploaded);
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },

      signUp: () => {
        // setUserToken('fgkj');
        // setIsLoading(false);
      },
      toggleTheme: () => {
        // setIsDarkTheme( isDarkTheme => !isDarkTheme );
      },
      // userImage: () => {
      //   dispatch({
      //     type: 'PROFILE_IMAGE',
      //     userData: action.profile_image,
      //     //email: foundUser.email,
      //   });
      // },
      loginState: loginState,
      // updateCounter: () => {
      //   dispatch({type: 'UPDATE_COUNTER'});
      // },
    }),
    [],
  );

  const backAction = () => {
    Alert.alert('', strings.ARE_YOU_SURE_YOU_WANT_TO_EXIT, [
      {
        text: `${strings.CANCEL}`,
        onPress: () => null,
        style: 'cancel',
      },
      {text: `${strings.YES}`, onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    authUser();
    loadFonts();
    SplashScreen.hide();
  }, []);

  const loadFonts = async () => {
    //dispatch({ type: "SET_LOADING", loading: true });
    try {
      const lngData = getLng();
      if (lngData) {
        strings.setLanguage(lngData);
      }
      if (lngData === 'en') {
        I18nManager.forceRTL(false);
      }
      if (lngData === 'ar') {
        I18nManager.forceRTL(true);
      }
      console.log('selected Language data==>>>', lngData);
    } catch (error) {
      console.log(`loadFonts error`, error);
    } finally {
      //dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const authUser = async () => {
    //console.log(`authuser call`);
    dispatch({type: 'SET_LOADING', loading: true});

    try {
      // let foundUser = JSON.parse(
      //   await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_DETAILS),
      // );
      let foundUser = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);
      // let usertoken = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
      let usertoken = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);
      //console.log('usertoken', usertoken);
      if (usertoken != null) {
        let result = await createGet({
          tokenType: 'self',
          url: commonUrl.customerDetails,
        });
        if (result.status === 200) {
          //await cache.store(STORAGE_KEY.CUSTOMER_DETAILS, result.data);

          mmkv.store(STORAGE_KEY.CUSTOMER_DETAILS, result.data);
          dispatch({
            type: 'LOGIN',
            id: foundUser.id,
            token: usertoken,
          });
          //dispatch({type: 'SET_LOADING', loading: false});
        } else {
          Toast.show({
            text1: `Session expired please login again`,
            type: 'error',
          });
          dispatch({type: 'LOGOUT'});
          //dispatch({type: 'SET_LOADING', loading: false});
        }
      } else {
        Toast.show({
          text1: `Session expired please login again`,
          type: 'error',
        });
        dispatch({type: 'LOGOUT'});
        //dispatch({type: 'SET_LOADING', loading: false});
      }
    } catch (error) {
      console.log(`error=>>>>app js`, error);
      dispatch({type: 'SET_LOADING', loading: false});
      dispatch({type: 'LOGOUT'});
      Toast.show({
        text2: `${error}`,
        text1: `Session expired please login again`,
        type: 'error',
      });
      authContext.signOut();
    } finally {
      dispatch({type: 'SET_LOADING', loading: false});
    }
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#ffffff',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#cfcfcf',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  if (loginState.isLoading)
    return (
      <Splash2 />
      // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      //   <ActivityIndicator size={'large'} />
      // </View>
    );

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <OfflineNotice />
        <NavigationContainer theme={theme} ref={navigationRef}>
          {loginState.userToken !== null ? (
            <>
              {/* <SellerNotice /> */}
              <Drawer.Navigator
                drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen
                  name="HomeScreen"
                  options={{
                    headerShown: false,
                    //drawerPosition: "right",
                  }}
                  component={MainTabScreen}
                />
              </Drawer.Navigator>
            </>
          ) : (
            <RootStackScreen />
          )}
        </NavigationContainer>
        <Toast />
      </AuthContext.Provider>
    </PaperProvider>
  );
};
export default App;
