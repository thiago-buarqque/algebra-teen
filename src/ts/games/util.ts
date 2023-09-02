import { User } from "firebase/auth";
import { DataBase } from "../firebase/database";
import { generateRandomId } from "../lesson/LessonCreator/util";
import { TUserGameMatch } from "./type";

export const registerMatch = (user: User, gameId: string, time: number) => {
  if(user) {
    const userGameMatchDatabase = new DataBase({ path: "userGameMatch" });

    const match: TUserGameMatch = {
      gameId: gameId,
      matchId: generateRandomId(),
      time: time,
      userId: user.uid
    }

    userGameMatchDatabase.create(match)
  }
}