import { InitialUserDetailsType } from '../../models';
import {
  SET_USER_DETAILS,
  SET_FAVORITE_TRAINING,
  SET_CART_ITEM,
  SET_CART_ITEM_LIST,
} from './actionTypes';

// # redux side effect handle

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getCart, getFavoriteTraining } from '../../api/auth';

export const fetchUserDetails = () => {
  return async (
    dispatch: ThunkDispatch<Record<string, any>, unknown, AnyAction>
  ) => {
    dispatch(setFavoriteTraining([], true));
    try {
      const favoriteTrainings = await getFavoriteTraining();
      dispatch(setFavoriteTraining(favoriteTrainings.data.data ?? [], false));
    } catch (error) {
      dispatch(setFavoriteTraining([], false));
    }
  };
};

export const fetchCartItemList = () => {
  return async (
    dispatch: ThunkDispatch<Record<string, any>, unknown, AnyAction>
  ) => {
    dispatch(setCartItemList([], true));
    try {
      const response = await getCart();
      dispatch(setCartItemList(response.data.data.shopItems ?? [], false));
      dispatch(setCartItem(response.data.data.shopItems?.length ?? 0));
    } catch (error) {
      dispatch(setCartItemList([], false));
    }
  };
};

export const setUserData = (userData: InitialUserDetailsType['userData']) => ({
  type: SET_USER_DETAILS,
  payload: {
    data: userData,
  },
});

export const setFavoriteTraining = (
  favoriteTrainings: InitialUserDetailsType['userData']['favoriteTrainings'],
  isFetching: InitialUserDetailsType['isFetching']
) => ({
  type: SET_FAVORITE_TRAINING,
  payload: {
    data: favoriteTrainings,
    isFetching: isFetching,
  },
});

export const setCartItem = (
  CartItem: InitialUserDetailsType['userData']['cart'],
  isFetching: InitialUserDetailsType['isFetching'] = false
) => ({
  type: SET_CART_ITEM,
  payload: {
    data: CartItem,
    isFetching: isFetching,
  },
});

export const setCartItemList = (
  CartItems: InitialUserDetailsType['userData']['cartItems'],
  isFetching: InitialUserDetailsType['isFetching'] = false
) => ({
  type: SET_CART_ITEM_LIST,
  payload: {
    data: CartItems,
    isFetching: isFetching,
  },
});
