import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "about",
        lazy: async () => {
          const { default: Component } = await import("./pages/About");
          return { Component };
        },
      },
      {
        path: "learn-more",
        lazy: async () => {
          const { default: Component } = await import("./pages/LearnMore");
          return { Component };
        },
      },
      {
        path: "terms",
        lazy: async () => {
          const { Terms: Component } = await import("./pages/Legal");
          return { Component };
        },
      },
      {
        path: "privacy",
        lazy: async () => {
          const { Privacy: Component } = await import("./pages/Legal");
          return { Component };
        },
      },
    ],
  },
]);
