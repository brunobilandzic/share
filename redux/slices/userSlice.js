import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userInfo: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    removeUser: () => initialState,
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
