"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGlobalState {
  authState: boolean;
  userData: any;
}

const initialState: IGlobalState = {
  authState: false,
  userData: null,
};
const slice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setStateData: (state, action: PayloadAction<{ type: keyof IGlobalState; value: any }>) => {
      state[action.payload.type] = action.payload?.value;
    },
  },
});

export const { setStateData } = slice.actions;
export default slice.reducer;
