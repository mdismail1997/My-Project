import axios from 'axios';
import { ADMIN_TOKEN, BASE_URL } from './Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetRequest = async (url, data, params, type) => {
  let AccessToken = await AsyncStorage.getItem('traderToken');
  let headers =
    type == 'admin'
      ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      }
      : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AccessToken}`,
      };
  const responce = await axios.get(`${BASE_URL}${url}`, {
    data,
    params,
    headers,
  });
  return responce.data;
};

export const PostRequest = async (url, data, params, type) => {
  let AccessToken = await AsyncStorage.getItem('traderToken');
  let headers =
    type == 'admin'
      ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      }
      : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AccessToken}`,
      };
  const responce = await axios.post(`${BASE_URL}${url}`, data, {
    params,
    headers,
  });
  return responce.data;
};

export const PutRequest = async (url, data, params, type) => {
  let AccessToken = await AsyncStorage.getItem('traderToken');
  let headers =
    type == 'admin'
      ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      }
      : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AccessToken}`,
      };
  const responce = await axios.put(`${BASE_URL}${url}`, data, {
    params,
    headers,
  });
  return responce.data;
};

export const FetchPostRequest = async (url, data, params) => {
  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  };
  const responce = await axios.post(`${BASE_URL}${url}`, data, {
    params,
    headers,
  });
  return responce.data;
};
export const deleteRequest = async(url,type) => {
  let AccessToken = await AsyncStorage.getItem('traderToken')
  let headers = type == 'admin' ? {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  }
  : {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AccessToken}`,
  };
  const response = await axios.delete(`${BASE_URL}${url}`, {
    headers
  })
  try {
    if(response.status === 200) {
      return response.data
    }
  } catch (error) {
    return error
  }
}

