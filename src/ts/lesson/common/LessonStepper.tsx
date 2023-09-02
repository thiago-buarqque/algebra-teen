import React, { useCallback, useEffect, useRef } from "react";
import { TContent, TStep, TStepElement } from "../type";
import { TUserLessonProgress } from "../../pageWrapper/PageWrapper";
import LessonStepControls from "./LessonStepControls";
import { completeQuestionVisually } from "./util";
import { DataBase } from "../../firebase/database";

const userLessonProgressDataBase = new DataBase({ path: "userLessonProgress" });

interface IProps {
  absoluteStep: number;
  currentStep: number;
  currentSubstep: number;
  disableNextButton: boolean;
  lessonFinished: boolean;
  lessonQuestions: React.MutableRefObject<TUserLessonProgress["answers"]>;
  maxScreen: TUserLessonProgress["maxScreen"];
  onFinishLesson: () => void;
  setAbsoluteStep: (value: number) => void;
  setCurrentStep: (value: number) => void;
  setCurrentSubstep: (value: number) => void;
  setDisableNextButton: (value: boolean) => void;
  setMaxScreen: (value: TUserLessonProgress["maxScreen"]) => void;
  steps: React.FunctionComponentElement<TStepElement>[];
  totalScreens: number;
  userLessonProgress: React.MutableRefObject<TUserLessonProgress>;
  userLessonProgressId: string;
}

const LessonStepper: React.FC<React.PropsWithChildren<IProps>> = ({
  absoluteStep,
  children,
  currentStep,
  currentSubstep,
  disableNextButton,
  lessonFinished,
  lessonQuestions,
  maxScreen,
  onFinishLesson,
  setAbsoluteStep,
  setCurrentStep,
  setCurrentSubstep,
  setDisableNextButton,
  setMaxScreen,
  steps,
  totalScreens,
  userLessonProgress,
  userLessonProgressId,
}) => {
  const stepsRef = useRef<HTMLDivElement | null>(null);

  const handleSubstep = useCallback(
    (
      newAbsoluteStep: number,
      action: "back" | "forward",
      actionDigit: number,
      step: TStep
    ) => {
      const substepsHolder = step.content[1];

      if (!substepsHolder.content) {
        console.error("Invalid TWO_COLUMNS_SUBSTEPS substeps holder.");
        return;
      }

      const substeps = substepsHolder.content.length;

      if (
        action === "forward" &&
        currentSubstep === substeps - 1 &&
        currentStep < steps.length - 1
      ) {
        const newStep = currentStep + actionDigit;

        if (newStep < steps.length - 1) {
          setCurrentSubstep(0);
          setMaxScreen({
            ...maxScreen,
            absoluteStep: newAbsoluteStep,
            substep: 0,
          });
        }

        console.log("1- newStep >=steps.length");
        console.log(newStep)
        console.log(steps.length)
        if (newStep >= steps.length) {
          onFinishLesson();
        } else {
          if (newStep > maxScreen.step) {
            setMaxScreen({
              absoluteStep: newAbsoluteStep,
              substep: maxScreen.substep,
              step: newStep,
            });
          }

          setCurrentStep(newStep);
        }
      } else if (
        currentSubstep + actionDigit >= 0 &&
        currentSubstep + actionDigit < substeps
      ) {
        const newSubstep = currentSubstep + actionDigit;

        if (newSubstep > maxScreen.substep && currentStep >= maxScreen.step) {
          setMaxScreen({
            absoluteStep: newAbsoluteStep,
            substep: newSubstep,
            step: maxScreen.step,
          });
        }

        setCurrentSubstep(newSubstep);
      } else if (action === "back" && currentSubstep === 0 && currentStep > 0) {
        const newStep = currentStep - 1;

        if (newStep > maxScreen.step) {
          setMaxScreen({
            absoluteStep: newAbsoluteStep,
            substep: maxScreen.substep,
            step: newStep,
          });
        }

        setCurrentStep(newStep);
      } else if(action === "forward" && currentSubstep + 1 >= steps.length) {
          onFinishLesson()
      }
    },
    [
      currentStep,
      currentSubstep,
      maxScreen,
      onFinishLesson,
      setCurrentStep,
      setCurrentSubstep,
      setMaxScreen,
      steps,
    ]
  );

  const step = useCallback(
    (action: "back" | "forward") => {
      
      const actionDigit = action === "back" ? -1 : 1;

      let newAbsoluteStep = absoluteStep;
      if (
        (action === "back" && absoluteStep > 0) ||
        (action === "forward" && absoluteStep < totalScreens)
      ) {
        newAbsoluteStep = absoluteStep + actionDigit;
        setAbsoluteStep(newAbsoluteStep);
      }

      const step = steps[currentStep].props.step;

      const newStep = currentStep + actionDigit;

      if (step.variation === "TWO_COLUMNS_SUBSTEPS") {
        handleSubstep(newAbsoluteStep, action, actionDigit, step);
      } else if (action === "forward" && newStep >= steps.length) {
        onFinishLesson();
      } else if (newStep >= 0 && newStep < steps.length) {
        const previousStep = steps[currentStep - 1]?.props.step;

        let newSubstep = maxScreen.substep;
        if (
          action === "forward" &&
          previousStep &&
          previousStep.variation === "TWO_COLUMNS_SUBSTEPS"
        ) {
          setCurrentSubstep(0);
          newSubstep = 0;
        }

        if (newStep > maxScreen.step) {
          setMaxScreen({
            absoluteStep: newAbsoluteStep,
            substep: newSubstep,
            step: newStep,
          });
        }

        setCurrentStep(newStep);

        const newCurrentStep = steps[newStep].props.step;

        if (
          action === "back" &&
          newCurrentStep.variation === "TWO_COLUMNS_SUBSTEPS"
        ) {
          const substeps = newCurrentStep.content[1].content;

          if (substeps) {
            setCurrentSubstep(substeps.length - 1);
          }
        }
      }
    },
    [
      absoluteStep,
      currentStep,
      handleSubstep,
      maxScreen,
      onFinishLesson,
      setAbsoluteStep,
      setCurrentStep,
      setCurrentSubstep,
      setMaxScreen,
      steps,
      totalScreens,
    ]
  );

  useEffect(() => {
    const handleLessonActions = () => {
      if (
        currentStep === maxScreen.step &&
        currentSubstep === maxScreen.substep
      ) {
        let currentScreenContent: TContent[] = step.content;

        if (step.variation === "TWO_COLUMNS_SUBSTEPS") {
          const substeps = step.content[1].content;

          if (!substeps) return;

          currentScreenContent = [step.content[0], substeps[currentSubstep]];
        }

        currentScreenContent.forEach((_content) => {
          if (_content.actions) {
            try {
              const actions: { [key: string]: string } = JSON.parse(
                _content.actions
              );

              setDisableNextButton(!!actions["disableNextButton"]);
            } catch {}
          }
        });
      }
    };

    const handleSubstepElementMove = () => {
      const substepsElement: HTMLDivElement | null = document.querySelector(
        `#substeps-holder-${steps[currentStep].props.step.id}`
      );

      if (substepsElement) {
        substepsElement.style.transform = `translateY(-${
          100 * currentSubstep
        }%)`;
      }
    };

    if (!steps || steps.length === 0) return;

    if (currentStep > steps.length - 1) {
      // Lida quando um passo e excluido durante a criacao da licao
      setCurrentStep(steps.length - 1);
      return;
    }

    let stepNode = steps[currentStep];

    const step = stepNode.props.step;

    if (step.variation === "TWO_COLUMNS_SUBSTEPS") {
      const subElements = step.content[1].content;
      if (subElements && currentSubstep > subElements.length - 1) {
        setCurrentSubstep(subElements.length - 1);
        return;
      }
    }

    handleSubstepElementMove();
    handleLessonActions();
  }, [
    currentStep,
    currentSubstep,
    maxScreen,
    setCurrentStep,
    setCurrentSubstep,
    setDisableNextButton,
    steps,
  ]);

  useEffect(() => {
    const handleStepElementMove = () => {
      if (!stepsRef.current || steps.length === 0) return;

      if (currentStep > steps.length - 1) {
        // Lida quando um passo e excluido durante a criacao da licao
        setCurrentStep(steps.length - 1);
        return;
      }

      stepsRef.current.style.transform = `translateY(-${100 * currentStep}%)`;
    };

    handleStepElementMove();
  }, [currentStep, setCurrentStep, steps]);

  useEffect(() => {
    document.onkeyup = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        step("back")
      } else if(e.key === "ArrowDown") {
        step("forward")
      }
    }

    return () => {
      document.onkeyup = null
    }
  }, [step])


  useEffect(() => {
    const handleQuestionsChange = () => {
      if (userLessonProgressId !== "") {
        userLessonProgressDataBase.update(
          { answers: lessonQuestions.current },
          userLessonProgressId
        );
      }
    };

    const handleLessonEvents = (
      interactiveLesson: HTMLDivElement,
      attributeName: string
    ) => {
      const value = interactiveLesson.getAttribute(
        attributeName
      ) as unknown as string;

      if (attributeName === "actions") {
        const actions: { [key: string]: string } = JSON.parse(value);

        if (!!actions["enableNextButton"]) {
          setDisableNextButton(false);
        }

        if (!!actions["stepForward"]) {
          step("forward");
        }
      } else if (attributeName === "question-register") {
        const completedQuestion = lessonQuestions.current.filter(
          (_question) => _question.questionId === value
        )[0];

        if (completedQuestion && !completedQuestion.skipped) {
          completeQuestionVisually(completedQuestion);
        } else if (!completedQuestion) {
          lessonQuestions.current.push({
            success: false,
            questionId: value,
            userAnswer: "",
            skipped: true,
          });
        }

        handleQuestionsChange();
      } else if (attributeName === "question-completion") {
        try {
          const question = JSON.parse(value) as {
            id: string;
            status: "failure" | "success";
            userAnswer: string;
          };

          const questionRef = lessonQuestions.current.filter(
            (_question) => _question.questionId === question.id
          )[0];

          questionRef.success = question.status === "success";
          questionRef.skipped = false;
          questionRef.userAnswer = question.userAnswer;

          handleQuestionsChange();
        } catch (error) {}
      } else if (attributeName === "completed-interaction") {
        // TODO colocar cada else if em uma funcao em utils
        try {
          const completedInteraction = JSON.parse(
            value
          ) as TUserLessonProgress["completedInteractions"][0];

          const { completedInteractions } = userLessonProgress.current;

          if (
            !completedInteractions.some(
              (_interaction) => _interaction.id === completedInteraction.id
            )
          ) {
            completedInteractions.push(completedInteraction);
            userLessonProgressDataBase.update(
              { completedInteractions },
              userLessonProgressId
            );
          }
        } catch {}
      }
    };

    const interactiveLessonElement =
      document.getElementById("interactive-lesson");

    if (!interactiveLessonElement) return;

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName) {
          handleLessonEvents(
            interactiveLessonElement as HTMLDivElement,
            mutation.attributeName
          );
        }
      }
    });

    observer.observe(interactiveLessonElement, { attributes: true });
  }, [
    step,
    lessonQuestions,
    setDisableNextButton,
    userLessonProgress,
    userLessonProgressId,
  ]);

  return (
    <>
      <div id="lesson-steps-wrapper">
        {children}
        <div ref={stepsRef} id="steps" className={lessonFinished ? "invisible-element" : ""}>
          {steps.map((node) => node)}
        </div>
      </div>
        <LessonStepControls
          onStepBack={() => step("back")}
          onStepForward={() => step("forward")}
          disableNextButton={disableNextButton}
        />
    </>
  );
};

export default LessonStepper;
