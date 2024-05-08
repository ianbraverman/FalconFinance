import React from "react";
import ReactDOM from "react-dom/client";

import "./index.less";

import { Provider } from "react-redux";
import store from "./store";

import AuthForm from "./features/auth/AuthForm";
import Tasks from "./features/tasks/Tasks";
import Root from "./layout/Root.jsx";
import Assets from "./features/userform/Assets.jsx";
import Expenses from "./features/userform/Expenses.jsx";
import Incomes from "./features/userform/Incomes.jsx";
import PersonalInfo from "./features/userform/PersonalInfo.jsx";
import Goals from "./features/userform/Goals.jsx";
import Liabilities from "./features/userform/Liabilities.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Tasks /> },
      { path: "/tasks", element: <Tasks /> },
      { path: "/login", element: <AuthForm /> },
      { path: "/userform/assets", element: <Assets /> },
      { path: "/userform/expenses", element: <Expenses /> },
      { path: "/userform/incomes", element: <Incomes /> },
      { path: "/userform/personalinfo", element: <PersonalInfo /> },
      { path: "/userform/goals", element: <Goals /> },
      { path: "/userform/liabilities", element: <Liabilities /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
