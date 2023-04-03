import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    breakLoading: () => initialState,
  },
});

export const { setLoading, breakLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
