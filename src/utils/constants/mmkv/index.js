import {MMKV} from 'react-native-mmkv';

import moment from 'moment';

const prefix = 'cache';
const expiryInMinutes = 5;

const storage = new MMKV();

const store = (key, value) => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  } finally {
    console.log(`store successfull`);
  }
};

const get = key => {
  try {
    const value = storage.getString(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.log(error);
  }
};

const remove = key => {
  try {
    storage.delete(key);
  } catch (e) {
    console.log(e);
  }
};

const listener = key => {
  storage.addOnValueChangedListener(key => {
    const newValue = storage.getString(key);
    console.log(`"${key}" new value: ${newValue}`);
  });
};

const storeTemp = (key, value) => {
  try {
    const obj = {
      value,
      timestamp: new Date(),
    };
    storage.set(prefix + key, JSON.stringify(obj));
  } catch (error) {
    console.log(`error storing storage data storeTemp`, error);
  } finally {
    //console.log(`storeTemp successfull`);
  }
};

const isExpired = item => {
  const now = moment(Date.now());
  const storedTime = moment(item.timestamp);
  return now.diff(storedTime, 'minutes') > expiryInMinutes;
};

const getTemp = key => {
  try {
    const data = storage.getString(prefix + key);
    //console.log('data getTemp', data);
    const item = JSON.parse(data);
    //console.log('item', item.value);
    if (!item) {
      // console.log(`no item`);
      return null;
    }
    if (isExpired(item)) {
      console.log(`isexpired`);
      storage.delete(prefix + key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.log(`error getting storage data getTemp`, error);
  } finally {
    //console.log(`getTemp Successful`);
  }
};

export default {
  store,
  get,
  remove,
  getTemp,
  storeTemp,
  listener,
};
