import React, { useEffect, useState } from "react";
import { DataBase } from "../firebase/database";
import { User } from "firebase/auth";
import { useGlobalSelector } from "../redux/hooks";

import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

import Subsection from "../pageWrapper/Subsection/Subsection";
import Loading from "../Loading/Loading";
import { TGame } from "./type";

const gameDataBase = new DataBase({ path: "game" });

const Games = () => {
  const [loading, setLoading] = useState(true);

  const user = useGlobalSelector((state) => {
    return state.auth.getCurrentUser as User;
  });

  const [games, setGames] = useState<TGame[]>([]);

  useEffect(() => {
    gameDataBase.listData((data: QueryDocumentSnapshot<DocumentData>[]) => {
      setGames(data.map((game) => game.data() as TGame));
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <Loading positionAbsolute message="Carregando, aguarde." />;
  }

  return <Subsection items={games} subPage="jogo" />;
};

export default Games;
