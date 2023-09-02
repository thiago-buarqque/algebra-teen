import React from "react";

import GirlAngry from "../../resources/illustrations/girl-angry.jpg";

import "./notFoundError.scss";

const NotFoundError = () => {
  return (
    <div id="not-found-error">
      <div>
        <img src={GirlAngry} alt="404" />
        <div id="content">
          <h1>OH NÃO!</h1>
          <p id="message">
            Parece que você está procurando uma página que não existe.
          </p>
          <button
            className="primary-button"
            onClick={() => (window.location.href = "/")}>
            <span>Ir para a página inicial</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundError;
