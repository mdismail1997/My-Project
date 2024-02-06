import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {base_url} from './constants';

//....for Get method Api......
export async function getApicall(url, data, params) {
  const AccessToken = await AsyncStorage.getItem('token');
  console.log('Get Api Hit', url);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${AccessToken}`,
  };
  const response = axios.get(`${base_url}${url}`, {data, params, headers});
  return response;
}

///......for Post method Api.....
export const postApiCall = async (url, data, params) => {
  let AccessToken = await AsyncStorage.getItem('token');
  console.log('Post Api Hit', url);
  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AccessToken}`,
  };
  const response = await axios.post(`${base_url}${url}`, data, {
    params,
    headers,
  });
  return response;
};

///......for Post method Api in Form data.....
export const postApiCallFormData = async (url, data, params) => {
  let AccessToken = await AsyncStorage.getItem('token');
  let headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${AccessToken}`,
  };
  const response = await axios.post(`${base_url}${url}`, data, {
    params,
    headers,
  });
  return response;
};

// export async function postApiCall(url, data, params) {
//     const token = await AsyncStorage.getItem('token');
//     const headers = token == null ? {
//         Accept: 'application/json',
//         'Content-Type': 'multipart/form-data'
//     } : {
//         Accept: 'application/json',
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${token}`
//     };
//     return axios.post(`${base_url}${url}`, data, { params, headers });
// }

///......for Put method Api.....
export function putApiCall(url, payload, header) {
  return axios.put(`${base_url}${url}`, payload);
}

////......from Delete method Api.......
export function deleteApiCall(url, payload, header) {
  return axios.delete(`${base_url}${url}`, payload);
}
