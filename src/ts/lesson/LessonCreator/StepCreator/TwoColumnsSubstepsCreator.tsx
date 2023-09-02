import React from "react";
import { TStepElement } from "../../type";
import ColumnCreator from "../ColumnCreator/ColumnCreator";

const TwoColumnsSubstepsCreator: React.FC<TStepElement> = (props) => {
  const {stepNumber, step} = props;
  
  return (
    <div className={`lesson-step ${step.subvariation === "HORIZONTAL" && "horizontal"}`} id={`step-${step.id}`}>
      <p className="lesson-index">{stepNumber}</p>
      {step.content.map((content, i) => 
          <ColumnCreator
            key={content.id}
            contentId={content.id}
            contentIndex={i}
            stepId={step.id}
          />
      )}
    </div>
  );
};

export default TwoColumnsSubstepsCreator;
