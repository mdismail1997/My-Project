/**
 * File to store specific key value pair in AsyncStore
 */

import {retrieveData, storeData} from './AsyncStore';

export const setUser = async data => {
  return await storeData('USER', data);
};

export const getUser = async () => {
  return await retrieveData('USER');
};

export const setUserLogin = async isLogin => {
  await storeData('USER_LOGIN', isLogin);
};

export const getUserLogin = async () => {
  return await retrieveData('USER_LOGIN');
};

export const setIsBioEnable = async value => {
  await storeData('BIO_AUTH', value);
};

export const getIsBioEnable = async () => {
  return await retrieveData('BIO_AUTH');
};

export const setUserToken = async value => {
  return await storeData('USER_TOKEN', value);
};

export const getUserToken = async () => {
  return await retrieveData('USER_TOKEN');
};
