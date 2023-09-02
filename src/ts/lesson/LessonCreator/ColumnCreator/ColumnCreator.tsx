import React, { useEffect, useRef } from "react";

import { useDispatch } from "react-redux";
import { useLessonCreatorSelector } from "../redux/LessonCreator/hooks";

import RESOURCES_MAPPER from "../../common/ResourcesMapper";

import { TContent } from "../../type";

import "./columnCreator.scss";
import QuestionBuilder from "../../common/QuestionBuilder";
import { doSetEditorContext, doSetJSContent, doSetHTMLContent, doRemoveSubstep } from "../redux/LessonCreator/LessonCreatorSlice";

interface props {
  contentId: string;
  contentIndex: number;
  stepId: string;
  isSubstep?: boolean;
}

const ColumnCreator: React.FC<props> = ({ contentId, contentIndex, stepId, isSubstep }) => {
  const content: TContent | null | undefined = useLessonCreatorSelector((state) => {
    const step = state.lesson.steps.filter((step) => step.id === stepId)[0];

    if (step && isSubstep) {
      return step.content[1].content?.filter((content) => content.id === contentId)[0];
    } else if (step) {
      return step.content.filter((content) => content.id === contentId)[0];
    }

    return null;
  });

  const dispatch = useDispatch();

  const columnCreatorRef = useRef<HTMLDivElement | null>(null);
  const columnRef = useRef<HTMLDivElement | null>(null);
  const jsContentHolderRef = useRef<HTMLTextAreaElement | null>(null);
  const htmlContentHolderRef = useRef<HTMLTextAreaElement | null>(null);
  const lastScript = useRef<HTMLScriptElement>();

  const highlightColumnCreator = () => {
    const currentHighlighteds = document.querySelectorAll(".column-creator.active");
    Array.from(currentHighlighteds).forEach((el) => el.classList.remove("active"));

    columnCreatorRef.current?.classList.add("active");
  };

  const handleEdit = () => {
    if (!jsContentHolderRef.current || !htmlContentHolderRef.current) return;

    dispatch(doSetEditorContext({ contentId, stepId }));

    dispatch(doSetJSContent({ content: jsContentHolderRef.current.value || "" }));

    dispatch(doSetHTMLContent({ content: htmlContentHolderRef.current.value || "" }));

    highlightColumnCreator();
  };

  const placeEntities = () => {
    if (!columnRef.current || !htmlContentHolderRef.current || !columnCreatorRef.current) return;

    let html = htmlContentHolderRef.current.value;

    html = QuestionBuilder.buildQuestionContent(
      html,
      "<question>",
      "</question>",
      false
    ) || html

    Object.keys(RESOURCES_MAPPER).forEach((key) => {
      html = html.replaceAll(key, RESOURCES_MAPPER[key]);
    });

    columnRef.current.innerHTML = html

    const strScript = jsContentHolderRef.current?.value || "";
    const script = document.createElement("script");
    script.innerHTML =
      QuestionBuilder.buildQuestionContent(
        strScript,  
        "<question-script>",
        "</question-script>",
        true
      ) || strScript;

    if (lastScript.current) {
      columnCreatorRef.current.removeChild(lastScript.current);
    }

    columnCreatorRef.current.appendChild(script);

    lastScript.current = script;
  };

  const updateContent = () => {
    if (!jsContentHolderRef.current || !htmlContentHolderRef.current || !content) return;

    jsContentHolderRef.current.value = content.script;
    htmlContentHolderRef.current.value = content.html;

    placeEntities();
  };

  useEffect(updateContent, [content]);

  if (content && content.entityType === "SUBSTEPS_HOLDER") {
    return (
      <div ref={columnCreatorRef} className="column-creator">
        <div className="column substeps-column">
          <div className="substeps-holder" id={`substeps-holder-${stepId}`}>
            {content.content?.map((content, i) => (
              <ColumnCreator
                contentId={content.id}
                contentIndex={i}
                isSubstep
                key={content.id}
                stepId={stepId}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={columnCreatorRef} className="column-creator">
      <textarea readOnly ref={jsContentHolderRef} style={{ display: "none" }}></textarea>
      <textarea readOnly ref={htmlContentHolderRef} style={{ display: "none" }}></textarea>
      <div ref={columnRef} className="column" id={`column-${contentId}`}></div>
      <div className="controls">
        <button className="control" onClick={handleEdit}>
          <span>Editar</span>
        </button>
        {isSubstep && (<>
          <button
            className="control"
            onClick={() => dispatch(doRemoveSubstep({ contentId, stepId }))}
          >
            Excluir subconteúdo
          </button>
        </>)}
      </div>
      {isSubstep && <p className="substep-index">{contentIndex}</p>}
    </div>
  );
};

export default ColumnCreator;
