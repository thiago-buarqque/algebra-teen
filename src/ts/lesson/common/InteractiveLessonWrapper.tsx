import React, { useCallback, useEffect, useRef, useState } from "react";

import { useGlobalSelector } from "../../redux/hooks";

import LessonHeader from "./LessonHeader/LessonHeader";
import SingleColumn from "../InteractiveLesson/steps/SingleColumn";
import TwoColumns from "../InteractiveLesson/steps/TwoColumns";
import StepCreatorWrapper from "../LessonCreator/StepCreator/StepCreatorWrapper";
import { TUserLessonProgress } from "../../pageWrapper/PageWrapper";
import LessonBoard from "./LessonBoard/LessonBoard";

import { User } from "firebase/auth";

import { DataBase } from "../../firebase/database";

import { TLesson, TStepElement } from "../type";

import "../styles/lesson.scss";
import LessonStepper from "./LessonStepper";
import {
  getAchievements,
  renderEquations,
  triggerAchievementsQueries,
  triggerCompletedInteractions,
} from "./util";
import LessonSummaryScreen from "./LessonSummaryScreen/LessonSummaryScreen";
import { TAchievement } from "../../profile/Profile";
import Loading from "../../Loading/Loading";
interface IProps {
  lessonTitle: string;
  lesson: TLesson;
  creatorContext?: boolean;
}

const STEP_ELEMENTS = {
  SINGLE_COLUMN: SingleColumn,
  TWO_COLUMNS_SUBSTEPS: TwoColumns,
  TWO_COLUMNS: TwoColumns,
};

const getEmptyUserProgress = (
  lessonId: string,
  userId: string
): TUserLessonProgress => {
  return {
    answers: [],
    completedInteractions: [],
    lessonFinished: false,
    finishTime: 0,
    lessonId: lessonId,
    maxScreen: {
      absoluteStep: 0,
      substep: 0,
      step: 0,
    },
    progress: 0,
    userId: userId,
  };
};

const userLessonProgressDataBase = new DataBase({ path: "userLessonProgress" });

const InteractiveLessonWrapper: React.FC<React.PropsWithChildren<IProps>> = ({
  children,
  creatorContext,
  lessonTitle,
  lesson,
}) => {
  const user = useGlobalSelector((state) =>
    state.auth ? (state.auth.getCurrentUser as User) : null
  );

  const [absoluteStep, setAbsoluteStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubstep, setCurrentSubstep] = useState(0);
  const [disableNextButton, setDisableNextButton] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [loading, setLoading] = useState(!creatorContext);
  const [maxScreen, setMaxScreen] = useState<TUserLessonProgress["maxScreen"]>({
    absoluteStep: 0,
    step: 0,
    substep: 0,
  });
  const [openWhiteboard, setOpenWhiteboard] = useState(false);
  const [steps, setSteps] = useState<
    React.FunctionComponentElement<TStepElement>[]
  >([]);

  const userLessonProgress = useRef<TUserLessonProgress>(
    getEmptyUserProgress(lesson.id, user ? user.uid : "")
  );
  const lessonQuestions = useRef<TUserLessonProgress["answers"]>([]);
  const totalScreens = useRef(0);
  const lastRegisteredTime = useRef<Date>(new Date());
  const lastRegisteredTimeAmount = useRef<number>(0);
  const userLessonProgressId = useRef<string>("");
  const achievementsOnStart = useRef<TAchievement[]>([]);
  const achievementsOnEnd = useRef<TAchievement[]>([]);

  const finishLesson = useCallback(() => {    
    if (user) {
      userLessonProgressDataBase.update(
        { lessonFinished: true, progress: 1 },
        user.uid + lesson.id
        );
    }
    
    setLessonFinished(true);
  }, [lesson.id, user]);

  const getProgress = () => {
    return Math.round((absoluteStep / totalScreens.current) * 100);
  };

  useEffect(() => {
    const getRawProgress = () => {
      return absoluteStep / totalScreens.current;
    };

    const updateUserLessonProgress = () => {
      if (loading || !user) {
        return;
      }

      const rawProgress = getRawProgress();
      const progress =
        rawProgress < userLessonProgress.current.progress
          ? userLessonProgress.current.progress
          : rawProgress;

      const now = new Date();

      lastRegisteredTimeAmount.current +=
        now.getTime() - lastRegisteredTime.current.getTime();

      lastRegisteredTime.current = now;

      userLessonProgressDataBase.update(
        {
          maxScreen: maxScreen,
          progress: progress,
          finishTime: lastRegisteredTimeAmount.current,
        },
        userLessonProgressId.current
      );

      userLessonProgress.current.finishTime = lastRegisteredTimeAmount.current;
    };

    updateUserLessonProgress();
  }, [absoluteStep, loading, maxScreen, user, lessonFinished]);

  useEffect(() => {
    const setTotalScreens = () => {
      let total = 0;

      steps.forEach((step) => {
        if (step.props.step.variation === "TWO_COLUMNS_SUBSTEPS") {
          const subcontent = step.props.step.content[1];
          subcontent.content?.forEach(() => {
            total += 1;
          });
        } else {
          total += 1;
        }
      });

      totalScreens.current = total;
    };

    setTotalScreens();

    if (creatorContext) {
      renderEquations();
    }
  }, [creatorContext, steps]);

  useEffect(() => {
    setSteps(
      lesson.steps.map((step, i) =>
        React.createElement(
          creatorContext ? StepCreatorWrapper : STEP_ELEMENTS[step.variation],
          {
            key: i,
            step: step,
            stepNumber: i,
          }
        )
      )
    );

    const registerEmptyUserProgress = (
      userLessonProgress: TUserLessonProgress
    ) => {
      userLessonProgressDataBase.create(
        userLessonProgress,
        user?.uid + lesson.id
      );
    };

    if (user) {
      userLessonProgressDataBase.getById(user.uid + lesson.id, (docRef) => {
        let _userLessonProgress = getEmptyUserProgress(lesson.id, user.uid);

        if (!docRef.exists()) {
          registerEmptyUserProgress(_userLessonProgress);
        } else {
          _userLessonProgress = docRef.data() as TUserLessonProgress;
        }

        userLessonProgress.current = _userLessonProgress;

        const maxScreen = _userLessonProgress.maxScreen;

        if (!_userLessonProgress.lessonFinished) {
          setAbsoluteStep(maxScreen.absoluteStep);
          setCurrentStep(maxScreen.step);
          setCurrentSubstep(maxScreen.substep);
          setMaxScreen(maxScreen);

          lastRegisteredTimeAmount.current = _userLessonProgress.finishTime;
          lessonQuestions.current = _userLessonProgress.answers;
          userLessonProgressId.current = user.uid + lesson.id;
        }

        setLessonFinished(_userLessonProgress.lessonFinished);
        setLoading(false);
      });
    }
  }, [creatorContext, lesson, user]);

  useEffect(() => {
    console.log(`Lesson finished: ${lessonFinished}`);
  }, [lessonFinished]);

  useEffect(() => {
    if (!loading) {
      triggerCompletedInteractions(
        userLessonProgress.current.completedInteractions
      );
      if (!creatorContext) {
        renderEquations();
        getAchievements((achievements) => {
          achievementsOnStart.current = achievements;
        }, user?.uid || "");
      }
    }
  }, [creatorContext, lesson, loading, user]);

  useEffect(() => {
    if (lessonFinished && !creatorContext) {
      triggerAchievementsQueries(() => {
        getAchievements((achievements) => {
          achievementsOnEnd.current = achievements;
        }, user?.uid || "");
      });
    }
  }, [lessonFinished, creatorContext, user]);

  if (loading) {
    return <Loading positionAbsolute message="Quase lá..." />;
  }

  return (
    <div id="interactive-lesson" className={lessonFinished ? "finished" : ""}>
      <LessonHeader
        title={lessonTitle}
        progress={lessonFinished ? 100 : getProgress()}
        openWhiteboard={() => setOpenWhiteboard(true)}
      />
      <LessonBoard
        onClose={() => setOpenWhiteboard(false)}
        show={openWhiteboard}
      />
      <LessonStepper
        absoluteStep={absoluteStep}
        currentStep={currentStep}
        currentSubstep={currentSubstep}
        disableNextButton={disableNextButton}
        lessonFinished={lessonFinished}
        lessonQuestions={lessonQuestions}
        maxScreen={maxScreen}
        onFinishLesson={finishLesson}
        setAbsoluteStep={setAbsoluteStep}
        setCurrentStep={setCurrentStep}
        setCurrentSubstep={setCurrentSubstep}
        setDisableNextButton={setDisableNextButton}
        setMaxScreen={setMaxScreen}
        steps={steps}
        totalScreens={totalScreens.current}
        userLessonProgress={userLessonProgress}
        userLessonProgressId={userLessonProgressId.current}>
        <LessonSummaryScreen
          finished={lessonFinished}
          userLessonProgress={userLessonProgress.current}
          lesson={lesson}
          achievementsOnEnd={achievementsOnEnd}
          achievementsOnStart={achievementsOnStart}
        />
      </LessonStepper>
      {children}
    </div>
  );
};

export default InteractiveLessonWrapper;
