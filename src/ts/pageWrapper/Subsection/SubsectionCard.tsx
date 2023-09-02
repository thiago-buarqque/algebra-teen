import React from "react";

import "./subsectionCard.scss";

interface props {
  backgroundColor: string;
  backgroundImage: string;
  description: string;
  href: string;
  title: string;
  progress?: number;
}

const formatProgress = (progress: number) => {
  return Math.round(progress * 100);
};

const SubsectionCard: React.FC<props> = ({
  backgroundColor,
  backgroundImage,
  description,
  href,
  title,
  progress,
}) => {
  return (
    <a href={href} className="subsection-card shadowed-element">
      <div
        className="image"
        style={{
          backgroundColor: backgroundColor,
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>
      <div className="content">
        <span className="title">{title}</span>
        <p>{description}</p>
      </div>
      {(progress !== undefined && progress > 0)? (
        <div id="progress-bar">
          <div style={{ width: `${progress * 100}%` }}>
            <span className="small-text">{formatProgress(progress)}%</span>
          </div>
        </div>
      ) : null}
    </a>
  );
};

export default SubsectionCard;
