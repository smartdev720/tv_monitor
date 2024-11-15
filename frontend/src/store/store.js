import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import devicesReducer from "./slices/devicesSlice";
import channelsReducer from "./slices/channelsSlice";
import groupReducer from "./slices/groupSlice";
import selectedGlobalDataReducer from "./slices/selectedGlobalDataSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    devices: devicesReducer,
    channels: channelsReducer,
    groups: groupReducer,
    selectedGlobalData: selectedGlobalDataReducer,
  },
});

export default store;
