import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      if (!state) return state;
      const newFeed = state.filter((user) => user.id !== action.payload);
      return newFeed;
    },
  },
});
export const { addFeed, removeUserFromFeed } = feedSlice.actions;

export default feedSlice.reducer;
