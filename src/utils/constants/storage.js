import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const prefix = 'cache';
const expiryInMinutes = 5;

const store = async (key, value) => {
  try {
    const obj = {
      value,
      timestamp: new Date(),
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(obj));
  } catch (error) {
    console.log(`error storing storage data`, error);
  }
};

const isExpired = item => {
  const now = moment(Date.now());
  const storedTime = moment(item.timestamp);
  return now.diff(storedTime, 'minutes') > expiryInMinutes;
};

const get = async key => {
  try {
    const data = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(data);
    if (!item) return null;
    if (isExpired(item)) {
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }
    return item.value;
  } catch (error) {
    console.log(`error getting storage data`, error);
  }
};

export default {
  store,
  get,
};
