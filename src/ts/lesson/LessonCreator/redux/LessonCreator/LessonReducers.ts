import { PayloadAction } from "@reduxjs/toolkit";

import { getNewStep, getNewContent, LESSON_BASE } from "./util";
import { ILessonCreatorState } from "./LessonCreatorSlice";
import { TLesson, TStep } from "../../../type";

export const addSingleColumnStep = (state: ILessonCreatorState) => {
  const step: TStep = getNewStep();

  const content = getNewContent("CONTENT");

  step.content.push(content);

  const lesson = state.lesson;
  lesson["steps"].push(step);
};

export const addTwoColumnsStep = (state: ILessonCreatorState) => {
  const step: TStep = getNewStep();

  const content1 = getNewContent("CONTENT");

  const content2 = getNewContent("CONTENT");

  step.content.push(content1);
  step.content.push(content2);

  step.variation = "TWO_COLUMNS";

  const lesson = state.lesson;
  lesson["steps"].push(step);
};

export const addTwoColumnsSubstepsStep = (state: ILessonCreatorState) => {
  const step: TStep = getNewStep();

  step.variation = "TWO_COLUMNS_SUBSTEPS";

  const content1 = getNewContent("CONTENT");

  const content2 = getNewContent("SUBSTEPS_HOLDER");

  step.content.push(content1);
  step.content.push(content2);

  const lesson = state.lesson;
  lesson["steps"].push(step);
};

export const createNewLesson = (state: ILessonCreatorState) => {
  state.contentEditor.contentId = "";
  state.contentEditor.stepId = "";
  state.lesson = JSON.parse(JSON.stringify(LESSON_BASE));
};

export const swapStepSubvariation = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    stepId: string;
  }>
) => {
  const { stepId } = action.payload;

  const step = state.lesson.steps.filter((step) => step.id === stepId)[0];
  step.subvariation = step.subvariation === "HORIZONTAL" ? "VERTICAL" : "HORIZONTAL";
};

export const addSubstep = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    stepId: string;
  }>
) => {
  const { stepId } = action.payload;

  const step = state.lesson.steps.filter((step) => step.id === stepId)[0];
  if (step.content) {
    step.content[1].content?.push(getNewContent("SUBSTEP"));
  }
};

export const removeStep = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    stepId: string;
  }>
) => {
  const { stepId } = action.payload;

  state.lesson.steps = state.lesson.steps.filter((step) => step.id !== stepId);
};

export const removeSubstep = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    contentId: string;
    stepId: string;
  }>
) => {
  const { contentId, stepId } = action.payload;

  const step = state.lesson.steps.filter((step) => step.id === stepId)[0];

  const subContentHolder = step.content[1];

  const substeps = subContentHolder.content;

  if (substeps && substeps.length > 1) {
    subContentHolder.content = substeps.filter((subcontent) => subcontent.id !== contentId);
  }
};

export const setLesson = (
  state: ILessonCreatorState,
  action: PayloadAction<{
    lesson: TLesson
  }>
) => {
  const { lesson } = action.payload;

  state.lesson = lesson
};