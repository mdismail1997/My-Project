import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export default configStore = () => {
  const store = createStore(reducers, undefined, applyMiddleware(thunk));
  return store;
};
