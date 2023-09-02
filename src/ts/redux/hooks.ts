import { TypedUseSelectorHook, useSelector } from "react-redux";

import { TGlobalState } from "./GlobalSlice";

export const useGlobalSelector: TypedUseSelectorHook<TGlobalState> = useSelector