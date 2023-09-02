import React from "react";

import "./login.scss";
import { Auth } from "../firebase/auth";
import { onUserLogin } from "./util";

const auth = new Auth();

const Login: React.FC = () => {
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    auth.signIn(onUserLogin);
  };
  return (
    <div id="login-page">
      <div>
        <div id="content">
          <form method="post" onSubmit={handleLogin}>
            <div id="login-message">
              <p>Olá!</p>
              <span>Faça login para continuar.</span>
            </div>
            <button type="submit" id="login" className="shadowed-element">
              <img
                src={process.env.PUBLIC_URL + `resources/google.png`}
                alt="Google logo"
              />
              <span>Entrar com o Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
