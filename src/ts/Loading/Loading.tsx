import React from "react";

import { ReactComponent as LoadingIcon } from "../../resources/icons/loading.svg";

import "./loading.scss";

interface IProps {
  message?: string;
  positionAbsolute?: boolean
}

const Loading: React.FC<React.PropsWithChildren<IProps>> = ({
  children,
  message,
  positionAbsolute
}) => {
  return (
    <div className={`loading-container ${positionAbsolute ? "absolute" : ""}`}>
      <LoadingIcon />
      <p id="message">{message}</p>
      {children}
    </div>
  );
};

export default Loading;
