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
  },
});

export const { setChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
