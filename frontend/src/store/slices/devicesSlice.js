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
  },
});

export const { setDevices } = devicesSlice.actions;
export default devicesSlice.reducer;
