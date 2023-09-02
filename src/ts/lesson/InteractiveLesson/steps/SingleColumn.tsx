import React from "react";

import Column from "./Column";

import { TStepElement } from "../../type";

const SingleColumn: React.FC<TStepElement> = (props) => {
  const { step } = props;

  return (
    <div className="lesson-step" id={`step-${step.id}`}>
      {step.content.map((content, i) => (
        <Column key={content.id} content={content} contentIndex={i} stepId={step.id} />
      ))}
    </div>
  );
};

export default SingleColumn;
