import React from "react";

import { ReactComponent as Clock } from "../../../resources/icons/clock.svg";
import { formatTime, secondsToTime } from "../../util";

import "./gameFinished.scss";
import AchievementCard from "../../profile/AchievementCard";
import { TAchievement } from "../../profile/Profile";

interface IProps {
  achievementsOnEnd: React.MutableRefObject<TAchievement[]>;
  achievementsOnStart: React.MutableRefObject<TAchievement[]>;
  congratulationsMessage: string;
  finished: boolean;
  finishTime: number;
  handleContinue: () => void;
  handleNewGame: () => void;
}

const GameFinished: React.FC<IProps> = ({
  achievementsOnEnd,
  achievementsOnStart,
  congratulationsMessage,
  finished,
  finishTime,
  handleContinue,
  handleNewGame,
}) => {

  const achievements = achievementsOnEnd.current.map((achievement, i) => {
    if (achievement.currentProgress !== achievementsOnStart.current[i].currentProgress) {
      return <AchievementCard key={i} achievement={achievement} />;
    }
    return null;
  });

  return (
    <div id="game-summary-screen" className={!finished ? "invisible-element" : "show"}>
      <h1 className="heading-2">{congratulationsMessage}</h1>
      <div id="score">
        <span>
          <Clock />
          Seu tempo: {formatTime(secondsToTime(finishTime / 1000))}
        </span>
      </div>
      <div id="achievements">
        {achievements.some((el) => el !== null) && (
          <>
            <p>Você obteve progresso na(s) conquista(s):</p>
            <div>{achievements}</div>
          </>
        )}
      </div>
      <div id="options">
        <button className="tertiary-button" id="btn-continue" onClick={handleContinue}>
          <span>Voltar para "jogos"</span>
        </button>
        <button className="secondary-button" id="btn-new-game" onClick={handleNewGame}>
          <span>Jogar novamente</span>
        </button>
      </div>
    </div>
  );
};

export default GameFinished;
