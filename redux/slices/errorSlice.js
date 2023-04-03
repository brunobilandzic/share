import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasError: false,
  message: "",
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.hasError = true;
      state.message = action.payload.message;
    },
    clearError: () => initialState,
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
