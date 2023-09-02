import React from "react";
import SubsectionCard from "./SubsectionCard";

import { TLessonProgress } from "../PageWrapper";
import { useParams } from "react-router-dom";
import { TGame } from "../../games/type";

interface props {
  items: TLessonProgress[] | TGame[];
  title?: string;
  subPage: string;
}

const Subsection: React.FC<props> = ({ items, subPage, title }) => {
  let { page } = useParams();

  return (
    <div className="subsection">
      {title && <h2 className="subsection-title subheading-semi">{title}</h2>}
      <div className="subsection-cards">
        {items.map((item, i) => {
          const card = item.card;
          return (
            <SubsectionCard
              key={i}
              backgroundColor={card.background}
              backgroundImage={process.env.PUBLIC_URL + `resources/${card.image}`}
              description={card.description}
              href={`${page}/${subPage}/${item.id}`}
              title={card.title}
              // @ts-ignore
              progress={item.progress ? item.progress.progress : 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Subsection;
