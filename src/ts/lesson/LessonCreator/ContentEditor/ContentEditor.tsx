import React, { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import { useLessonCreatorSelector } from "../redux/LessonCreator/hooks";

import { getDefaultRawElement } from "./contentMapping/contentProvider";
import { DEFAULT_HTML_ELEMENTS } from "./contentMapping/defaultRawElements";

import { dragElement } from "./util";

import { TContent, TLesson, TCard, TSection } from "../../type";

import "./contentEditor.scss";
import {
  doAppendHTMLContent,
  doAppendJSContent,
  doSetHTMLContent,
  doSetJSContent,
  doSetLessonTitle,
  doSetEditorContext,
  doCreateNewLesson,
  doSetContentActions,
  doSetLesson,
} from "../redux/LessonCreator/LessonCreatorSlice";

const ContentEditor: React.FC<{ setUnsavedChanges: (state: boolean) => void }> = ({
  setUnsavedChanges,
}) => {
  const content: TContent | null = useLessonCreatorSelector((state) => {
    const contentEditor = state.contentEditor;

    if (!contentEditor.stepId) return null;

    const step = state.lesson.steps.filter((step) => step.id === contentEditor.stepId)[0];

    if (step && step.variation === "TWO_COLUMNS_SUBSTEPS") {
      const content = step.content[1].content?.filter(
        (content) => content.id === contentEditor.contentId
      )[0];

      if (!content) return step.content[0];

      return content;
    } else if (step) {
      return step.content.filter((content) => content.id === contentEditor.contentId)[0];
    }

    return null;
  });

  const lesson: TLesson = useLessonCreatorSelector((state) => {
    return state.lesson;
  });

  const dispatch = useDispatch();

  const lessonTitleRef = useRef<HTMLInputElement | null>(null);
  const contentActionsRef = useRef<HTMLInputElement | null>(null);
  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);

  const [language, setLanguage] = useState<"HTML" | "JS" | "LESSON-CARD" | "LESSON-SECTION">(
    "HTML"
  );

  const appendRawElement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!contentEditorRef.current) return;

    const { html, script } = getDefaultRawElement(e.currentTarget.innerText);

    dispatch(doAppendHTMLContent({ content: html }));

    if (script) {
      dispatch(doAppendJSContent({ content: script }));
    }
  };

  const onChange = () => {
    if (!contentEditorRef.current) return;

    const value = contentEditorRef.current.value;

    if (language === "HTML") {
      dispatch(doSetHTMLContent({ content: value }));
    } else if (language === "JS") {
      dispatch(doSetJSContent({ content: value }));
    } else if (language === "LESSON-CARD" || language === "LESSON-SECTION") {
      const newLesson = JSON.parse(JSON.stringify(lesson)) as TLesson;

      if (language === "LESSON-CARD") {
        newLesson.card = {...JSON.parse(value)} as TCard;
      } else {
        newLesson.section = {...JSON.parse(value)} as TSection;
      }

      dispatch(
        doSetLesson({ lesson: {...JSON.parse(JSON.stringify(newLesson))} as TLesson })
      );
    }

    setUnsavedChanges(true);
  };

  const editLessonTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(doSetLessonTitle({ content: e.target.value }));
  };

  const editContentActions = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(doSetContentActions({ content: e.target.value }));
  };

  const closeEditor = () => {
    dispatch(doSetEditorContext({ contentId: "", stepId: "" }));
  };

  useEffect(() => {
    dragElement(document.getElementById("content-editor-parent"));
  }, []);

  useEffect(() => {
    if (!contentEditorRef.current || !content) return;

    if (language === "HTML") {
      contentEditorRef.current.value = content.html;
    } else if (language === "JS") {
      contentEditorRef.current.value = content.script;
    } else if (language === "LESSON-CARD" || language === "LESSON-SECTION") {
      if (language === "LESSON-CARD") {
        contentEditorRef.current.value = JSON.stringify(lesson.card);
      } else {
        contentEditorRef.current.value = JSON.stringify(lesson.section);
      }
    }

    if(lessonTitleRef.current) {
      lessonTitleRef.current.value = lesson.title
    }

    if(contentActionsRef.current) {
      contentActionsRef.current.value = content.actions
    }
  }, [content, language, lesson]);

  return (
    <div id="content-editor-parent" style={{ display: !content ? "none" : "initial" }}>
      <div>
        <input
          ref={lessonTitleRef}
          type="text"
          id="lesson-title-editor"
          onChange={editLessonTitle}
        ></input>
        <input
          ref={contentActionsRef}
          type="text"
          id="content-actions-editor"
          onChange={editContentActions}
        ></input>
        <div id="languages">
          <button
            onClick={() => setLanguage("HTML")}
            className={language === "HTML" ? "active" : ""}
          >
            HTML
          </button>
          <button onClick={() => setLanguage("JS")} className={language === "JS" ? "active" : ""}>
            JS
          </button>
          <button
            onClick={() => setLanguage("LESSON-CARD")}
            className={language === "LESSON-CARD" ? "active" : ""}
          >
            Card
          </button>
          <button
            onClick={() => setLanguage("LESSON-SECTION")}
            className={language === "LESSON-SECTION" ? "active" : ""}
          >
            Section
          </button>
        </div>
        <div id="-dragger">
          <button
            onClick={() => {
              dispatch(doCreateNewLesson());
              if (lessonTitleRef.current) lessonTitleRef.current.value = "Título da lição";
            }}
          >
            Limpar
          </button>
          <button onClick={closeEditor}>X</button>
        </div>
        <textarea ref={contentEditorRef} id="content-editor" onChange={onChange}></textarea>
        <div id="options">
          {Object.keys(DEFAULT_HTML_ELEMENTS).map((key, i) => (
            <button key={i} onClick={appendRawElement}>
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
