import { useRef } from "react";

import { ReactComponent as ArrowDown } from "../../../resources/icons/arrow-down.svg";
import ProfileOptions from "../Settings";
import { useGlobalSelector } from "../../redux/hooks";

const NavBarProfile: React.FC = () => {
  const user = useGlobalSelector((state) => {
    return state.auth.getCurrentUser;
  });

  const optionsDivRef = useRef<HTMLDivElement | null>(null);
  const arrowDownRef = useRef<SVGSVGElement | null>(null);

  const onClick = () => {
    arrowDownRef.current?.classList.toggle("rotate");
    optionsDivRef.current?.classList.toggle("hidden-element");
  };

  return (
    <div id="profile">
      <button className="rounded" onClick={onClick}>
        <div
          id="avatar"
          style={{
            backgroundImage: `url('${user?.photoURL}')`,
          }}
        ></div>
        <div id="info">
          <span>{user?.displayName}</span>
          <span className="small-text">9º ano</span>
          <ArrowDown ref={arrowDownRef} />
        </div>
      </button>
      <ProfileOptions divRef={optionsDivRef} />
    </div>
  );
};

export default NavBarProfile;
