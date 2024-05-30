import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useGetUserQuery } from "../userform/accountSlice";

function YearlyIncomeExpenses({ me }) {
  let totalIncome = 0;
  let totalMonthlyExpenses = 0;
  for (let i = 0; i < me.Income.length; i++) {
    totalIncome += me.Income[i].amount;
  }
  for (let i = 0; i < me.Expenses.length; i++) {
    totalMonthlyExpenses += me.Expenses[i].monthlyCost;
  }
  let surplusDeficit = totalIncome - totalMonthlyExpenses * 12;
  if (surplusDeficit >= 0) {
    return (
      <>
        <p>
          Great job, your yearly income of {totalIncome} exceeds or covers your
          yearly expenses of {totalMonthlyExpenses * 12}. Your yearly surplus is{" "}
          {surplusDeficit}
        </p>
        <p>You are earning enough to cover your yearly expenses</p>
        <p>For a more detailed breakdown press the button below</p>
        <button>Income Expenses Breakdown</button>
      </>
    );
  } else {
    return (
      <>
        <p>
          Due to your yearly expenses of {totalMonthlyExpenses * 12} exceeding
          your yearly income of {totalIncome}, you are currently running a
          deficit of {surplusDeficit}
        </p>
        <p>
          There are many ways to manage your expenses. For a more detailed
          breakdown press the button below
        </p>
        <button>Income Expenses Breakdown</button>
      </>
    );
  }
}

function CurrentAssetsLiabilities({ me }) {
  let totalAssets = 0;
  let totalLiabilities = 0;
  for (let i = 0; i < me.Assets.length; i++) {
    totalAssets += me.Assets[i].balance;
  }
  for (let i = 0; i < me.Liabilities.length; i++) {
    totalLiabilities += me.Liabilities[i].amount;
  }
  let breakdown = totalAssets - totalLiabilities;
  if (breakdown >= 0) {
    return (
      <>
        <p>
          Great job, your overall assets of {totalAssets} exceeds your overall
          liabilities of {totalLiabilities}
        </p>
        <p>
          You have done a nice job of not taking on too much debt, and saving
          enough.
        </p>
        <p>For a more detailed breakdown press the button below</p>
        <button>Assets Liabilities Breakdown</button>
      </>
    );
  } else {
    return (
      <>
        <p>
          Your total liabilities of {totalLiabilities} is currently exceeding
          your overall assets of {totalAssets}
        </p>
        <p>
          There are many ways to decrease your liabilities and increase your
          assets. For a more detailed breakdown press the button below
        </p>
        <button>Assets Liabilities Breakdown</button>
      </>
    );
  }
}

function OverallProgressGoals({ me }) {
  const baseWeights = {
    necessary: 0.5,
    important: 0.3,
    aspirational: 0.2,
  };

  const necessaryGoals = me.Goals.filter(
    (goal) => goal.goalPriority === "NECESSARY"
  );

  const importantGoals = me.Goals.filter(
    (goal) => goal.goalPriority === "IMPORTANT"
  );

  const aspirationalGoals = me.Goals.filter(
    (goal) => goal.goalPriority === "ASPIRATIONAL"
  );

  const calculateProgress = (goals) => {
    return (
      goals.reduce((acc, goal) => {
        // Here, we use only `alreadySaved` to calculate the current progress.
        const progress = goal.alreadySaved / goal.targetAmount;
        return acc + progress; // Sum up progress across goals
      }, 0) / goals.length
    ); // Average progress per goal type
  };
  const totalProgress =
    ((necessaryGoals.length
      ? calculateProgress(necessaryGoals) * baseWeights.necessary
      : 0) +
      (importantGoals.length
        ? calculateProgress(importantGoals) * baseWeights.important
        : 0) +
      (aspirationalGoals.length
        ? calculateProgress(aspirationalGoals) * baseWeights.aspirational
        : 0)) *
    100;

  return (
    <>
      <p>
        You are overall {totalProgress.toFixed(2)}% toward achieving your
        financial goals. This number is weighted based off each goals importance
      </p>
      <button>
        <Link to={"/statistics/goals"}>Breakdown Of Your Financial Goals</Link>
      </button>
    </>
  );
}

function EmergencySavings({ me }) {
  const calculateSixMonthsExpenses = (expenses) => {
    return expenses.reduce((acc, expense) => {
      return acc + expense.monthlyCost;
    }, 0);
  };
  let oneMonthExpenses = calculateSixMonthsExpenses(me.Expenses);
  let SixMonthsExpenses = calculateSixMonthsExpenses(me.Expenses) * 6;
  let savingsAssets = me.Assets.filter(
    (asset) => asset.assetType === "SAVINGS"
  );
  let totalSavings = savingsAssets.reduce(
    (total, asset) => total + asset.balance,
    0
  );

  if (totalSavings >= SixMonthsExpenses) {
    return (
      <>
        <p>
          It is important to have emergency savings equal to at least 6 months
          of monthly expenses. Your expenses every month are {oneMonthExpenses},
          so your expenses for 6 months are {SixMonthsExpenses}.
        </p>
        <p>
          You currently have {totalSavings} in savings, which is greater than or
          equal to six months of your expenses. Great job! You have a sufficient
          emergency fund.
        </p>
      </>
    );
  } else {
    return (
      <>
        <p>
          It is important to have emergency savings equal to at least 6 months
          of monthly expenses. Your expenses every month are {oneMonthExpenses},
          so your expenses for 6 months are {SixMonthsExpenses}.
        </p>
        <p>
          You currently have {totalSavings} in savings, which is less than six
          months of your expenses. It is recommended that you increase your
          savings so as to have an appropriatly sized emergency fund.
        </p>
      </>
    );
  }
}

export default function StatisticsHome() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  return (
    <>
      {token ? (
        me ? (
          me.Expenses.length > 0 &&
          me.Assets.length > 0 &&
          me.Goals.length > 0 &&
          me.Income.length > 0 &&
          me.Liabilities.length > 0 ? (
            <>
              <h1>
                Here is a breakdown of some of the key aspects of your financial
                wellness
              </h1>
              <h2>Yearly Income And Expenses Breakdown</h2>
              <YearlyIncomeExpenses me={me} />
              <h2>Assets And Liabilities Breakdown</h2>
              <CurrentAssetsLiabilities me={me} />
              <h2>
                Overall Progress Toward Achieving Your Financial Goals Breakdown
              </h2>
              <OverallProgressGoals me={me} />
              <h2>Appropriate Emergency Savings Breakdown</h2>
              <EmergencySavings me={me} />
            </>
          ) : (
            <p>
              Please Fill Out The User Form For A Full Statistical Breakdown Of
              Your Finances
            </p>
          )
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
