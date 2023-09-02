import React, { useCallback, useEffect, useRef } from "react";

import QuestionBuilder from "../../common/QuestionBuilder";
import RESOURCES_MAPPER from "../../common/ResourcesMapper";

import { TContent } from "../../type";

interface props {
  content: TContent;
  contentIndex: number;
  isSubstep?: boolean;
  stepId: string;
}

const Column: React.FC<props> = ({ content, stepId }) => {
  const columnRef = useRef<HTMLDivElement | null>(null);

  const placeEntities = useCallback((html: string, script: string) => {
    if (!columnRef.current) return;

    html = QuestionBuilder.buildQuestionContent(html, "<question>", "</question>", false) || html;

    Object.keys(RESOURCES_MAPPER).forEach((key) => {
      html = html.replaceAll(key, RESOURCES_MAPPER[key]);
    });

    columnRef.current.innerHTML = html;

    const scriptElement = document.createElement("script");
    scriptElement.innerHTML =
      QuestionBuilder.buildQuestionContent(
        script,
        "<question-script>",
        "</question-script>",
        true
      ) || script;

    columnRef.current.appendChild(scriptElement);
  }, []);

  useEffect(() => {
    if (content.entityType !== "SUBSTEPS_HOLDER") {
      placeEntities(content.html, content.script);
    }
  }, [content, placeEntities]);

  if (content.entityType === "SUBSTEPS_HOLDER") {
    return (
      <div ref={columnRef} className="column substeps-column">
        <div className="substeps-holder" id={`substeps-holder-${stepId}`}>
          {content.content?.map((_content, i) => (
            <Column
              content={_content}
              contentIndex={i}
              isSubstep
              key={_content.id}
              stepId={stepId}
            />
          ))}
        </div>
      </div>
    );
  }

  return <div ref={columnRef} className="column" id={`column-${content.id}`}></div>;
};

export default Column;
