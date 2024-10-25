import { configureStore } from "@reduxjs/toolkit";
import devicesReducer from "./slices/devicesSlice";
import sequence6Reducer from "./slices/sequence6Slice";
import analogSettingsReducer from "./slices/analogSettingsSlice";

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    sequence6: sequence6Reducer,
    analogSettings: analogSettingsReducer,
  },
});

export default store;
