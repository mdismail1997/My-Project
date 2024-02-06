import {PermissionsAndroid} from 'react-native';

export const locationPermission = () => {
  try {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  } catch (error) {
    console.log('location error ', error);
  }
};
