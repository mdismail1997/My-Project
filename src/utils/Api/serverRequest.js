import * as Api from './apiName';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../comon';

const customerToken = async () => {
  const token = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
  console.log('token on logout' + token);
  return token;
};

const register = async inputData => {
  var headers = {
    'Content-Type': 'application/json',
  };

  var config = {
    method: 'post',
    url: Api.registartion,
    headers: headers,
    data: inputData,
  };
  console.log('****Rider Register*******');
  console.log(config);
  return await axios(config)
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

const logout = async () => {
  console.log('logout');
  const token = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
  console.log('token on logout' + token);
  await AsyncStorage.removeItem(STORAGE_KEY.CUSTOMER_TOKEN);
};

export {register, logout};
