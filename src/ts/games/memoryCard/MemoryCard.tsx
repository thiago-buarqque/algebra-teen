import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "./memoryCards.scss";

import Card from "./Card";
import { registerMatch } from "../util";
import GameWrapper from "../gameWrapper/GameWrapper";

import { DataBase } from "../../firebase/database";
import { useGlobalSelector } from "../../redux/hooks";
import { User } from "firebase/auth";
import { TMemoryCard } from "../type";

const cardDatabase = new DataBase({ path: "memoryCardAsset" });

const CONGRATULATIONS_MESSAGES = ["Eita que memória boa 🧠", "Tu tira onda pow 😎"];

const MemoryCard = () => {
  const user = useGlobalSelector((state) =>
    state.auth ? (state.auth.getCurrentUser as User) : null
  );
  
  const { page } = useParams();

  const [cards, setCards] = useState<TMemoryCard[]>([]);
  const [finished, setFinished] = useState(false);

  const openedCard = useRef<TMemoryCard | null>(null);

  const congratulationMessage = useRef(
    CONGRATULATIONS_MESSAGES[Math.floor(Math.random() * CONGRATULATIONS_MESSAGES.length)]
  );

  const onCardFlip = (id: string) => {
    const openingCard = cards.filter((card) => card.id === id)[0];
    if (!openingCard) {
      // alert("Um erro ocorreu, atualize a página e tente novamente.");
      return;
    }
    if (openedCard.current) {
      if (openedCard.current.id === openingCard.id) {
        openedCard.current = null;
      } else {
        const _cards = [...cards];
        if (openingCard.pair === openedCard.current.id) {
          _cards.forEach((card) => {
            if (card.id === openedCard.current?.id || card.id === openingCard.id) {
              card.pairFound = true;
            }
          });

          setCards([..._cards]);
        } else {
          document.getElementById("card-" + openingCard.id)?.classList.toggle("opened");
          document.getElementById("card-" + openedCard.current.id)?.classList.toggle("opened");
        }
        openedCard.current = null;
      }
    } else {
      openedCard.current = openingCard;
    }
  };

  const onRestart = () => {
    const _cards = [...cards];

    _cards.forEach((card) => (card.pairFound = false));

    setCards(_cards);
  };  

  const onMatchEnd = (time: number) => {
    if(user) {
      registerMatch(user, "memorycard", time);
    }
  }

  useEffect(() => {
    cardDatabase.listData((data) => {
      let _cards = data.map((doc) => {
        const data = doc.data();

        const { createDate, updateDate, ...lesson } = data;

        return lesson as TMemoryCard;
      });

      setCards(_cards.sort(() => 0.5 - Math.random()));
    });
  }, []);

  useEffect(() => {
    if(cards.length) {
      const isGameFinished = cards.every((card) => card.pairFound);
  
      if (isGameFinished) {
        setFinished(true);
      }
    }
  }, [cards]);

  return (
    <GameWrapper
      homeHref={"" + page}
      title={"Memória algébrica"}
      onRestart={onRestart}
      finished={finished}
      congratulationsMessage={congratulationMessage.current}
      onMatchEnd={onMatchEnd}
    >
      <div id="cards-wrapper" className={finished ? "invisible-element" : "show"}>
        <div id="cards">
          {cards.map((card) => (
            <Card key={card.id} card={card} onCardFlip={onCardFlip} />
          ))}
        </div>
      </div>
    </GameWrapper>
  );
};

export default MemoryCard;
