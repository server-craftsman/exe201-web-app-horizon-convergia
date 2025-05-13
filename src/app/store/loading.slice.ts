import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    toggleLoading: (_, action) => action.payload
  }
});

export const { toggleLoading } = loadingSlice.actions;
export default loadingSlice.reducer;