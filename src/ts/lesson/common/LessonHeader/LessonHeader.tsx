import React from "react";
import { useParams } from "react-router-dom";

import { ReactComponent as Home } from "../../../../resources/icons/home.svg";
import { ReactComponent as Draw } from "../../../../resources/icons/draw.svg";

import "./lessonHeader.scss";

interface props {
  progress: number;
  title: string;
  openWhiteboard: () => void;
}

const LessonHeader: React.FC<props> = ({ progress, title, openWhiteboard }) => {
  let { page } = useParams();

  return (
    <div id="lesson-header">
      <div>
        <div id="controls">
          <button className="control" onClick={() => window.location.href = `/${page}`}>
            <Home />
          </button>
          <button className="control" onClick={openWhiteboard}>
            <Draw />
          </button>
        </div>
        <div id="lesson-progress-bar">
          <div id="bar" style={{ width: `${progress}%` }}>
            {parseInt("" + progress)}%
          </div>
        </div>
      </div>
      <p id="title" className="heading-2">
        {title}
      </p>
    </div>
  );
};

export default LessonHeader;
