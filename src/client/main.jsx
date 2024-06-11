import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { Provider } from "react-redux";
import store from "./store";

import AuthForm from "./features/auth/AuthForm";
import Root from "./layout/Root.jsx";
import Assets from "./features/userform/Assets.jsx";
import Expenses from "./features/userform/Expenses.jsx";
import Incomes from "./features/userform/Incomes.jsx";
import PersonalInfo from "./features/userform/PersonalInfo.jsx";
import Goals from "./features/userform/Goals.jsx";
import Liabilities from "./features/userform/Liabilities.jsx";
import Homepage from "./features/homepage/Homepage.jsx";
import About from "./features/homepage/About.jsx";
import StatisticsHome from "./features/statistics/StatisticsHome.jsx";
import FinancialGoals from "./features/statistics/FinancialGoals.jsx";
import IncomeExpenses from "./features/statistics/IncomeExpenses.jsx";
import AssetsLiabilities from "./features/statistics/AssetsLiabilities.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/login", element: <AuthForm /> },
      { path: "/userform/assets", element: <Assets /> },
      { path: "/userform/expenses", element: <Expenses /> },
      { path: "/userform/incomes", element: <Incomes /> },
      { path: "/userform/personalinfo", element: <PersonalInfo /> },
      { path: "/userform/goals", element: <Goals /> },
      { path: "/userform/liabilities", element: <Liabilities /> },
      { path: "/about", element: <About /> },
      { path: "/statistics", element: <StatisticsHome /> },
      { path: "/statistics/goals", element: <FinancialGoals /> },
      { path: "/statistics/incomeexpenses", element: <IncomeExpenses /> },
      { path: "/statistics/assetsliabilities", element: <AssetsLiabilities /> },
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
