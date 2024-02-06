import axios, { AxiosRequestConfig } from 'axios';
import baseURL from '../config/baseUrl';
import { AddQuerySchema, User } from '../models';
import { getUserToken } from '../storage';

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(async (request: AxiosRequestConfig) => {
  const credential = await getUserToken();

  const updatedHeaders: Record<string, string> = {
    'x-access-token': credential ? credential.password : '',
  };
  request.headers = updatedHeaders;
  return request;
});

interface UserWithConfirmPassword extends User {
  confirmPassword: string;
}

const signUp = async (data: UserWithConfirmPassword) =>
  await axiosInstance.post('/user/signup', {
    email: data.publicID,
    phone: data.mobileNo,
    fullName: data.fullName,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

const login = async (data: unknown) =>
  await axiosInstance.post('/user/login', data);

const logout = async () => await axiosInstance.patch('/user/logout', {});

const forgotPassword = async (data: unknown) =>
  await axiosInstance.put('/user/forgotPassword', data);

const postQuery = async (data: AddQuerySchema & { [key: string]: unknown }) =>
  await axiosInstance.post('/user/contactUs/', data);

const getQuery = async () => await axiosInstance.get('/user/contactUs/');

const verifyOtp = async (data: unknown) =>
  await axiosInstance.put('/user/verifyOtp', data);

const resetPassword = async (data: unknown) =>
  await axiosInstance.put('/user/resetPassword', data);

const getCmsAboutUsPage = async () =>
  await axiosInstance.get('/user/cmsAboutUsPage');

const getCmsPage = async (slug: string) =>
  await axiosInstance.get(`/user/cms/page/${slug}`);

const getTrainingTitle = async () =>
  await axiosInstance.get('/user/trainingExtras');

const getTrainingSessions = async () =>
  await axiosInstance.get('/user/trainingSessions');

const getTrainingSessionByID = async (id: string) =>
  await axiosInstance.get(`/user/trainingSession/${id}`);

const getUser = async () => await axiosInstance.get('/user/getUser/');

const updateProfile = async (data: unknown) =>
  await axiosInstance.patch('/user/update-profile/', data);

const changePassword = async (data: unknown) =>
  await axiosInstance.patch('/user/change-password/', data);

const getFavoriteTraining = async () =>
  await axiosInstance.get('/user/get-favorite-training');

const getShopItems = async () => await axiosInstance.get('/user/shop');

const addToCart = async (data: { item: string | number }) =>
  await axiosInstance.post('/user/add-to-cart', data);

const getCart = async () => await axiosInstance.get('/user/get-cart/');

const removeFromCart = async (id: string) =>
  await axiosInstance.delete(`/user/remove-from-cart/${id}`);

const saveToCartForLater = async (id: string) =>
  await axiosInstance.post(`/user/save-to-cart-for-later/${id}`);

const removeFromSaved = async (id: string) =>
  await axiosInstance.delete(`/user/remove-from-saved/${id}`);

const moveToCart = async (id: string) =>
  await axiosInstance.post(`/user/move-to-cart/${id}`);

const getHorses = async () =>
  await axiosInstance.get('/user/get-horse-profile/');

const updateHorseProfile = async (data: unknown) =>
  await axiosInstance.post('/user/update-horse-profile/', data);

const deleteHorseProfile = async (data: unknown) =>
  await axiosInstance.post('/user/delete-horse-profile/', data);

const addToPlaylist = async (data: {
  playlistName: string;
  playlistFile: { id: string; [key: string]: any };
}) => await axiosInstance.post('/user/add-to-playlist/', data);

const deleteFromPlaylist = async (data: {
  playlistName: string;
  id: string;
  filename: string;
}) => await axiosInstance.post('/user/delete-from-playlist/', data);

export {
  signUp,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  postQuery,
  getQuery,
  getCmsAboutUsPage,
  getCmsPage,
  getTrainingTitle,
  getTrainingSessions,
  getTrainingSessionByID,
  getUser,
  updateProfile,
  getFavoriteTraining,
  getShopItems,
  changePassword,
  addToCart,
  removeFromCart,
  removeFromSaved,
  getCart,
  saveToCartForLater,
  moveToCart,
  getHorses,
  updateHorseProfile,
  deleteHorseProfile,
  addToPlaylist,
  deleteFromPlaylist,
};
