import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasError: false,
  message: "",
  type: "",
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.hasError = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearError: () => initialState,
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
