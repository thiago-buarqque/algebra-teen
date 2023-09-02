import { createSlice } from "@reduxjs/toolkit";

import { Auth } from "../firebase/auth";

export type TGlobalState = {
  auth: Auth;
};

const auth = new Auth();
const initialState: TGlobalState = {
  auth: auth,
};

export const GlobalSlice = createSlice({
  name: "lessonCreator",
  initialState,
  reducers: {}
});

export default GlobalSlice.reducer;
