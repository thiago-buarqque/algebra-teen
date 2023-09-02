import React, { useState } from "react";

import { ReactComponent as SettingsIcon } from "../../resources/icons/settings.svg";
import { ReactComponent as LogOut } from "../../resources/icons/log-out.svg";
import { ReactComponent as Close } from "../../resources/icons/close.svg";
import { ReactComponent as Contrast } from "../../resources/icons/contrast.svg";

import { DataBase } from "../firebase/database";
import { where } from "firebase/firestore";
import { useGlobalSelector } from "../redux/hooks";

interface props {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
}

const ProfileOptions: React.FC<props> = ({ divRef }) => {
  const auth = useGlobalSelector((state) => {
    return state.auth;
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div
      ref={divRef}
      className="profile-options shadowed-element hidden-element">
      {showSettingsModal && (
        <SettingsModal handleClose={() => setShowSettingsModal(false)} />
      )}
      <button className="settings" onClick={() => setShowSettingsModal(true)}>
        <SettingsIcon />
        <span>Configurações</span>
      </button>
      <button className="log-out" onClick={() => auth.signOut()}>
        <LogOut />
        <span>Desconectar</span>
      </button>
    </div>
  );
};

const SettingsModal: React.FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const auth = useGlobalSelector((state) => {
    return state.auth;
  });
  const localContrastConf = localStorage.getItem("contrast");

  const [highContrast, setHighContrast] = useState(
    localContrastConf && localContrastConf === "true"
  );

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = event.target as HTMLElement;
    const id = target.getAttribute("id");

    if (id && id === "settings-modal") {
      handleClose();
    }
  };

  const handleAccountDelete = () => {
    const userId = auth.getCurrentUser?.uid;

    const removeUser = () => {
      const userDataBase = new DataBase({ path: "user" });
      userDataBase.delete(() => auth.signOut(), where("id", "==", userId));
    };
    const removeUserGameMatches = () => {
      const userGameMatchDataBase = new DataBase({ path: "userGameMatch" });
      userGameMatchDataBase.delete(removeUser, where("userId", "==", userId));
    };
    const removeUserLessonProgress = () => {
      const userLessonProgressDataBase = new DataBase({
        path: "userLessonProgress",
      });
      userLessonProgressDataBase.delete(
        removeUserGameMatches,
        where("userId", "==", userId)
      );
    };
    const removeAchievements = () => {
      const achievementsDataBase = new DataBase({ path: "achievements" });
      achievementsDataBase.delete(
        removeUserLessonProgress,
        where("userId", "==", userId)
      );
    };
    setTimeout(removeAchievements, 500)
  };

  const toggleContrast = () => {
    if (document.body.classList.contains("contrast")) {
      localStorage.setItem("contrast", "false");
      setHighContrast(false);
    } else {
      localStorage.setItem("contrast", "true");
      setHighContrast(true);
    }
    document.body.classList.toggle("contrast");
  };

  return (
    <div
      id="settings-modal"
      className="closable-modal"
      onClick={handleBackgroundClick}>
      <div className="shadowed-element">
        <button id="close-button" onClick={handleClose}>
          <Close />
        </button>
        <h2 className="subheading">Configurações</h2>
        <div className="section">
          <span>Acessibilidade</span>
          <button className="tertiary-button small" onClick={toggleContrast}>
            <Contrast />
            <span>{highContrast ? "Diminuir" : "Aumentar"} contraste</span>
          </button>
        </div>
        <button
          id="delete-account-button"
          type="button"
          onClick={handleAccountDelete}>
          <span>Excluir minha conta</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileOptions;
