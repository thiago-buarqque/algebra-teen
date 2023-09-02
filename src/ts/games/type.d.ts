import { TCard } from "../lesson/type";

export type TUserGameMatch = {
    gameId: string;
    matchId: string;
    time: number;
    userId: string;
}

export type TGame = {
  card: TCard;
  id: string;
  title: string;
};

export type TMemoryCard = {
  id: string;
  isEquation: boolean;
  pair: string;
  value: string;
  pairFound?: boolean;
}