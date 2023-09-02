import React from "react";
import { TAchievement } from "./Profile";

interface props {
  achievement: TAchievement;
}

const AchievementCard: React.FC<props> = ({ achievement }) => {
  const {
    background,
    backgroundImage,
    currentProgress,
    description,
    title,
    totalProgress,
  } = achievement;
  return (
    <div className="achievement-card shadowed-element">
      <div
        className="image"
        style={{
          backgroundColor: background,
          backgroundImage: `url(${process.env.PUBLIC_URL}/resources/${backgroundImage})`,
        }}></div>
      <div className="content">
        <span className="title">{title}</span>
        <p>{description}</p>
        <div id="progress-bar">
          <span className="small-text">
            {`${currentProgress}/${totalProgress}`}
          </span>
          <div id="bar">
            <div
              style={{
                width: `${(currentProgress / totalProgress) * 100}%`,
              }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
