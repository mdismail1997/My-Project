import mmkv from '../../../utils/constants/mmkv/index.js';

export const setLng = data => {
  // data = JSON.stringify(data);
  // return AsyncStorage.setItem('language', data);
  mmkv.store('language', data);
  // console.log('d', d);
  // return d;
};

// export const getLng = () => {
//   return new Promise((resolve, reject) => {
//     AsyncStorage.getItem('language').then(data => {
//       resolve(JSON.parse(data));
//     }

//     );
//   });
// };

export const getLng = () => {
  return mmkv.get('language');
};
