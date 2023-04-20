import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  name: "",
  email: "",
  roles: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.roles = action.payload.roles;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload._id;
      state.joinedGroups = action.payload.joinedGroups;
    },
    removeUser: () => initialState,
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
