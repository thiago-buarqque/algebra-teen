import React from "react";
import { Navigate, useParams } from "react-router-dom";

import MobileNavBar from "./Mobile/MobileNavBar";
import DesktopNavBar from "./Desktop/DesktopNavBar";
import MobileHeader from "./Mobile/MobileHeader";

import { SECTION_TITLES } from "../pageWrapper/PageWrapper";

import "./navBar.scss";

const NavBar: React.FC = () => {
  let { page } = useParams();

  if (!page || !Object.keys(SECTION_TITLES).includes(page)) {
    return <Navigate to={"/perfil"} />;
  }

  return (
    <>
      <MobileHeader />
      <DesktopNavBar currentSection={page} />
      <MobileNavBar currentSection={page} />
    </>
  );
};

export default NavBar;
