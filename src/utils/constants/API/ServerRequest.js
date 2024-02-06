import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY, API_TOKEN} from '../common';
import React from 'react';
import mmkv from '../mmkv/index.js';

// const token = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);

// const customerToken = async () => {
//   try {
//     return JSON.parse(await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN));
//   } catch (error) {}
// };

const createpost = async params => {
  const token = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);
  //console.log('createpost token', token);
  //console.log(params);
  //console.log('token', token);
  // const token = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
  var headers;
  if (params.tokenType == 'admin') {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN.ACCESS_TOKEN}`,
    };
    //console.log('headers true', headers);
  }
  if (params.tokenType == 'resetPassword') {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    };
  }
  if (params.tokenType == 'adminAdd') {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN.ACCESS_TOKEN}`,
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  //console.log('headers', headers);
  return await axios({
    method: 'post',
    url: params.url,
    headers: headers,
    data: params.body,
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

const createformdata = async params => {
  //console.log(params);
  const token = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);
  //const token = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
  console.log('createformdata token', token);
  var headers;
  if (params.tokenType == 'admin') {
    headers = {
      Authorization: `Bearer ${API_TOKEN.ACCESS_TOKEN}`,
    };
  } else {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return await axios({
    method: 'post',
    url: params.url,
    headers: headers,
    // data:params.body
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

const createGet = async params => {
  //console.log(params);
  //const token = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
  const token = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);
  //console.log('createGet token', token);

  var headers;
  if (params.tokenType == 'admin') {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN.ACCESS_TOKEN}`,
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return await axios({
    method: 'get',
    url: params.url,
    headers: headers,
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

const createPut = async params => {
  //console.log(params.body.custom_attributes);
  //const token = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMER_TOKEN);
  const token = mmkv.get(STORAGE_KEY.CUSTOMER_TOKEN);
  console.log('createPut token', token);
  var headers;
  if (params.tokenType == 'admin') {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN.ACCESS_TOKEN}`,
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return await axios({
    method: 'put',
    url: params.url,
    headers: headers,
    data: params.body,
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export {createpost, createGet, createPut, createformdata};
