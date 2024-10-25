import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  analogSettings: [],
};

const analogSettingsSlice = createSlice({
  name: "analogSettings",
  initialState,
  reducers: {
    setAnalogSettings(state, action) {
      state.analogSettings = action.payload;
    },
    clearAnalogSettings(state, action) {
      state.analogSettings = [];
    },
  },
});

export const { setAnalogSettings, clearAnalogSettings } =
  analogSettingsSlice.actions;
export default analogSettingsSlice.reducer;
