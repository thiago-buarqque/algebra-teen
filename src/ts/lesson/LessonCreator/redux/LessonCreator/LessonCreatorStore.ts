import { configureStore } from "@reduxjs/toolkit";
import LessonCreatorSlice from "./LessonCreatorSlice";

const LessonCreatorStore = configureStore({
  reducer: LessonCreatorSlice,
});

export default LessonCreatorStore
