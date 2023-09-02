import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import InteractiveLessonWrapper from "../common/InteractiveLessonWrapper";

import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { DataBase } from "../../firebase/database";

import { TLesson } from "../type";
import Loading from "../../Loading/Loading";

const InteractiveLesson = () => {
  const [lesson, setLesson] = useState<TLesson | null>(null);

  let { id: lessonId } = useParams();

  useEffect(() => {
    const dataBase = new DataBase({path: "lesson"})

    dataBase.getById(lessonId || "", (lessonRef: DocumentSnapshot<DocumentData>) => {
      const data = lessonRef.data()

      if(!data) {
        window.location.href = "/404"
        return;
      }

      const { createDate, updateDate, ...lesson } = data

      setLesson(lesson as TLesson)
    })
  }, [lessonId]);

  if(!lesson) {
    return (
      <><Loading message="Aguarde, carregando a lição." /></>
    )
  }

  return (
    <InteractiveLessonWrapper
      lessonTitle={lesson.title}
      lesson={lesson}
    />
  );
};

export default InteractiveLesson;
