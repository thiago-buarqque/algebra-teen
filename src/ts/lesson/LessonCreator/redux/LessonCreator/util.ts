import { TContent, TLesson, TStep } from "../../../type";
import { generateRandomId } from "../../util";
import { ILessonCreatorState } from "./LessonCreatorSlice";

export const BASE_CONTENT: TContent = {
  actions: "",
  id: "$[id}",
  properties: "",
  content: null,
  entityType: "CONTENT",
  html: `
  <style>
    div#column-$[contentId] {}
  </style>
  `,
  script: "",
};

export const BASE_STEP: TStep = {
  content: [],
  id: "$[id]",
  subvariation: "VERTICAL",
  variation: "SINGLE_COLUMN",
};

export const LESSON_BASE: TLesson = {
  id: "$[id]",
  title: "Falta criar uma forma de dizer que algo é uma pergunta para o estudante",
  card: {
    title: "Falta criar uma forma de dizer que algo é uma pergunta para o estudante",
    description: "",
    background: "",
    image: "",
  },
  section: {
    page: "",
    title: "",
    index: 0
  },
  steps: [],
  nextLesson: {
    id: ""
  }
};

export function getNewLesson() {
  const lesson: TLesson = JSON.parse(JSON.stringify(LESSON_BASE));

  lesson.id = generateRandomId(16);

  return lesson;
}

export function getNewStep() {
  const step: TStep = JSON.parse(JSON.stringify(BASE_STEP));

  step.id = generateRandomId(16);

  return step;
}

export function getNewContent(contentType: TContent["entityType"] = "CONTENT") {
  const content: TContent = JSON.parse(JSON.stringify(BASE_CONTENT));

  content.id = generateRandomId(16);
  content.entityType = contentType;
  content.html = content.html.replaceAll("$[contentId]", content.id);
  content.actions = "{}"

  if (contentType === "SUBSTEPS_HOLDER") {
    content.content = [getNewContent("SUBSTEP"), getNewContent("SUBSTEP")];
  }

  return content;
}

export function getContentReference(state: ILessonCreatorState) {
  const contentEditor = state.contentEditor;

  const step = state.lesson.steps.filter((step) => step.id === contentEditor.stepId)[0];

  let content: TContent | null | undefined;

  if (step.variation === "TWO_COLUMNS_SUBSTEPS") {
    content = step.content[1].content?.filter(
      (content) => content.id === contentEditor.contentId
    )[0];

    if (!content) {
      content = step.content[0];
    }
  } else {
    content = step.content.filter((content) => content.id === contentEditor.contentId)[0];
  }

  return content;
}
