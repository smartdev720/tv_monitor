import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload;
    },
    clearChannels(state) {
      state.channels = [];
    },
  },
});

export const { setChannels, clearChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
