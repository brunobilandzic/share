import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import errorReducer from "./slices/errorSlice";
import loadingReducer from "./slices/loadingSlice";
import notifyReducer from "./slices/notifySlice";
import notificationsReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    loading: loadingReducer,
    notify: notifyReducer,
    notifications: notificationsReducer,
  },
});
