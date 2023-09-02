import React, { useRef } from "react";

import ProfileOptions from "../Settings";

import { ReactComponent as ArrowDown } from "../../../resources/icons/arrow-down.svg";
import { useGlobalSelector } from "../../redux/hooks";
import { User } from "firebase/auth";

const MobileHeader: React.FC = () => {
  const user = useGlobalSelector((state) =>
  state.auth ? (state.auth.getCurrentUser as User) : null
);

  const profileOptionsRef = useRef<HTMLDivElement | null>(null);
  const arrowDownRef = useRef<SVGSVGElement | null>(null);

  const onClick = () => {
    arrowDownRef.current?.classList.toggle("rotate");
    profileOptionsRef.current?.classList.toggle("hidden-element");
  };

  return (
    <header id="mobile-header" className="shadowed-element">
      <span id="logo">LOGO</span>
      <div id="profile">
        <button className="rounded" onClick={onClick}>
          <div id="info">
            <span className="small-text secondary-body-text">{user?.displayName}</span>
          </div>
          <div
            id="avatar"
            style={{
              backgroundImage:
            `url('${user?.photoURL}')`
            }}
          ></div>
          <ArrowDown ref={arrowDownRef} />
        </button>
        <ProfileOptions divRef={profileOptionsRef} />
      </div>
    </header>
  );
};

export default MobileHeader;
