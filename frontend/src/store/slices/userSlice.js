import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = {};
    },
    setUserId(state, action) {
      state.user.id = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserId } = userSlice.actions;
export default userSlice.reducer;
