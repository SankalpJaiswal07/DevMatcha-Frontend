import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequest: (state, action) => action.payload,
  },
});

export const { addRequest } = requestsSlice.actions;

export default requestsSlice.reducer;
