import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices(state, action) {
      state.devices = action.payload;
    },
    clearDevices(state) {
      state.devices = [];
    },
    pushDevices(state, action) {
      state.devices = [...state.devices, action.payload];
    },
  },
});

export const { setDevices, clearDevices, pushDevices } = devicesSlice.actions;
export default devicesSlice.reducer;
