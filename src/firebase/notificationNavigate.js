import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  console.log('current', navigationRef.current);
  navigationRef.current?.navigate(name, params);
  this.currentscreen = name;
}

export function removeAllAndReplace(name, params) {
  navigationRef.current?.dispatch(StackActions.replace(name), params);
  this.currentscreen = name;
}
