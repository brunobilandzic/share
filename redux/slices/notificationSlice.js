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
    readNotification: (state, action) => {
      action.payload.readen.forEach((readen) => {
        state.array.forEach((notification) => {
          if (notification.id === readen) {
            notification.read = true;
          }
        });
      });
    },
  },
});

export const { setNotification, setNotifications, readNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
