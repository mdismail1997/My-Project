import { AnyAction } from 'redux';
import { InitialUserDetailsType } from '../../models';
import {
  SET_USER_DETAILS,
  SET_FAVORITE_TRAINING,
  SET_CART_ITEM,
  SET_CART_ITEM_LIST,
} from './actionTypes';

const initialState: InitialUserDetailsType = {
  userData: {
    favoriteTrainings: [],
    cartItems: [],
    cart: 0,
  },
  isFetching: false,
};

export const userDetailsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        userData: { ...state.userData, ...action.payload.data },
        isFetching: action.payload.isFetching,
      };

    case SET_FAVORITE_TRAINING:
      return {
        ...state,
        userData: { ...state.userData, favoriteTrainings: action.payload.data },
        isFetching: action.payload.isFetching,
      };

    case SET_CART_ITEM:
      return {
        ...state,
        userData: { ...state.userData, cart: action.payload.data },
        isFetching: action.payload.isFetching,
      };

    case SET_CART_ITEM_LIST:
      return {
        ...state,
        userData: { ...state.userData, cartItems: action.payload.data },
        isFetching: action.payload.isFetching,
      };

    default:
      return state;
  }
};
