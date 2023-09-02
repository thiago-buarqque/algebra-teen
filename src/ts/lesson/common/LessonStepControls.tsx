import React from "react";

import { ReactComponent as Play } from "../../../resources/icons/play.svg";

interface props {
  onStepBack: () => void;
  onStepForward: () => void;
  disableNextButton: boolean
}

const LessonStepControls: React.FC<props> = ({ onStepBack, onStepForward, disableNextButton }) => {
  return (
    <div id="lesson-step-controls">
      <button className="tertiary-button btn-previous-screen" onClick={onStepBack}>
        <Play style={{ transform: "rotate(-90deg)" }} height={"14px"} stroke="#333333" />
        <span>VOLTAR</span>
      </button>
      <button className="secondary-button btn-next-screen" disabled={disableNextButton} onClick={onStepForward}>
        <Play style={{ transform: "rotate(90deg)" }} height={"14px"} />
        <span>AVANÇAR</span>
      </button>
    </div>
  );
};

export default LessonStepControls;
