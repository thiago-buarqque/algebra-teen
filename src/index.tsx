import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { useGlobalSelector } from "./ts/redux/hooks";
import GlobalStore from "./ts/redux/GlobalStore";

import routes from "./ts/routes";

import "./styling/normalize.css";
import "./styling/index.scss";

import Login from "./ts/login/Login";
import { WhereFilterOp, where } from "firebase/firestore";
import Loading from "./ts/Loading/Loading";
import { DataBase } from "./ts/firebase/database";
import { handleFirstLogin } from "./ts/login/util";

if (localStorage.getItem("contrast") === "true") {
  document.body.classList.add("contrast");
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

// @ts-ignore
window.firebase = {
  conditions: {
    where: (field: string, comparator: WhereFilterOp, value: any) =>
      where(field, comparator, value),
  },
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [requireAuthentication, setRequireAuthentication] = useState(false);

  const auth = useGlobalSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    function onAuthStateChanged() {
      auth?.auth.onAuthStateChanged((nextOrObserver) => {
        if (!nextOrObserver) {
          setRequireAuthentication(true);
        } else {
          setRequireAuthentication(false);
          const currentUser = auth.getCurrentUser;
          // @ts-ignore
          window.currentUser = currentUser;

          const userDataBase = new DataBase({ path: "user" });

          userDataBase.getById(currentUser?.uid || "", (doc) => {
            if (doc.exists() && currentUser) {
              const data = doc.data();
              if (data.isNew) {
                localStorage.setItem("first-login", "true")
                userDataBase.update({isNew: false}, currentUser.uid)
                handleFirstLogin(currentUser)
              }
            }
          });
        }
        setLoading(false);
      });
    }

    onAuthStateChanged();
  }, [auth]);

  if (loading) {
    return <>{<Loading message="Carregando..." />}</>;
  }

  if (requireAuthentication) {
    return (
      <>
        <Login />
      </>
    );
  }

  return <RouterProvider router={routes} />;
};

root.render(
  <Provider store={GlobalStore}>
    <Index />
  </Provider>
);
