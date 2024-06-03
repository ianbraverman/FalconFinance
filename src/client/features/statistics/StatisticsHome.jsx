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
          Great job, your yearly income of {totalIncome}$ exceeds or covers your
          yearly expenses of {totalMonthlyExpenses * 12}$. Your yearly surplus
          is {surplusDeficit}$.
        </p>
        <p>You are earning enough to cover your yearly expenses.</p>
        <p>For a more detailed breakdown press the button below.</p>
        <button>
          <Link to={"/statistics/incomeexpenses"}>
            Income Expenses Breakdown
          </Link>
        </button>
      </>
    );
  } else {
    return (
      <>
        <p>
          Due to your yearly expenses of {totalMonthlyExpenses * 12}$ exceeding
          your yearly income of {totalIncome}$, you are currently running a
          deficit of {surplusDeficit}$.
        </p>
        <p>
          There are many ways to manage your expenses. For a more detailed
          breakdown press the button below.
        </p>
        <button>
          <Link to={"/statistics/incomeexpenses"}>
            Income Expenses Breakdown
          </Link>
        </button>
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
          Great job, your overall assets of {totalAssets}$ exceeds your overall
          liabilities of {totalLiabilities}$.
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
          Your total liabilities of {totalLiabilities}$ is currently exceeding
          your overall assets of {totalAssets}$.
        </p>
        <p>
          There are many ways to decrease your liabilities and increase your
          assets. For a more detailed breakdown press the button below.
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
        //this takes into account if the goal is a multi year goal, for example if it is retirement and not 100000 one time but 100000 for 20 years
        console.log("goal name", goal.name);
        let yearsTillGoal = goal.targetAge - me.age;
        console.log("years till goal", yearsTillGoal);
        //this is converting the annual growth rate to be a decimal instead of a whole number percentage
        let annualGrowthRateDecimal = goal.annualGrowthRate / 100;
        console.log("annual growth rate decimal", annualGrowthRateDecimal);
        // future value of assets already saved toward this goal. this is calculated by taking the
        // the already saved value, then multiplying it by the annual growth rate + 1
        // to the power of the years till the goal.
        let aSFV =
          goal.alreadySaved * (1 + annualGrowthRateDecimal) ** yearsTillGoal;
        console.log("already saved future value", aSFV);
        // this is the future value of the annual contributions. this first takes the savings toward amount every year,
        //then multiplies it by future value of a series of annual contributions. the (1+annualgrowthrate)^n is the growth
        //factor over n years, then subtract 1. then multiple by the growth rate at the end 1+annual growth rate reflects
        //the final years growth.
        let aCFV =
          goal.savingsTowardAmount *
          (((1 + annualGrowthRateDecimal) ** yearsTillGoal - 1) /
            annualGrowthRateDecimal);
        //
        console.log("annual contributions future value", aCFV);
        let totalFVSavings = aSFV + aCFV;
        console.log("total savings future value", totalFVSavings);
        //this converts the whole number inflation rate into a decimal
        let inflationRateDecimal = me.inflation / 100;
        console.log("inflation rate decimal", inflationRateDecimal);
        //this is the future value of the target amount adjusted for a yearly inflation rate
        //after a number of years
        let fVGoalInflationAdjusted =
          goal.targetAmount * (1 + inflationRateDecimal) ** yearsTillGoal;
        console.log(
          "future value goal inflation adjusted",
          fVGoalInflationAdjusted
        );
        // Total cost of the goal adjusted for the entire duration, considering inflation over the distribution period
        let totalGoalCostInflationAdjusted = 0;
        for (let i = 0; i < goal.goalDuration; i++) {
          totalGoalCostInflationAdjusted +=
            fVGoalInflationAdjusted * (1 + inflationRateDecimal) ** i;
        }
        console.log(
          "total goal cost inflation adjusted",
          totalGoalCostInflationAdjusted
        );
        // this is your overall percentage the user is tracking toward each financial goal, calculated
        // by dividing the amount they are slated to save by the inflation adjusted cost of the goal
        let progressUnchanged = totalFVSavings / totalGoalCostInflationAdjusted;
        console.log("not adjusted progress", progressUnchanged);
        const progress = Math.min(
          totalFVSavings / totalGoalCostInflationAdjusted,
          1
        );
        console.log("progress", progress);
        return acc + progress; // Sum up progress across goals
      }, 0) / goals.length
    ); // Average progress per goal type
  };
  // Calculate the weights only for the present goal types
  const presentWeights = {};
  let totalWeight = 0;

  //this checks to see if there is a necessary goal. if there is, then it adds the weighting to present weights
  //also, it adds the weight of the goal priority to to the total weights. it does not matter here if there are multiple of
  // a goal priority, that is handled in calculate progress. all this does is just normalize the weights
  // so even when a goal type is missing, it still calculates correctly
  if (necessaryGoals.length) {
    presentWeights.necessary = baseWeights.necessary;
    totalWeight += baseWeights.necessary;
  }
  if (importantGoals.length) {
    presentWeights.important = baseWeights.important;
    totalWeight += baseWeights.important;
  }
  if (aspirationalGoals.length) {
    presentWeights.aspirational = baseWeights.aspirational;
    totalWeight += baseWeights.aspirational;
  }

  // Normalize the weights
  // after it is decided if necessary, important, and aspirational goals are there,
  // it then changes the weights in present weights to make it add up to 100 percent again based off of the total weight that
  // was also being calculated. so for example if there are aspirational and necessary goals, then
  // present weights = {necessary: .5, aspirational: .2}. this is then divided necessary and aspirational by
  // .70, necessary + aspirational, to make it add up to 100 percent again in weights.
  for (let key in presentWeights) {
    presentWeights[key] /= totalWeight;
  }

  const totalProgress =
    (necessaryGoals.length
      ? calculateProgress(necessaryGoals) * presentWeights.necessary
      : 0) +
    (importantGoals.length
      ? calculateProgress(importantGoals) * presentWeights.important
      : 0) +
    (aspirationalGoals.length
      ? calculateProgress(aspirationalGoals) * presentWeights.aspirational
      : 0);

  return (
    <>
      <p>
        You are overall {totalProgress.toFixed(2) * 100}% toward achieving your
        financial goals. This number is weighted based off the importance of
        each goal.
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
          of monthly expenses. Your expenses every month are {oneMonthExpenses}
          $, so your expenses for 6 months are {SixMonthsExpenses}$.
        </p>
        <p>
          You currently have {totalSavings}$ in savings, which is greater than
          or equal to six months of your expenses. Great job! You have a
          sufficient emergency fund.
        </p>
      </>
    );
  } else {
    return (
      <>
        <p>
          It is important to have emergency savings equal to at least 6 months
          of monthly expenses. Your expenses every month are {oneMonthExpenses}
          $, so your expenses for 6 months are {SixMonthsExpenses}$.
        </p>
        <p>
          You currently have {totalSavings}$ in savings, which is less than six
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
