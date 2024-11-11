import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import devicesReducer from "./slices/devicesSlice";
import channelsReducer from "./slices/channelsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    devices: devicesReducer,
    channels: channelsReducer,
  },
});

export default store;
