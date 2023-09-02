import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const HOME_PATH = "/";

const App: React.FC = () => {
  let location = useLocation();

  return <>{location.pathname === HOME_PATH && <Navigate to="/revisoes" />}</>;
};

export default App;
