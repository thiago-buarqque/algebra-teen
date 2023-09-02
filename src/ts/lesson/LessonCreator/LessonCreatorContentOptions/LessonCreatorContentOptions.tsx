import { useDispatch } from "react-redux";
import {
  doAddSingleColumnStep,
  doAddTwoColumnsStep,
  doAddTwoColumnsSubstepsStep,
} from "../redux/LessonCreator/LessonCreatorSlice";

import "./lessonCreatorContentOptions.scss";

const LessonCreatorContentOptions: React.FC<{
  saveLesson: () => void;
}> = ({ saveLesson}) => {
  const dispatch = useDispatch();
  return (
    <div id="lesson-creator-controls">
      <button
        className="shadowed-element secondary-button"
        onClick={saveLesson}
      >
        <span>Salvar lição</span>
      </button>
      <button
        className="step-adder shadowed-element"
        onClick={() => dispatch(doAddSingleColumnStep())}
      >
        <span>Uma coluna</span>
      </button>
      <button
        className="step-adder shadowed-element"
        onClick={() => dispatch(doAddTwoColumnsStep())}
      >
        <span>Duas colunas</span>
      </button>
      <button
        className="step-adder shadowed-element"
        onClick={() => dispatch(doAddTwoColumnsSubstepsStep())}
      >
        <span>Duas colunas com sub-conteúdo</span>
      </button>
    </div>
  );
};

export default LessonCreatorContentOptions;
