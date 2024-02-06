import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../../Services/storage.js';

// export const setLng = async data => {
//   console.log('setland data', data);
//   const langData = JSON.stringify(data);
//   return await AsyncStorage.setItem('language', langData);
// };

export const setLng = async data => {
  // console.log('setLng data', data);
  await storage.store('language', data);
};

// export const getLng = () => {
//   return new Promise((resolve, reject) => {
//     AsyncStorage.getItem('language').then(data => {
//       resolve(JSON.parse(data));
//     });
//   });
// };

export const getLng = async () => {
  return storage.get('language');
};
