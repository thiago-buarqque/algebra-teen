// @ts-nocheck
import { User } from "firebase/auth";
import { DataBase } from "../firebase/database";

const BASE_LESSON_QUERY = `
    const lessonDataBase = new window.DataBase({ path: "lesson" });

    lessonDataBase.listData((lessons) => {
        const userLessonProgressDataBase = new window.DataBase({
        path: "userLessonProgress",
        });

        const countFinishedLessons = (
            currentLesson,
            nextLessonIndex,
            lessonsFinished
        ) => {
        if (currentLesson) {
            userLessonProgressDataBase.getById(
            window.currentUser.uid + currentLesson.data().id,
            (progressRef) => {
                if (progressRef.exists()) {
                  const progressData = progressRef.data();

                  if (progressData["lessonFinished"]) {
                      lessonsFinished += 1;
                  }

                }
                countFinishedLessons(
                    lessons[nextLessonIndex],
                    nextLessonIndex + 1,
                    lessonsFinished
                );
            }
            );
        } else if(lessonsFinished>0) {
            const achievementsDataBase = new window.DataBase({
            path: "achievements",
            });
            achievementsDataBase.update(
            { currentProgress: lessonsFinished },
            "$[id]"
            );
        }
        };

        countFinishedLessons(lessons[0], 1, 0);
    }, $[conditions]);
`;

const ACHIEVEMENTS = [
  {
    query: BASE_LESSON_QUERY.replaceAll(
      "$[conditions]",
      `window.firebase.conditions.where("section.title", "==", "Conceito de equação")`
    ),
    title: "Iniciante",
    description: 'Conclua todas as revisões da seção "Conceito de equação".',
    totalProgress: 1,
    id: "1",
    background: "#96C5FD",
    backgroundImage: "girl.png",
  },
  {
    query: BASE_LESSON_QUERY.replaceAll(
      "$[conditions]",
      `window.firebase.conditions.where("section.title", "==", "Equação do 1º grau"), window.firebase.conditions.where("section.page", "==", "revisoes")`
    ),
    title: "Aventureiro(a)",
    description: 'Conclua todas as revisões da seção "Equação do 1º grau".',
    totalProgress: 2,
    id: "2",
    background: "#E8C0FF",
    backgroundImage: "astronaut-1.png",
  },
  {
    query: BASE_LESSON_QUERY.replaceAll(
      "$[conditions]",
      `window.firebase.conditions.where("section.title", "==", "Equação do 2º grau"), window.firebase.conditions.where("section.page", "==", "revisoes")`
    ),
    title: "Mestre das Equações",
    description: 'Conclua todas as revisões da seção "Equação do 2º grau".',
    totalProgress: 2,
    id: "3",
    background: "#6CF4A5",
    backgroundImage: "astronaut-2.png",
  },
  {
    query: BASE_LESSON_QUERY.replaceAll(
      "$[conditions]",
      `window.firebase.conditions.where("section.page", "==", "revisoes")`
    ),
    title: "Especialista",
    description: "Conclua todas as revisões.",
    totalProgress: 5,
    id: "4",
    background: "#F4A983",
    backgroundImage: "study-owl.png",
  },
  {
    query: BASE_LESSON_QUERY.replaceAll(
      "$[conditions]",
      `window.firebase.conditions.where("section.page", "==", "desafios")`
    ),
    title: "Gênio da Álgebra",
    description: "Conclua todos os desafios.",
    totalProgress: 2,
    id: "5",
    background: "#C3DFFF",
    backgroundImage: "astronaut-1.png",
  },
  {
    // TODO
    query: `
    const lessonDataBase = new window.DataBase({ path: "userGameMatch" });

    lessonDataBase.listData((match) => {
      match.forEach((el) => {
        const data = el.data();

        if(data.userId)

        if(data.time <= 120000) {
          const achievementsDataBase = new window.DataBase({
            path: "achievements",
          });
  
          achievementsDataBase.update(
            { currentProgress: 1 },
            "$[id]"
          );
        }
      })
    }, window.firebase.conditions.where("userId", "==", "$[userId]"), window.firebase.conditions.where("gameId", "==", "memorycard"))`,
    title: "Memória fotográfica",
    description: "Complete um jogo da memória em menos de 2 minutos.",
    totalProgress: 1,
    id: "6",
    background: "#A1CEC5",
    backgroundImage: "brain.png",
  },
  {
    // TODO
    query: `
    const lessonDataBase = new window.DataBase({ path: "userGameMatch" });

    lessonDataBase.listData((match) => {
      if(match.length > 0)  {
        const achievementsDataBase = new window.DataBase({
          path: "achievements",
        });

        achievementsDataBase.update(
          { currentProgress: 1 },
          "$[id]"
        );
      }
    }, window.firebase.conditions.where("userId", "==", "$[userId]"), window.firebase.conditions.where("gameId", "==", "crossword"))`,
    title: "Intelectual",
    description: "Complete uma palavra cruzada.",
    totalProgress: 1,
    id: "7",
    background: "#26807C",
    backgroundImage: "crosswords.png",
  },
];

export const handleFirstLogin = (user: User) => {
  const createUserAchievements = () => {
    const achievementsDataBase = new DataBase({ path: "achievements" });

    ACHIEVEMENTS.forEach((achievement) => {
      let query = achievement.query.replaceAll("$[id]", user.uid + achievement.id);
      query = query.replaceAll("$[userId]", user.uid);

      achievementsDataBase.create(
        {
          ...achievement,
          query,
          currentProgress: 0,
          userId: user.uid,
        },
        user.uid + achievement.id
      );
    });
  };

  createUserAchievements();
};

export const onUserLogin = async (user: User) => {
  const userDataBase = new DataBase({ path: "user" });

  const saveUserEntity = async () => {
    await userDataBase.create({ uid: user.uid, email: user.email, isNew: true }, user.uid);
    window.location.href = "/revisoes";
  };

  await saveUserEntity();
};
