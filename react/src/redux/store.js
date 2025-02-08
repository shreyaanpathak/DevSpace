import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../Account/accountReducer';
import userReducer from './userSlice';
import repositoryReducer from './repositorySlice';
import fileReducer from './fileSlice';

const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    repository: repositoryReducer,
    file: fileReducer
  }
});

export default store;
