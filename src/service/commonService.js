import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  console.log('Storing ', key);
  console.log(value);
  try {
    let data = await AsyncStorage.setItem(key, value);
    return data;
  } catch (e) {
    // saving error
  }
};

const getData = async key => {
  try {
    let value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    } else return 'Value not set for ' + key + ' in localstorage';
  } catch (e) {
    // error reading value
  }
};

export {storeData, getData};
