import React from "react";

import { ReactComponent as Back } from "../../../../../resources/icons/arrow-back.svg";
import { ReactComponent as OpenBook } from "../../../../../resources/icons/book-open.svg";

import "./lessonEndScreen.scss";
import { TLesson } from "../../../type";
import SubsectionCard from "../../../../pageWrapper/Subsection/SubsectionCard";
import { useParams } from "react-router-dom";
import { SECTION_TITLES } from "../../../../pageWrapper/PageWrapper";
import { TAchievement } from "../../../../profile/Profile";
import AchievementCard from "../../../../profile/AchievementCard";

interface IProps {
  nextLesson: TLesson | null;
  achievementsOnEnd: React.MutableRefObject<TAchievement[]>;
  achievementsOnStart: React.MutableRefObject<TAchievement[]>;
}

const LessonEndScreen: React.FC<IProps> = ({
  achievementsOnEnd,
  achievementsOnStart,
  nextLesson,
}) => {
  const { page } = useParams();

  const achievements = achievementsOnEnd.current.map((achievement, i) => {
    if (achievement.currentProgress !== achievementsOnStart.current[i].currentProgress) {
      return <AchievementCard key={i} achievement={achievement} />;
    }
    return null;
  });

  return (
    <div id="lesson-end-screen">
      <div id="achievements">
        {achievements.some((el) => el !== null) && (
          <>
            <p>Você obteve progresso na(s) conquista(s):</p>
            <div>{achievements}</div>
          </>
        )}
      </div>

      <div id="options">
        <button className="tertiary-button" onClick={() => (window.location.href = "/" + page)}>
          <Back />
          <span>Voltar para "{SECTION_TITLES[page || ""]}"</span>
        </button>
        {nextLesson && (
          <button
            className="secondary-button"
            onClick={() => (window.location.href = "" + nextLesson?.id)}
          >
            <OpenBook />
            <span>Próxima {page === "desafios" ? "desafio" : "revisão"}</span>
          </button>
        )}
      </div>
      {nextLesson && (
        <>
          <div id="next-lesson">
            <p>A seguir, na seção "{nextLesson.section.title}":</p>
            <SubsectionCard
              backgroundColor={nextLesson.card.background}
              backgroundImage={process.env.PUBLIC_URL + "/resources" + nextLesson.card.image}
              description={nextLesson.card.description}
              href={nextLesson.id}
              title={nextLesson.title}
              progress={0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LessonEndScreen;
