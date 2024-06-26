import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useGetUserQuery } from "../userform/accountSlice";
// import "./statistics.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function IncomeIncreasing({ me }) {
  function calculateIncomesOverYears() {
    let allIncreasingIncomes = [];
    for (let i = 0; i < me.Income.length; i++) {
      let increasedIncome = me.Income[i].amount;
      let currentIncomeNumbers = [];
      for (let j = 0; j < 10; j++) {
        if (j === 0) {
          currentIncomeNumbers.push(increasedIncome);
        } else {
          increasedIncome = increasedIncome + me.Income[i].yearlyIncrease;
          currentIncomeNumbers.push(increasedIncome);
        }
      }
      allIncreasingIncomes.push(currentIncomeNumbers);
    }
    return allIncreasingIncomes;
  }
  const incomesOverYears = calculateIncomesOverYears();

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income Increase Over 10 Years",
      },
    },
  };

  const labels = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
  ];

  function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
  function getRandomRGBA() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * (1 - 0.5) + 0.5).toFixed(2); // Alpha value between 0.5 and 1 for better visibility
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function setupData() {
    let data = [];
    for (let i = 0; i < incomesOverYears.length; i++) {
      const borderColor = getRandomRGB();
      const backgroundColor = getRandomRGBA();
      let incomeInfo = {
        label: me.Income[i].name,
        data: incomesOverYears[i],
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      };
      data.push(incomeInfo);
    }
    return data;
  }

  let datasetInformation = setupData();

  const data = {
    labels,
    datasets: datasetInformation,
  };

  return (
    <>
      <section className="incomeexpensesgraphholder">
        <Line options={options} data={data} />
      </section>
    </>
  );
}

function IncomesBreakdown({ me }) {
  let totalIncome = me?.Income.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      <section className="fulltablearea">
        <h2 className="breakdownheader">Income Breakdown</h2>

        <table className="incomeExpensesTable">
          <thead>
            <tr>
              <th className="tableSpace">Income</th>
              <th className="tableSpace">Income Type</th>
              <th className="tableSpace">Amount</th>
              <th className="tableSpace">Yearly Increase</th>
              <th className="tableSpace">Percentage Of Overall Income</th>
            </tr>
          </thead>
          <tbody>
            {me?.Income.map((income, index) => (
              <tr key={index}>
                <td className="tableSpace">{income.name}</td>
                <td className="tableSpace">{income.incomeType}</td>
                <td className="tableSpace">{income.amount}</td>
                <td className="tableSpace">{income.yearlyIncrease}</td>
                <td className="tableSpace">
                  {((income.amount / totalIncome) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="totalamountsbreakdown">
          Your Total Income Is: {totalIncome}
        </p>
      </section>
    </>
  );
}

function ExpensesBreakdown({ me }) {
  let totalYearlyExpenses = me?.Expenses.reduce(
    (acc, curr) => acc + curr.monthlyCost * 12,
    0
  );

  return (
    <>
      <section className="fulltablearea">
        <h2 className="breakdownheader">Expenses Breakdown</h2>
        <table className="incomeExpensesTable">
          <thead>
            <tr>
              <th className="tableSpace">Expense</th>
              <th className="tableSpace">Expense Type</th>
              <th className="tableSpace">Monthly Cost</th>
              <th className="tableSpace">Yearly Cost</th>
              <th className="tableSpace">Expense Interest Percent</th>
              <th className="tableSpace">Percentage Of Overall Expenses</th>
            </tr>
          </thead>
          <tbody>
            {me?.Expenses.map((expense, index) => (
              <tr key={index}>
                <td className="tableSpace">{expense.name}</td>
                <td className="tableSpace">{expense.expenseType}</td>
                <td className="tableSpace">{expense.monthlyCost}</td>
                <td className="tableSpace">{expense.monthlyCost * 12}</td>
                <td className="tableSpace">{expense.interest}%</td>
                <td className="tableSpace">
                  {(
                    ((expense.monthlyCost * 12) / totalYearlyExpenses) *
                    100
                  ).toFixed(2)}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="totalamountsbreakdown">
          Your Total Yearly Expenses Are: {totalYearlyExpenses}
        </p>
      </section>
    </>
  );
}

export default function IncomeExpenses() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  return (
    <>
      {token ? (
        <>
          <section className="entireassetsliabilities">
            <h1>Here Is A Break Down Of Your Incomes</h1>
            <article className="assetsliabilitiesmainsection">
              <section>
                {me && <IncomesBreakdown me={me} />}
                {me && <ExpensesBreakdown me={me} />}
              </section>
              {me && <IncomeIncreasing me={me} />}
            </article>
          </section>
        </>
      ) : (
        <section className="pleaseloginarea">
          <p className="pleaselogin">Please Log In</p>
          <button className="link">
            <NavLink to="/login">Log In Or Register</NavLink>
          </button>
        </section>
      )}
    </>
  );
}
