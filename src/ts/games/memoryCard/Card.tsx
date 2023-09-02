import React, { useEffect } from "react";

import { ReactComponent as LetterA } from "../../../resources/icons/letter-a.svg";
import { ReactComponent as QuestionMark } from "../../../resources/icons/big-question-mark.svg";
import { ReactComponent as Exclamation } from "../../../resources/icons/exclamation.svg";
import { TMemoryCard } from "../type";
import katex from "katex";

interface IProps {
  card: TMemoryCard;
  onCardFlip: (id: string) => void;
}

const Card: React.FC<IProps> = ({ card, onCardFlip }) => {
  const handleCardFlip = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!card.pairFound) {
      event.currentTarget.classList.toggle("opened");
      setTimeout(() => onCardFlip(card.id), 750)
      ;
    }
  };

  useEffect(() => {
    (
      Array.from(
        document.getElementsByClassName("card-latex-equation")
      ) as HTMLElement[]
    ).forEach((el) => {
      katex.render(el.getAttribute("d-latex") || "", el, {
        throwOnError: false,
        output: "mathml",
      });
    });
  }, [])

  return (
    <div
    id={"card-"+card.id}
      className={`card shadowed-element ${card.isEquation ? "equation" : ""}`}
      onClick={handleCardFlip}
    >
      <div className="inner">
        <div className="front">
          <div>
            <div className="background">
              <div className="triangle">
                <LetterA />
              </div>
              {card.isEquation ? <QuestionMark /> : <Exclamation />}
              <p>{`Encontre a carta-${card.isEquation ? "descrição" : "equação"} correspondente`}</p>
            </div>
            <div className="content">
              {
                card.isEquation ? (
                    <span className="card-latex-equation" d-latex={card.value}>{card.value}</span>
                ) : (<p>{card.value}</p>)
              }              
            </div>
          </div>
        </div>
        <div className={`back ${card.isEquation ? "equation" : ""}`}>
          <LetterA />
        </div>
      </div>
    </div>
  );
};

export default Card;
