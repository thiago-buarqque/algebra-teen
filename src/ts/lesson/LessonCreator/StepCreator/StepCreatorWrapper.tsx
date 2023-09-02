import React from "react";

import { useDispatch } from "react-redux";
import { doAddSubstep, doSwapStepSubvariation, doRemoveStep } from "../redux/LessonCreator/LessonCreatorSlice";

import SingleColumnCreator from "./SingleColumnCreator";
import TwoColumnsSubstepsCreator from "./TwoColumnsSubstepsCreator";
import TwoColumnsCreator from "./TwoColumnsCreator";

import { ReactComponent as LayoutRow } from "../../../../resources/icons/layout_row.svg";
import { ReactComponent as LayoutColumn } from "../../../../resources/icons/layout_column.svg";
import { ReactComponent as TrashBin } from "../../../../resources/icons/trash_bin.svg";
import { ReactComponent as Sublayout } from "../../../../resources/icons/sublayout.svg";

import { TStepElement } from "../../type";

const STEP_ELEMENTS = {
  SINGLE_COLUMN: SingleColumnCreator,
  TWO_COLUMNS_SUBSTEPS: TwoColumnsSubstepsCreator,
  TWO_COLUMNS: TwoColumnsCreator,
};

const StepCreatorWrapper: React.FC<TStepElement> = (props) => {
  const dispatch = useDispatch();
  const { step } = props;

  return (
    <div className="lesson-step-wrapper">
      <div className="options">
        {step.variation === "TWO_COLUMNS_SUBSTEPS" && (
          <>
            <button onClick={() => dispatch(doAddSubstep({ stepId: step.id }))}>
              <Sublayout />
            </button>
            <button onClick={() => dispatch(doSwapStepSubvariation({ stepId: step.id }))}>
              {step.subvariation === "HORIZONTAL" ? <LayoutColumn /> : <LayoutRow />}
            </button>
          </>
        )}
        <button onClick={() => dispatch(doRemoveStep({ stepId: step.id }))}>
          <TrashBin />
        </button>
      </div>
      {<>{STEP_ELEMENTS[step.variation]({ ...props })}</>}
    </div>
  );
};

export default StepCreatorWrapper;
