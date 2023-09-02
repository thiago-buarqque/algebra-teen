import React from "react";

import { ReactComponent as WaveIcon } from "../../../resources/icons/wave-hand.svg";

import "./firstLogin.scss";
import { useGlobalSelector } from "../../redux/hooks";
import { DataBase } from "../../firebase/database";

interface IProps {
    onClose: ()=> void;
}

const FirstLogin: React.FC<IProps> = ({onClose}) => {
  const user = useGlobalSelector((state) => {
    return state.auth.getCurrentUser;
  });

  const handleClose = () => {
    if (!user) return;

    const userDataBase = new DataBase({ path: "user" });

    localStorage.setItem("first-login", "false")
    userDataBase.update({ isNew: false }, user.uid);
    onClose()
  };

  return (
    <div id="first-login">
      <div id="content">
        <WaveIcon />
        <h1 className="heading-2">Bem vindo(a), {user?.displayName?.split(" ")[0]}</h1>
        <p>
          Aqui você encontrará uma série de exercícios e desafios para ajudá-lo(a) a entender os
          conceitos da Álgebra de uma forma prática e envolvente.
        </p>
        <button className="secondary-button" onClick={handleClose}>
          <span>Comece a aprender</span>
        </button>
      </div>
    </div>
  );
};

export default FirstLogin;
