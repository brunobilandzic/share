import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import errorReducer from "./slices/errorSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    loading: loadingReducer,
  },
});
