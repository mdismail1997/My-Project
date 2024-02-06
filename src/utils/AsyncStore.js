/**
 * File to store and retrieve data from AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: store data in async storage
// Key: key to be stored
// Value: value to be stored
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Async Error: ', error);
  }
};

// TODO: retrieve data from async storage
// Key: key to be retrieved
export const retrieveData = async key => {
  let data = {};
  try {
    const value = await AsyncStorage.getItem(key);

    data = value;
  } catch (error) {
    console.log('Async Error: ', error);
    data = error;
  }
  return data;
};
