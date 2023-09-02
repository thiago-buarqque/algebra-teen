import { Link } from "react-router-dom";

import { ReactComponent as UserIcon } from "../../../resources/icons/user.svg";
import { ReactComponent as OpenBookIcon } from "../../../resources/icons/book-open.svg";
import { ReactComponent as FlagIcon } from "../../../resources/icons/flag.svg";
import { ReactComponent as PlayIcon } from "../../../resources/icons/play.svg";
import NavBarProfile from "./Profile";

interface props {
  currentSection: string;
}

const DesktopNavBar: React.FC<props> = ({ currentSection }) => {
  return (
    <nav id="desktop-navbar">
      <span id="logo">LOGO</span>      
      <ul id="menu">
        <NavBarLink
          currentSection={currentSection}
          Icon={UserIcon}
          id="perfil"
          label="Seu perfil"
          path="/perfil"
        />
        <NavBarLink
          currentSection={currentSection}
          Icon={OpenBookIcon}
          id="revisoes"
          label="Revisões"
          path="/revisoes"
        />
        <NavBarLink
          currentSection={currentSection}
          Icon={FlagIcon}
          id="desafios"
          label="Desafios"
          path="/desafios"
        />
        <NavBarLink
          currentSection={currentSection}
          Icon={PlayIcon}
          id="jogos"
          label="Jogos"
          path="/jogos"
        />
      </ul>
      <NavBarProfile />
    </nav>
  );
};

interface NavBarLinkProps {
  currentSection: string;
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  id: string;
  label: string;
  path: string;
}

const NavBarLink: React.FC<NavBarLinkProps> = ({ currentSection, Icon, id, label, path }) => (
  <li className={`rounded ${currentSection === id && "main-color-gradient"}`}>
    <Link to={path}>
      <div className="nav-icon">
        <Icon width={18} height={18} />
      </div>
      <span>{label}</span>
    </Link>
  </li>
);

export default DesktopNavBar;
