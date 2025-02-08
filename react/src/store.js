import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/accountReducer";

const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export default store;
