import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import {
  useGetUserQuery,
  useGetRecommendationsQuery,
} from "../userform/accountSlice";
import { Pie, Bar } from "react-chartjs-2";

import "./foo.css";
// import "./statistics.css";

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
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function ProvideChatgptRecommendation({ me }) {
  const { data: recommendation, isFetching } = useGetRecommendationsQuery();
  //dangerouslySetInnerHTML takes the string recommendation and allows you
  //to set HTML directly into the dom // checks to see if HTML content is
  //available, and if it is renders it using danerouslySetInnerHTML, the
  //recommendation string
  return (
    <>
      <h2>ChatGPT AI Powered Financial Recommendations:</h2>

      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: recommendation }} />
      )}
    </>
  );
}

function IncomeExpensesGraph({ me }) {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Income And Expenses Breakdown",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  function getRandomRGBA() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * (1 - 0.5) + 0.5).toFixed(2); // Alpha value between 0.5 and 1 for better visibility
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const labels = ["Income", "Expenses"];

  const incomeDataset = me.Income.map((income) => ({
    label: income.name,
    //by putting the 0 after the comma here, it is correctly assigning these values to the income label
    data: [income.amount, 0],
    backgroundColor: getRandomRGBA(),
  }));

  const expensesDataset = me.Expenses.map((expense) => ({
    label: expense.name,
    //by putting the 0 before the comma, it is correctly assigning the values to the expenses label
    data: [0, expense.monthlyCost * 12],
    backgroundColor: getRandomRGBA(),
  }));

  const data = {
    labels,
    datasets: [...incomeDataset, ...expensesDataset],
  };

  return (
    <>
      <section className="incomeexpensesgraphholder">
        <Bar className="incomeexpensesgraph" options={options} data={data} />
      </section>
    </>
  );
}

function AssetsLiabilitiesGraph({ me }) {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Assets And Liabilities Breakdown",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  function getRandomRGBA() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * (1 - 0.5) + 0.5).toFixed(2); // Alpha value between 0.5 and 1 for better visibility
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const labels = ["Assets", "Liabilities"];

  const assetsDataset = me.Assets.map((asset) => ({
    label: asset.name,
    //by putting the 0 after the comma here, it is correctly assigning these values to the asset label
    data: [asset.balance, 0],
    backgroundColor: getRandomRGBA(),
  }));
  console.log(assetsDataset, "assets data set");

  const liabilitiesDataset = me.Liabilities.map((liability) => ({
    label: liability.name,
    //by putting the 0 before the comma, it is correctly assigning the values to the liabilities label
    data: [0, liability.amount],
    backgroundColor: getRandomRGBA(),
  }));

  const data = {
    labels,
    datasets: [...assetsDataset, ...liabilitiesDataset],
  };

  return (
    <>
      <section className="incomeexpensesgraphholder">
        <Bar className="incomeexpensesgraph" options={options} data={data} />
      </section>
    </>
  );
}

function EmergencySavingsGraph({ me }) {
  const options = {
    indexAxis: "y", // This makes the bar chart horizontal
    plugins: {
      title: {
        display: true,
        text: "Emergency Fund Progress",
      },
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };
  const labels = ["Emergency Savings", "Six Months Expenses"];
  // calculate the total of 6 months of expenses
  const calculateSixMonthsExpenses = (expenses) => {
    return me.Expenses.reduce((acc, expense) => {
      return acc + expense.monthlyCost;
    }, 0);
  };
  //find all assets titled savings
  let savingsAssets = me.Assets.filter(
    (asset) => asset.assetType === "SAVINGS"
  );
  //add together all of the balances of those savings assets.
  const totalSavings = savingsAssets.reduce(
    (total, asset) => total + asset.balance,
    0
  );

  let sixMonthExpenses = calculateSixMonthsExpenses() * 6;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Current Savings",
        data: [totalSavings, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Target Six Months Of Emergency Savings",
        data: [0, sixMonthExpenses],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <>
      <section className="incomeexpensesgraphholder">
        <Bar
          id="emergencygraph"
          className="incomeexpensesgraph"
          options={options}
          data={data}
        />
      </section>
    </>
  );
}

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
      <section className="incomeexpensesmain">
        <section className="graphanddescription">
          <article className="description">
            <p>
              Great job, your yearly income of {totalIncome}$ exceeds or covers
              your yearly expenses of {totalMonthlyExpenses * 12}$. Your yearly
              surplus is {surplusDeficit}$.
            </p>
            <p>You are earning enough to cover your yearly expenses.</p>
          </article>
          <IncomeExpensesGraph me={me} />
        </section>
        <section className="moredetailedbreakdown">
          <p>For a more detailed breakdown press the button below.</p>
          <button className="incomeexpensesbutton">
            <Link to={"/statistics/incomeexpenses"}>
              Income Expenses Breakdown
            </Link>
          </button>
        </section>
      </section>
    );
  } else {
    return (
      <section className="incomeexpensesmain">
        <section className="graphanddescription">
          <article className="description">
            <p>
              Due to your yearly expenses of {totalMonthlyExpenses * 12}$
              exceeding your yearly income of {totalIncome}$, you are currently
              running a deficit of {surplusDeficit}$.
            </p>
          </article>
          <IncomeExpensesGraph me={me} />
        </section>
        <section className="moredetailedbreakdown">
          <p>
            There are many ways to manage your expenses. For a more detailed
            breakdown press the button below.
          </p>
          <button className="incomeexpensesbutton">
            <Link to={"/statistics/incomeexpenses"}>
              Income Expenses Breakdown
            </Link>
          </button>
        </section>
      </section>
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
      <section className="incomeexpensesmain">
        <section className="graphanddescription">
          <article className="description">
            <p>
              Great job, your overall assets of {totalAssets}$ exceeds your
              overall liabilities of {totalLiabilities}$.
            </p>
            <p>
              You have done a nice job of not taking on too much debt, and
              saving enough.
            </p>
          </article>
          <AssetsLiabilitiesGraph me={me} />
        </section>
        <section className="moredetailedbreakdown">
          <p>For a more detailed breakdown press the button below.</p>
          <button className="incomeexpensesbutton">
            <Link to={"/statistics/assetsliabilities"}>
              Breakdown Of Your Assets And Liabilities
            </Link>
          </button>
        </section>
      </section>
    );
  } else {
    return (
      <>
        <p>
          Your total liabilities of {totalLiabilities}$ is currently exceeding
          your overall assets of {totalAssets}$.
        </p>
        <AssetsLiabilitiesGraph me={me} />
        <p>
          There are many ways to decrease your liabilities and increase your
          assets. For a more detailed breakdown press the button below.
        </p>
        <button>
          <Link to={"/statistics/assetsliabilities"}>
            Breakdown Of Your Assets And Liabilities
          </Link>
        </button>
      </>
    );
  }
}

function OverallProgressGoalsGraph(
  necessary,
  important,
  aspirational,
  goalGap
) {
  const labels = [
    "Necessary Goals",
    "Important Goals",
    "Aspirational Goals",
    "Goal Gap",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Percentage Toward Achieving Financial Goals",
        data: [necessary, important, aspirational, goalGap],
        backgroundColor: [
          `rgba(204,188,32,.8)`,
          `rgba(20,244,7,.8)`,
          `rgba(153, 102, 255, 1)`,
          "rgba(75, 192, 192, 0)",
        ],
      },
    ],
    hoverOffset: 4,
  };
  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Percentage Toward Achieving Financial Goals",
      },
    },
  };
  return (
    <>
      <section className="incomeexpensesgraphholder">
        <Pie className="incomeexpensesgraph" options={options} data={data} />
      </section>
    </>
  );
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

  let necessaryGoalsPercentage = necessaryGoals.length
    ? calculateProgress(necessaryGoals) * presentWeights.necessary
    : 0;
  let importantGoalsPercentage = importantGoals.length
    ? calculateProgress(importantGoals) * presentWeights.important
    : 0;
  let aspirationalGoalsPercentage = aspirationalGoals.length
    ? calculateProgress(aspirationalGoals) * presentWeights.aspirational
    : 0;
  let goalGap = 1 - totalProgress;
  console.log(
    "necessary goals",
    necessaryGoalsPercentage,
    "important goals",
    importantGoalsPercentage,
    "aspirational goals",
    aspirationalGoalsPercentage,
    "gap goals",
    goalGap
  );
  return (
    <section className="incomeexpensesmain">
      <section className="graphanddescription">
        <article className="description">
          <p>
            You are overall {totalProgress.toFixed(2) * 100}% toward achieving
            your financial goals. This number is weighted based off the
            importance of each goal.
          </p>
        </article>
        {OverallProgressGoalsGraph(
          necessaryGoalsPercentage,
          importantGoalsPercentage,
          aspirationalGoalsPercentage,
          goalGap
        )}
      </section>
      <section className="moredetailedbreakdown">
        <p>For a more detailed breakdown press the button below.</p>
        <button className="incomeexpensesbutton">
          <Link to={"/statistics/goals"}>
            Breakdown Of Your Financial Goals
          </Link>
        </button>
      </section>
    </section>
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
      <section id="bottomright" className="incomeexpensesmain">
        <section className="graphanddescription">
          <article className="description">
            <p>
              It is important to have emergency savings equal to at least 6
              months of monthly expenses. Your expenses every month are{" "}
              {oneMonthExpenses}
              $, so your expenses for 6 months are {SixMonthsExpenses}$.
            </p>
            <p>
              You currently have {totalSavings}$ in savings, which is greater
              than or equal to six months of your expenses. Great job! You have
              a sufficient emergency fund.
            </p>
          </article>
          <EmergencySavingsGraph me={me} />
        </section>
      </section>
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
        <EmergencySavingsGraph me={me} />
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
              <section className="mainsection">
                <h1 className="mainheadertop">
                  Here is a breakdown of some of the key aspects of your
                  financial wellness
                </h1>
                <section className="fourquadrants">
                  <article className="toparea">
                    <section className="eachquandrant">
                      <h2 className="mainheader">
                        Yearly Income And Expenses Breakdown
                      </h2>
                      <YearlyIncomeExpenses me={me} />
                    </section>
                    <section className="eachquandrant">
                      <h2 className="mainheader">
                        Assets And Liabilities Breakdown
                      </h2>
                      <CurrentAssetsLiabilities me={me} />
                    </section>
                  </article>
                  <article className="bottomarea">
                    <section className="eachquandrant">
                      <h2 className="mainheader">
                        Overall Progress Toward Achieving Your Financial Goals
                        Breakdown
                      </h2>
                      <OverallProgressGoals me={me} />
                    </section>
                    <section className="eachquandrant">
                      <h2 className="mainheader">
                        Appropriate Emergency Savings Breakdown
                      </h2>
                      <EmergencySavings me={me} />
                    </section>
                  </article>
                </section>
                <ProvideChatgptRecommendation me={me} />
              </section>
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
