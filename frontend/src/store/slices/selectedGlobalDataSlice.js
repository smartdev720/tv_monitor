import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedGlobalData: {
    location: null,
    tvType: null,
    setting: null,
    date: null,
  },
};

const selectedDataSlice = createSlice({
  name: "selectedGlobalData",
  initialState,
  reducers: {
    setSelectedGlobalLocation(state, action) {
      state.selectedGlobalData.location = action.payload;
    },
    setSelectedGlobalTvType(state, action) {
      state.selectedGlobalData.tvType = action.payload;
    },
    setSelectedGlobalSetting(state, action) {
      state.selectedGlobalData.setting = action.payload;
    },
    setSelectedGlobalDate(state, action) {
      state.selectedGlobalData.date = action.payload;
    },
  },
});

export const {
  setSelectedGlobalDate,
  setSelectedGlobalLocation,
  setSelectedGlobalSetting,
  setSelectedGlobalTvType,
} = selectedDataSlice.actions;
export default selectedDataSlice.reducer;
