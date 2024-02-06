import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { linking } from './navigation/LinkingConfig';
import { CombinedDarkTheme, CombinedDefaultTheme } from './constants/theme';
import { LoadingScreen } from './screens';
import { RootNavigator } from './navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase/supabaseClient';

export const Main = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const navigationRef = useNavigationContainerRef();

  const [theme, setTheme] = useState(CombinedDefaultTheme);
  const [isLogIn, setIsLogIn] = useState({});
  const [isReady, setIsReady] = useState(false);

  const handleLogIn = async () => {
    const credential = await AsyncStorage.getItem('role');
    const token = await AsyncStorage.getItem('authtoken');
    const supabaseToken = await AsyncStorage.getItem('supabaseAuthToken');
    if (supabaseToken === null) {
      setIsLogIn({ role: credential, isLogIn: false });
      setIsReady(true);
      return;
    }
    const { error, user } = await supabase.auth.api.getUser(supabaseToken);

    if (error) {
      console.warn('supabase error=======>', error);
    }

    console.warn('user=======>', user);

    console.log('credencial------>', credential, token);
    if (token !== null && credential !== undefined && user !== null) {
      setIsLogIn({ role: credential, isLogIn: true });
    } else {
      setIsLogIn({ role: credential, isLogIn: false });
    }
    setIsReady(true);
  };

  useEffect(() => {
    setTheme(isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme);
  }, [isDarkTheme]);

  useEffect(() => {
    handleLogIn();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <PaperProvider theme={theme}>
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
      </PaperProvider>
    </SafeAreaProvider>
  );
};
