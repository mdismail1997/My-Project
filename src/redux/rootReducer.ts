import { combineReducers } from 'redux';
import { CombineReducersType } from '../models';
import { appDetailsReducer } from './appDetails/reducer';
import { userDetailsReducer } from './userDetails/reducer';

export const rootReducer = combineReducers<CombineReducersType>({
  appDetails: appDetailsReducer,
  userDetails: userDetailsReducer,
});
