import * as React from 'react';
import {StackActions, NavigationAction} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  console.log('current', navigationRef.current);
  navigationRef.current?.navigate(name, params);
  this.currentscreen = name;
}

export function removeAllAndReplace(name, params) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name, params}],
  });
  this.currentscreen = name;
}
