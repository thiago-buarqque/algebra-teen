import React, { useState, useEffect } from "react";

import { Provider, useDispatch } from "react-redux";
import { useLessonCreatorSelector } from "./redux/LessonCreator/hooks";
import LessonCreatorStore from "./redux/LessonCreator/LessonCreatorStore";

import ContentEditor from "./ContentEditor/ContentEditor";
import InteractiveLessonWrapper from "../common/InteractiveLessonWrapper";
import LessonCreatorContentOptions from "./LessonCreatorContentOptions/LessonCreatorContentOptions";

import { DataBase } from "../../firebase/database";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { doSetLesson } from "./redux/LessonCreator/LessonCreatorSlice";

import { TLesson } from "../type";

import "./lessonCreator.scss";

const dataBase = new DataBase({ path: "lesson" });

const LessonCreator: React.FC = () => {
  const dispatch = useDispatch();
  const lesson = useLessonCreatorSelector((state) => state.lesson);
  const [lessons, setLessons] = useState<TLesson[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleLessonsRetrieve = (
    data: QueryDocumentSnapshot<DocumentData>[]
  ) => {
    setLessons(
      data.map((doc) => {
        const data = doc.data();
        const { createDate, updateDate, ...lesson } = data;
        return lesson as TLesson;
      })
    );
  };

  const handleChangeLesson = (lesson: TLesson) => {
    if (unsavedChanges) {
      alert("Você tem mudanças não salvas!");
    } else {
      // @ts-ignore
      const { createDate, updateDate, ..._lesson } = lesson;
      // @ts-ignore
      dispatch(doSetLesson({ lesson: _lesson }));
    }
  };

  const saveLesson = () => {
    if (lessons.some((_lesson) => _lesson.id === lesson.id)) {
      dataBase.update(lesson, lesson.id);
    } else {
      dataBase.create(lesson, lesson.id);
    }

    setUnsavedChanges(false);

    localStorage.setItem("new-lesson", JSON.stringify(lesson));
  };

  useEffect(() => {
    dataBase.listData(handleLessonsRetrieve);
  }, []);

  return (
    <InteractiveLessonWrapper
      lessonTitle={lesson.title}
      lesson={lesson}
      creatorContext>
      <div id="existing-lessons">
        {lessons.map((lesson) => (
          <button key={lesson.id} onClick={() => handleChangeLesson(lesson)}>
            {lesson.title}
          </button>
        ))}
      </div>
      <ContentEditor setUnsavedChanges={setUnsavedChanges} />
      <LessonCreatorContentOptions saveLesson={saveLesson} />
    </InteractiveLessonWrapper>
  );
};

const LessonCreatorProvider = () => {
  return (
    <Provider store={LessonCreatorStore}>
      <LessonCreator />
    </Provider>
  );
};

export default LessonCreatorProvider;
