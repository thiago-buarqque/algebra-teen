import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import GameWrapper from "../gameWrapper/GameWrapper";

import "./crossword.scss";
import { game, questions } from "./tempGame";
import { User } from "firebase/auth";
import { useGlobalSelector } from "../../redux/hooks";
import { registerMatch } from "../util";

const CONGRATULATIONS_MESSAGES = ["Você é incrível! 👏🎉", "Sabe muito! 🧠"];

const Crossword = () => {
  const user = useGlobalSelector((state) =>
    state.auth ? (state.auth.getCurrentUser as User) : null
  );

  const { page } = useParams();

  const [finished, setFinished] = useState(false);
  const answer = useRef<(string | null)[][]>(
    game.map((row) =>
      row.map((cell) => {
        if (cell === null || !cell.static) {
          return null;
        }

        return cell.value;
      })
    )
  );

  const congratulationMessage = useRef(
    CONGRATULATIONS_MESSAGES[Math.floor(Math.random() * CONGRATULATIONS_MESSAGES.length)]
  );

  const onPlaceLetter = (e: React.ChangeEvent<HTMLInputElement>, row: number, colum: number) => {
    answer.current[row][colum] = e.currentTarget.value;

    gameFinished();
  };

  const gameFinished = () => {
    const _answer = answer.current;

    let allAnswered = true;
    let correctAnswer = true;

    game.forEach((row, i) =>
      row.forEach((row, j) => {
        if (row !== null && !row.static && _answer[i][j] === null) {
          allAnswered = false;
          correctAnswer = false;
        } else if (_answer[i][j] !== null && _answer[i][j] !== row?.value) {
          correctAnswer = false;
        }
      })
    );

    if (allAnswered) {
      if (correctAnswer) {
        setFinished(true)
      } else {
        alert("Wrong answer");
        // set wrong alert message or something
      }
    }
  };

  const onMatchEnd = (time: number) => {
    if(user) {
      registerMatch(user, "crossword", time);
    }
  }

  const onRestart = () => {};

  return (
    <GameWrapper
      homeHref={"" + page}
      title={"Palavras cruzadas"}
      onRestart={onRestart}
      finished={finished}
      congratulationsMessage={congratulationMessage.current}
      style={{ height: "auto" }}
      onMatchEnd={onMatchEnd}
    >
      <div id="crossword">
        <div id="content">
          {game.map((row, i) => {
            return (
              <div className="row" key={i}>
                {row.map((cell, j) => {
                  return (
                    <div
                      className={`cell ${cell?.value ? "active" : ""} ${
                        cell?.static ? "static" : ""
                      }`}
                      key={j}
                    >
                      {cell?.value && (
                        <input
                          type="text"
                          defaultValue={cell?.static ? cell?.value : ""}
                          maxLength={1}
                          onKeyDown={
                            cell?.static
                              ? (e) => {
                                  e.preventDefault();
                                }
                              : undefined
                          }
                          onChange={cell?.static ? undefined : (e) => onPlaceLetter(e, i, j)}
                        />
                      )}

                      {cell && cell.index ? (
                        <>
                          <span className="word-index">{cell.index }</span>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <ol id="questions">
          {questions.map((question) => (
            <li key={question} className="crossword-question">{question}</li>
          ))}
        </ol>
      </div>
    </GameWrapper>
  );
};

export default Crossword;
