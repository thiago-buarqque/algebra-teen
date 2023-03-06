import React from "react";

import { ReactComponent as UserIcon } from "../../resources/icons/interface-user-circle.svg";
import { ReactComponent as OpenBookIcon } from "../../resources/icons/interface-content-book-open.svg";
import { ReactComponent as FlagIcon } from "../../resources/icons/travel-map-triangle-flag.svg";
import { ReactComponent as PlayIcon } from "../../resources/icons/entertainment-control-button-play.svg";
import { ReactComponent as SettingsIcon } from "../../resources/icons/settings.svg";
import { ReactComponent as ArrowDown } from "../../resources/icons/arrow-down.svg";

import { Link } from "react-router-dom";

const DesktopNavBar = () => (
  <nav id="desktop-navbar">
    <span id="logo">LOGO</span>
    <div id="profile" className="rounded">
      <div id="avatar"></div>
      <div id="info">
        <span>Mariana</span>
      </div>
    </div>

    <ul id="menu">
      <li className="rounded">
        <Link to="/perfil">
          <div className="nav-icon">
            <UserIcon width={18} height={18} />
          </div>
          <span>Seu perfil</span>
        </Link>
      </li>
      <li className="main-color-gradient rounded">
        <Link to="/revisoes">
          <div className="nav-icon">
            <OpenBookIcon width={18} height={18} />
          </div>
          <span>Revisão</span>
        </Link>
      </li>
      <li className="rounded">
        <Link to="/desafios">
          <div className="nav-icon">
            <FlagIcon width={18} height={18} />
          </div>
          <span>Desafios</span>
        </Link>
      </li>
      <li className="rounded">
        <Link to="/jogos">
          <div className="nav-icon">
            <PlayIcon width={18} height={18} />
          </div>
          <span>Jogos</span>
        </Link>
      </li>
    </ul>

    <button id="settings">
      <SettingsIcon />
      <span>Configurações</span>
    </button>
  </nav>
);

const MobileNavBar = () => {
  return (
    <nav id="mobile-navbar" className="shadowed-element">
      <ul>
        <li>
          <Link to={"/perfil"}>
            <UserIcon width={18} height={18} />
            <span className="small-text">Seu perfil</span>
          </Link>
        </li>
        <li>
          <Link to={"/revisoes"}>
            <OpenBookIcon width={18} height={18} />
            <span className="small-text">Revisão</span>
          </Link>
        </li>
        <li>
          <Link to={"/desafios"}>
            <FlagIcon width={18} height={18} />
            <span className="small-text">Desafios</span>
          </Link>
        </li>
        <li>
          <Link to={"/jogos"}>
            <PlayIcon width={18} height={18} />
            <span className="small-text">Jogos</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const MobileHeader = () => (
  <header id="mobile-header" className="shadowed-element">
    <span id="logo">LOGO</span>
    <div id="profile" className="rounded">
      <div id="info">
        <span className="small-text secondary-body-text">Mariana</span>
      </div>
      <div id="avatar"></div>
      <ArrowDown />
    </div>
  </header>
);

const NavBar = () => {
  return (
    <>
      <MobileHeader />
      <DesktopNavBar />
      <MobileNavBar />
    </>
  );
};

export default NavBar;
