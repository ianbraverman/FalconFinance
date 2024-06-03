import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useGetUserQuery } from "../userform/accountSlice";
import "./statistics.css";

function IncomesBreakdown({ me }) {
  let totalIncome = me?.Income.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <>
      <h2>Income Breakdown</h2>
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
      <h2>Expenses Breakdown</h2>
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
          <h1>Here Is A Break Down Of Your Incomes</h1>
          {me && <IncomesBreakdown me={me} />}
          {me && <ExpensesBreakdown me={me} />}
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
