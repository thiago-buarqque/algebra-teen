import React from "react";

import ColumnCreator from "../ColumnCreator/ColumnCreator";

import { TStepElement } from "../../type";

const SingleColumnCreator: React.FC<TStepElement> = (props) => {
  const { stepNumber, step } = props;

  return (
    <div className="lesson-step" id={`step-${step.id}`}>
      <p className="lesson-index">{stepNumber}</p>
      {step.content.map((column, i) => 
          <ColumnCreator
            key={column.id}
            contentId={column.id}
            contentIndex={i}
            stepId={step.id}
          />
      )}
    </div>
  );
};

export default SingleColumnCreator;
