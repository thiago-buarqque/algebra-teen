import React from "react";
import { TStepElement } from "../../type";
import ColumnCreator from "../ColumnCreator/ColumnCreator";

const TwoColumnsCreator: React.FC<TStepElement> = (props) => {
  const {stepNumber, step} = props;
  
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

export default TwoColumnsCreator;
