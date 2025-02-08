import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  profile: null,
  sessionChecked: false
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSessionChecked: (state, action) => {
      state.sessionChecked = action.payload;
    }
  },
});

export const { 
  setCurrentUser, 
  setProfile, 
  setError, 
  setLoading,
  setSessionChecked 
} = accountSlice.actions;

export default accountSlice.reducer;
