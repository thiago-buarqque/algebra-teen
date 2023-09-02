import React, { useEffect, useRef, useState } from "react";

import { ReactComponent as Home } from "../../../resources/icons/home.svg";
import { ReactComponent as Restart } from "../../../resources/icons/restart.svg";
import { formatTime, secondsToTime } from "../../util";

import "./gameWrapper.scss";
import GameFinished from "../gameFinished/GameFinished";
import { TAchievement } from "../../profile/Profile";
import { getAchievements, triggerAchievementsQueries } from "../../lesson/common/util";
import { useGlobalSelector } from "../../redux/hooks";
import { User } from "firebase/auth";

interface IProps {
  congratulationsMessage: string;
  finished: boolean;
  homeHref: string;
  title: string;
  style?: React.CSSProperties;
  onRestart: () => void;
  onMatchEnd: (time: number) => void;
}

const GameWrapper: React.FC<React.PropsWithChildren<IProps>> = ({
  children,
  congratulationsMessage,
  finished,
  homeHref,
  onRestart,
  onMatchEnd,
  style,
  title,
}) => {
  const user = useGlobalSelector((state) =>
    state.auth ? (state.auth.getCurrentUser as User) : null
  );

  const [time, setTime] = useState(0);

  const achievementsOnStart = useRef<TAchievement[]>([]);
  const achievementsOnEnd = useRef<TAchievement[]>([]);
  const timeRef = useRef(0);
  const timeIntervalRef = useRef<NodeJS.Timer>();

  const handleRestart = () => {
    timeRef.current = 0;

    setTime(0);

    onRestart();
  };

  useEffect(() => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    timeIntervalRef.current = setInterval(() => {
      setTime(timeRef.current + 1000);
      timeRef.current += 1000;
    }, 1000);

    getAchievements((achievements) => {
      achievementsOnStart.current = achievements;
    }, user?.uid || "");
  }, [user]);

  useEffect(() => {
    if (finished) {
      onMatchEnd(timeRef.current)
      
      clearInterval(timeIntervalRef.current);
      // Verificar conquistas
      triggerAchievementsQueries(() => {
        getAchievements((achievements) => {
          achievementsOnEnd.current = achievements;
        }, user?.uid || "");
      });
    }
  }, [finished, onMatchEnd, user]);

  return (
    <div id="game-parent" style={style}>
      <div id="game-header" style={{ opacity: `${finished ? 0 : 1}` }}>
        <div>
          <div id="controls">
            <button className="control" onClick={() => (window.location.href = `/${homeHref}`)}>
              <Home />
            </button>
            <button className="control" onClick={handleRestart}>
              <Restart />
            </button>
            <span id="timer">{formatTime(secondsToTime(time / 1000))}</span>
          </div>
        </div>
        <p id="title" className="heading-2">
          {title}
        </p>
        <div id="profile"></div>
      </div>
      <div id="cards-wrapper">
        {
          <GameFinished
            achievementsOnEnd={achievementsOnEnd}
            achievementsOnStart={achievementsOnStart}
            congratulationsMessage={congratulationsMessage}
            finished={finished}
            finishTime={finished ? timeRef.current : 0}
            handleContinue={() => {
              window.location.href = "/jogos";
            }}
            handleNewGame={() => window.location.reload()}
          />
        }
        {children}
      </div>
    </div>
  );
};

export default GameWrapper;
