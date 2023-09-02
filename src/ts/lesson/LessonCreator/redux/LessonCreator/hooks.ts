import { TypedUseSelectorHook, useSelector } from "react-redux";

import { ILessonCreatorState } from "./LessonCreatorSlice";

export const useLessonCreatorSelector: TypedUseSelectorHook<ILessonCreatorState> = useSelector