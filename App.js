import React, { useEffect, useState } from 'react';
import { BackHandler, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/Navigations/StackNavigator';
const linking = {
  prefixes: ['mytraders://'],
  config: {
    screens: {
      Payment: {
        path: 'payment'
      },
    },
  },
};

const App = () => {

  return (
    
     <NavigationContainer linking={linking}>
      <StackNavigator />
      
    </NavigationContainer>
   
  );
};

export default App;
