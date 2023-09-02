import React from "react";

import Column from "./Column";

import { TStepElement } from "../../type";

const TwoColumns: React.FC<TStepElement> = (props) => {
  const { step } = props;

  return (
    <div
      className={`lesson-step ${step.subvariation === "HORIZONTAL" && "horizontal"}`}
      id={`step-${step.id}`}
    >
      {step.content.map((content, i) => (
        <Column key={content.id} content={content} contentIndex={i} stepId={step.id} />
      ))}
    </div>
  );
};

export default TwoColumns;
