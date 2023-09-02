import { DataBase } from "../../firebase/database";
import { TUserLessonProgress } from "../../pageWrapper/PageWrapper";
import katex from "katex";
import { TAchievement } from "../../profile/Profile";
import { where } from "firebase/firestore";

export const completeQuestionVisually = (
  userAnswer: TUserLessonProgress["answers"][0]
) => {
  const questionForm = document.getElementById(
    "question-" + userAnswer.questionId
  );

  document
    .getElementById(
      `question-${userAnswer.questionId}-option-${userAnswer.userAnswer}-visual`
    )
    ?.click();
  questionForm?.classList.add(
    userAnswer.success ? "question-success" : "question-failure"
  );

  const btnCloseExplanation = document.getElementById(
    "btn-close-explanation-" + userAnswer.questionId
  );

  if (btnCloseExplanation) {
    const btnOpenExplanation = document.getElementById(
      "btn-open-explanation-question-" + userAnswer.questionId
    );

    if (btnOpenExplanation) {
      btnOpenExplanation.style.display = "block";
    }
  }
};

export const triggerCompletedInteractions = (
  completedInteractions: TUserLessonProgress["completedInteractions"]
) => {
  completedInteractions.forEach((interaction) => {
    const button = document.getElementById(interaction.id);

    button?.setAttribute("already-completed", "true");
    button?.click();
  });
};

export const renderEquations = () => {
  (
    Array.from(
      document.getElementsByClassName("lesson-equation")
    ) as HTMLElement[]
  ).forEach((el) => {
    katex.render(el.getAttribute("latex") || "", el, {
      throwOnError: false,
      output: "mathml",
    });
  });
};

export const getAchievements = (
  callback: (achievements: TAchievement[]) => void,
  userId: string
) => {
  const dataBase = new DataBase({ path: "achievements" });

  dataBase.listData((refs) => {
    callback(
      refs.map((doc) => {
        return doc.data() as TAchievement;
      })
    );
  }, where("userId", "==", userId));
};

export const triggerAchievementsQueries = (callback: () => void) => {
  const dataBase = new DataBase({ path: "achievements" });
  dataBase.listData((refs) => {
    refs.forEach((doc) => {
      const achievement = doc.data() as TAchievement;
      // eslint-disable-next-line no-new-func
      const _function = new Function(achievement.query);
      _function();
    });
    setTimeout(callback, 2000)
  });
};
