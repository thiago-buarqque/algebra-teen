import { PayloadAction } from "@reduxjs/toolkit";
import { ILessonCreatorState } from "./LessonCreatorSlice";
import { getContentReference } from "./util";

export const setColumnContent = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    stepId: string;
    contentId: string;
    content: string;
    contentType: "JS" | "HTML";
  }>
) => {
  const { content: newContent, contentType } = action.payload;

  const content = getContentReference(state);

  content[contentType === "JS" ? "script" : "html"] = newContent;
};

export const setEditorContext = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    stepId: string;
    contentId: string;
  }>
) => {
  const { contentId, stepId } = action.payload;

  const contentEditor = state.contentEditor;

  contentEditor["contentId"] = contentId;
  contentEditor["stepId"] = stepId;
};

export const setContentActions = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    content: string;
  }>
) => {
  const content = getContentReference(state);

  content["actions"] = action.payload.content;
};

export const setJSContent = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    content: string;
  }>
) => {
  const content = getContentReference(state);

  content["script"] = action.payload.content;
};

export const setHTMLContent = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    content: string;
  }>
) => {
  const content = getContentReference(state);

  content["html"] = action.payload.content;
};

export const appendJSContent = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    content: string;
  }>
) => {
  const content = getContentReference(state);
  content["script"] += action.payload.content;
};

export const appendHTMLContent = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    content: string;
  }>
) => {
  const content = getContentReference(state);
  content["html"] += action.payload.content;
};

export const setLessonTitle = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    content: string;
  }>
) => {
  const lesson = state.lesson;

  lesson["title"] = action.payload.content;
};
