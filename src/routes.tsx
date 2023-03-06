import { createBrowserRouter } from "react-router-dom";

import SectionContentHolder from "./components/SectionContentHolder/SectionContentHolder";
import NavBar from "./components/NavBar/NavBar";

const router = createBrowserRouter([
  {
    path: "/:section",
    element: <>
    <NavBar />
    <SectionContentHolder /></>
  }
]);

export default router;