import { configureStore } from "@reduxjs/toolkit";
import GlobalSlice from "./GlobalSlice";

const GlobalStore = configureStore({
  reducer: GlobalSlice,
});

export default GlobalStore;
