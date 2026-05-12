import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import { Privacy, Terms } from "./pages/Legal";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: Privacy },
    ],
  },
]);
