
import axios from 'axios';
import { BASE_URL } from '../Services/ApiConst';
import { getUserToken } from './DataStore';

//....for Get method Api......
export async function getApiCall(url, data, params) {
  const AccessToken =await getUserToken();
  console.log('Get Api Hit', url,AccessToken);
  const headers = {
    Accept: 'application/json',
    
    'x-access-token': AccessToken,
  };
  const response = axios.get(`${BASE_URL}${url}`, {data, params, headers});
  return response;
}

///......for Post method Api.....
export const postApiCall = async (url, data, params) => {
  let AccessToken =await getUserToken();
  console.log('Post Api Hit', url);
  let headers = {
    'Content-Type': 'application/json',
    'x-access-token': AccessToken,
  };
  const response = await axios.post(`${BASE_URL}${url}`, data, {
    params,
    headers,
  });
  return response;
};

///......for Post method Api in Form data.....
export const postApiCallFormData = async (url, data, params) => {
  let AccessToken = await getUserToken();
  let headers = {
    'Content-Type': 'multipart/form-data',
    'x-access-token': AccessToken,
  };
  const response = await axios.post(`${BASE_URL}${url}`, data, {
    params,
    headers,
  });
  return response;
};



