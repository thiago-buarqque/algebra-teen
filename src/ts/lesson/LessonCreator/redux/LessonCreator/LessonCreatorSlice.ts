import { createSlice } from "@reduxjs/toolkit";

import {
  appendJSContent,
  appendHTMLContent,
  setColumnContent,
  setContentActions,
  setEditorContext,
  setHTMLContent,
  setJSContent,
  setLessonTitle,
} from "./ContentEditorReducers";

import {
  addSingleColumnStep,
  addTwoColumnsStep,
  addTwoColumnsSubstepsStep,
  createNewLesson,
  swapStepSubvariation,
  addSubstep,
  removeStep,
  removeSubstep,
  setLesson
} from "./LessonReducers";

import { getNewLesson } from "./util";

import { TLesson } from "./../../../type";

export interface IContentEditorState {
  contentId: string;
  stepId: string;
}

export interface ILessonCreatorState {
  contentEditor: IContentEditorState;
  lesson: TLesson;
}

const initialState: ILessonCreatorState = {
  contentEditor: {
    contentId: "",
    stepId: "",
  },
  lesson: getNewLesson(),
};

export const LessonCreatorSlice = createSlice({
  name: "lessonCreator",
  initialState,
  reducers: {
    addSingleColumnStep,
    addSubstep,
    addTwoColumnsStep,
    addTwoColumnsSubstepsStep,
    appendJSContent,
    setContentActions,
    appendHTMLContent,
    createNewLesson,
    removeStep,
    removeSubstep,
    setColumnContent,
    setEditorContext,
    setHTMLContent,
    setJSContent,
    setLesson,
    setLessonTitle,
    swapStepSubvariation,
  },
});

export const {
  addSingleColumnStep: doAddSingleColumnStep,
  addSubstep: doAddSubstep,
  addTwoColumnsStep: doAddTwoColumnsStep,
  addTwoColumnsSubstepsStep: doAddTwoColumnsSubstepsStep,
  appendJSContent: doAppendJSContent,
  appendHTMLContent: doAppendHTMLContent,
  setContentActions: doSetContentActions,
  createNewLesson: doCreateNewLesson,
  removeStep: doRemoveStep,
  removeSubstep: doRemoveSubstep,
  setColumnContent: doSetColumnContent,
  setEditorContext: doSetEditorContext,
  setHTMLContent: doSetHTMLContent,
  setJSContent: doSetJSContent,
  setLesson: doSetLesson,
  setLessonTitle: doSetLessonTitle,
  swapStepSubvariation: doSwapStepSubvariation,
} = LessonCreatorSlice.actions;

export default LessonCreatorSlice.reducer;
