import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import HomeReducer from './HomeReducer';
import JobReducer from './JobReducer';

import ProfileReducer from './ProfileReducer';

export default combineReducers({
  Auth: AuthReducer,
  Home: HomeReducer,
  Profile: ProfileReducer,
  Job: JobReducer,
});
