import {configureStore} from '@reduxjs/toolkit';
import CounterSlice from './CounterSlice';
import {Listreducer} from './Slice';
import productSearchReducer from './slices/Product/productSearchSlice';
import productreducer from "./slices/Product/productSlice"
import categoryReducer from "./slices/Product/categorySlice"
import productdetailsReducer from "./slices/Product/productDetailsSlice"

const reducer = {
  User: CounterSlice,
  productData: productreducer, 
  categoryData: categoryReducer,
  // List: Listreducer,
  productDetailsData: productdetailsReducer,
  productSearchData: productSearchReducer,
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
