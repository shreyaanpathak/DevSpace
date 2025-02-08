import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../Account/accountReducer';
import userReducer from './userSlice';
import repositoryReducer from './repositorySlice';
import fileReducer from './fileSlice';

const store = configureStore({
  reducer: {
    accountReducer,
    userReducer,
    repositoryReducer,
    fileReducer
  }
});

export default store;