import { createSlice } from "@reduxjs/toolkit";
import { sortByCreatedAt } from "../../util/helpers";

const initialState = {
  array: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.array.push(action.payload);
      state.array = sortByCreatedAt(state.array);
    },
    setNotifications: (state, action) => {
      state.array = sortByCreatedAt(action.payload);
    },
    readAllNotifications: (state) => {
      state.array.forEach((notification) => {
        notification.seen = true;
      });
    },
    readNotification: (state, action) => {
      const notification = state.array.find(
        (notification) => notification._id === action.payload
      );
      notification.seen = true;
    }
  },
});

export const { setNotification, setNotifications, readAllNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
