import { combineReducers } from '@reduxjs/toolkit';
import { burgerReducer, burgerSlice } from '../store/slices/burgerSlice';

export const rootReducer = combineReducers({
  [burgerSlice.name]: burgerReducer
});
