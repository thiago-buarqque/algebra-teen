import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGlobalSelector } from "../redux/hooks";

import Profile from "../profile/Profile";
import Subsection from "./Subsection/Subsection";

import { User } from "firebase/auth";
import { DataBase } from "../firebase/database";
import { DocumentData, QueryDocumentSnapshot, where } from "firebase/firestore";

import { TLesson } from "../lesson/type";

import "./pageWrapper.scss";
import Games from "../games/Games";
import Loading from "../Loading/Loading";
import FirstLogin from "./FirstLogin/FirstLogin";

export const SECTION_TITLES: { [key: string]: string } = {
  perfil: "Perfil",
  revisoes: "Revisões",
  desafios: "Desafios",
  jogos: "Jogos algébricos",
};

export const SECTION_DESCRIPTIONS: { [key: string]: string } = {
  perfil: "Perfil",
  revisoes: "Revise conceitos e aprenda a resolver problemas usando equação do 1º e 2º grau.",
  desafios: "Conclua desafios algébricos para alcançar conquistas.",
  jogos: "Divirta-se enquanto aprende com os jogos algébricos.",
};

const lessonDataBase = new DataBase({ path: "lesson" });

const userLessonProgressDataBase = new DataBase({ path: "userLessonProgress" });

export type TUserLessonProgress = {
  answers: {
    success: boolean;
    questionId: string;
    userAnswer: string;
    skipped: boolean;
  }[];
  completedInteractions: {
    id: string;
  }[];
  lessonFinished: boolean;
  finishTime: number;
  lessonId: string;
  progress: number;
  maxScreen: {
    absoluteStep: number;
    step: number;
    substep: number;
  };
  userId: string;
};
export interface TLessonProgress extends TLesson {
  progress: TUserLessonProgress;
}

type TSubsection = { title: string; lessons: TLessonProgress[] };

const SectionContentHolder: React.FC = () => {
  const user = useGlobalSelector((state) => {
    return state.auth.getCurrentUser as User;
  });

  const [subsections, setSubsections] = useState<TSubsection[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstLogin, setFirstLogin] = useState(!localStorage.getItem("first-login"))

  let { page } = useParams();

  useEffect(() => {
    const receiveLessonsProgress = (
      lessonsProgressRef: QueryDocumentSnapshot<DocumentData>[],
      lessonsRef: QueryDocumentSnapshot<DocumentData>[]
    ) => {
      let userLessonsProgress: TUserLessonProgress[] = [];

      userLessonsProgress = lessonsProgressRef.map((doc) => {
        const data = doc.data();
        const { createDate, timestamp, ...progress } = data;

        return progress as TUserLessonProgress;
      });

      buildSubsection(lessonsRef, userLessonsProgress);
    };

    const buildSubsection = (
      lessonsRef: QueryDocumentSnapshot<DocumentData>[],
      userLessonsProgress: TUserLessonProgress[]
    ) => {
      const _subsections: TSubsection[] = [];

      lessonsRef.forEach((lessonRef) => {
        const docData = lessonRef.data();
        const { createDate, updateDate, ...lesson } = docData;

        const _lesson = lesson as TLesson;

        let progress = userLessonsProgress.filter(
          (progress) => progress.lessonId === _lesson.id
        )[0];

        if (!progress) {
          progress = {
            answers: [],
            completedInteractions: [],
            lessonFinished: false,
            finishTime: 0,
            lessonId: _lesson.id,
            maxScreen: {
              absoluteStep: 0,
              substep: 0,
              step: 0,
            },
            progress: 0,
            userId: user.uid,
          };
        }

        const subsection: TSubsection = _subsections.filter(
          (subsection) => subsection.title === _lesson.section.title
        )[0];

        if (!subsection) {
          const lessons = [];
          lessons[_lesson.section.index] = { ..._lesson, progress };

          _subsections.push({
            title: _lesson.section.title,
            lessons: lessons,
          });
        } else {
          subsection.lessons[_lesson.section.index] = { ..._lesson, progress };
        }
      });

      setSubsections(_subsections.sort((a, b) => a.title.localeCompare(b.title)));
      setLoading(false);
    };

    const receiveLessons = (lessonsRef: QueryDocumentSnapshot<DocumentData>[]) => {
      userLessonProgressDataBase.listData(
        (lessonsProgressRef) => receiveLessonsProgress(lessonsProgressRef, lessonsRef),
        where("userId", "==", user.uid)
      );
    };

    if (page === "revisoes" || page === "desafios") {
      setLoading(true);
      lessonDataBase.listData(receiveLessons, where("section.page", "==", page));
    }
  }, [page, user]);

  if (page === undefined || !Object.keys(SECTION_TITLES).includes(page)) {
    window.location.href = "/404";

    return null;
  }

  return (
    <>
      {firstLogin && <FirstLogin onClose={()=> setFirstLogin(false)} />}
      <div id="section-content-holder">
        <div>
          {page !== "perfil" && (
            <>
              <div className="section-header">
                <h1 className="section-title heading-1">{SECTION_TITLES[page]}</h1>
                <p className="secondary-body-text section-description">
                  {SECTION_DESCRIPTIONS[page]}
                </p>
              </div>
              {page === "jogos" ? (
                <Games />
              ) : loading ? (
                <Loading positionAbsolute message="Carregando, aguarde." />
              ) : (
                subsections.map((section, i) => {
                  return (
                    <Subsection
                      key={i}
                      items={section.lessons}
                      subPage="licao"
                      title={section.title}
                    />
                  );
                })
              )}
            </>
          )}
          {page === "perfil" && <Profile />}
        </div>
      </div>
    </>
  );
};

export default SectionContentHolder;
