import {PermissionsAndroid} from 'react-native';

export const cameraPermission = () => {
  try {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  } catch (error) {
    console.log('location error ', error);
  }
};
