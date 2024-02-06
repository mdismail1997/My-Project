import AsyncStorage from '@react-native-async-storage/async-storage';

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

const get = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.log(error);
  }
};

const remove = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

const removeAppKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    console.log(`Keys: ${keys}`); // Just to see what's going on
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    console.log(e);
  }
  console.log('Done');
};

export default {
  store,
  get,
  remove,
  removeAppKeys,
};
