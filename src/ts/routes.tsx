import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import InteractiveLesson from "./lesson/InteractiveLesson/InteractiveLesson";
import LessonCreator from "./lesson/LessonCreator/LessonCreator";
import Section from "./section/Section";
import MemoryCard from "./games/memoryCard/MemoryCard";
import NotFoundError from "./NotFoundError/NotFoundError";
import Crossword from "./games/crossword/Crossword";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: ":page",
        children: [
          {
            index: true,
            element: <Section />,
          },
          {
            path: "licao/:id",
            element: <InteractiveLesson />,
          },
          {
            path: "jogo/memorycard",
            element: <MemoryCard />,
          },
          {
            path: "jogo/crossword",
            element: <Crossword />,
          },
        ],
      },
      {
        path: "/criar-licao",
        element: <LessonCreator />,
      },
      {
        path: "/404",
        element: <NotFoundError/>,
      },
    ],
  },
]);

export default router;
