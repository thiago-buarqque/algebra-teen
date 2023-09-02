import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as UserIcon } from "../../../resources/icons/user.svg";
import { ReactComponent as OpenBookIcon } from "../../../resources/icons/book-open.svg";
import { ReactComponent as FlagIcon } from "../../../resources/icons/flag.svg";
import { ReactComponent as PlayIcon } from "../../../resources/icons/play.svg";

interface props {
  currentSection: string;
}

const MobileNavBar: React.FC<props> = ({ currentSection }) => {
  return (
    <nav id="mobile-navbar" className="shadowed-element">
      <ul>
        <NavBarLink
          currentSection={currentSection}
          Icon={UserIcon}
          id={"perfil"}
          label={"Seu perfil"}
          path={"/perfil"}
        />
        <NavBarLink
          currentSection={currentSection}
          Icon={OpenBookIcon}
          id={"revisoes"}
          label={"Revisões"}
          path={"/revisoes"}
        />
        <NavBarLink
          currentSection={currentSection}
          Icon={FlagIcon}
          id={"desafios"}
          label={"Desafios"}
          path={"/desafios"}
        />
        <NavBarLink
          currentSection={currentSection}
          Icon={PlayIcon}
          id={"jogos"}
          label={"Jogos"}
          path={"/jogos"}
        />
      </ul>
    </nav>
  );
};

const NavBarLink: React.FC<{
  currentSection: string;
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  id: string;
  label: string;
  path: string;
}> = ({ currentSection, Icon, id, label, path }) => (
  <li>
    <Link to={path} className={`${currentSection === id && "current"}`}>
      <Icon width={18} height={18} />
      <span className={`small-text`}>{label}</span>
    </Link>
  </li>
);

export default MobileNavBar;
