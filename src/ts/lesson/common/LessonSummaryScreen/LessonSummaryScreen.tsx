import React, { useEffect, useRef, useState } from "react";

import { TUserLessonProgress } from "../../../pageWrapper/PageWrapper";
import { ReactComponent as Clock } from "../../../../resources/icons/clock.svg";
import { ReactComponent as Check } from "../../../../resources/icons/check.svg";
import { TLesson } from "../../type";

import "./lessonSummaryScreen.scss";
import LessonEndScreen from "./LessonEndScreen/LessonEndScreen";
import { DataBase } from "../../../firebase/database";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { TAchievement } from "../../../profile/Profile";
import { formatTime, secondsToTime } from "../../../util";

const CONGRATULATIONS_MESSAGES = [
  "Bom trabalho 👏",
  "Missão cumprida. Parabéns! 🎉",
  "Você arrasou nesse assunto! 😎",
];

const dataBase = new DataBase({ path: "lesson" });

interface IProps {
  finished: boolean;
  userLessonProgress: TUserLessonProgress;
  lesson: TLesson;
  achievementsOnEnd: React.MutableRefObject<TAchievement[]>;
  achievementsOnStart: React.MutableRefObject<TAchievement[]>;
}

const LessonSummaryScreen: React.FC<IProps> = ({
  finished,
  userLessonProgress,
  lesson,
  achievementsOnEnd,
  achievementsOnStart,
}) => {
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [nextLesson, setNextLesson] = useState<TLesson | null>(null);

  const lessonSummaryScreenRef = useRef<HTMLDivElement | null>(null);

  const congratulationMessage = useRef(
    CONGRATULATIONS_MESSAGES[
      Math.floor(Math.random() * CONGRATULATIONS_MESSAGES.length)
    ]
  );

  const handleContinue = () => {
    lessonSummaryScreenRef.current?.classList.add("invisible-element");
    setTimeout(() => setShowEndScreen(true), 1000);
  };

  useEffect(() => {
    dataBase.getById(
      lesson.nextLesson.id.trim(),
      (lessonRef: DocumentSnapshot<DocumentData>) => {
        const data = lessonRef.data();

        if (data) {
          const { createDate, updateDate, ...lesson } = data;

          setNextLesson(lesson as TLesson);
        }
      }
    );
  }, [lesson]);

  if (showEndScreen) {
    return (
      <LessonEndScreen
        nextLesson={nextLesson}
        achievementsOnEnd={achievementsOnEnd}
        achievementsOnStart={achievementsOnStart}
      />
    );
  }

  return (
    <div
      ref={lessonSummaryScreenRef}
      id="lesson-summary-screen"
      className={!finished ? "invisible-element" : ""}>
      <h1 className="heading-2">{congratulationMessage.current}</h1>
      <div id="score">
        <span>
          <Clock />
          Seu tempo:{" "}
          {formatTime(secondsToTime(userLessonProgress.finishTime / 1000))}
        </span>
        <span>
          <Check />
          Resposta corretas:{" "}
          {userLessonProgress.answers.filter((answer) => answer.success).length}
          /{userLessonProgress.answers.length}
        </span>
      </div>
      <button
        className="secondary-button"
        id="btn-continue"
        onClick={handleContinue}>
        <span>Continuar</span>
      </button>
    </div>
  );
};

export default LessonSummaryScreen;
