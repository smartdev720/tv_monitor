import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sequence6: [],
};

const sequence6Slice = createSlice({
  name: "sequence6",
  initialState,
  reducers: {
    setSequence6(state, action) {
      state.sequence6 = action.payload;
    },
    clearSequence6(state) {
      state.sequence6 = [];
    },
    pushSequence6(state, action) {
      state.sequence6 = [...state.sequence6, action.payload];
    },
  },
});

export const { setSequence6, clearSequence6, pushSequence6 } =
  sequence6Slice.actions;
export default sequence6Slice.reducer;
