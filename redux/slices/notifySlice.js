import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  hasNotify: false,
  title: "",
};

export const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    setNotify: (state, action) => {
      state.message = action.payload.message;
      state.hasNotify = true;
      state.title = action.payload.title;
    },
    clearNotify: () => initialState,
  },
});

export const { setNotify, clearNotify } = notifySlice.actions;

export default notifySlice.reducer;
