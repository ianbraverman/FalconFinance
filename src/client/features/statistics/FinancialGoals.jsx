import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../userform/accountSlice";
import { Bar } from "react-chartjs-2";
import "./statistics.css";

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

function GoalSavingsCostTable({ goal, me }) {
  // this table takes the goal, and it shows a table by year of the growth of their assets saved toward the goal, and it also
  // shows the increasing cost of the goal with inflation by year
  // this will show the yearly inflation adjusted goal cost for the years leading till goal and the duration of the goal
  // then once they actually reach the goal also calculate year by year
  // the total cost of the goal adding for the duration of the goal
  // then after they reach the goal, the time till goal passes, it will subtract the inflation adjusted goal cost from the savings amount every year for the duration of the goal cost.

  function calculateSavingsByYear(goal, me) {
    let yearsTillGoal = goal.targetAge - me.age;
    let annualGrowthRateDecimal = goal.annualGrowthRate / 100;
    let allIncreasingSavings = [];
    let increasedSavings = goal.alreadySaved; // Initial lump sum already saved

    for (let i = 0; i < yearsTillGoal; i++) {
      increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
      increasedSavings += goal.savingsTowardAmount; // Add contribution every year
      allIncreasingSavings.push(increasedSavings);
    }
    return allIncreasingSavings;
  }

  let savingsByYear = calculateSavingsByYear(goal, me);

  function calculateInflationAdjustedGoalCost(goal, me) {
    //for the years leading up until the goal, and the goal duration this shows the inflation adjusted cost of the goal every year
    let yearsTillGoal = goal.targetAge - me.age;
    let inflationRateDecimal = me.inflation / 100;
    let increasedGoalCost = goal.targetAmount;
    //this saves all the amounts of the years that the goal costs grows by inflation rate

    let allIncreasingGoalCost = [];
    for (let i = 0; i < yearsTillGoal + goal.goalDuration; i++) {
      if (i === 0) {
        allIncreasingGoalCost.push(increasedGoalCost);
      } else {
        increasedGoalCost = increasedGoalCost * (1 + inflationRateDecimal);
        allIncreasingGoalCost.push(increasedGoalCost);
      }
    }
    return allIncreasingGoalCost;
  }
  let inflationAdjustedGoalCost = calculateInflationAdjustedGoalCost(goal, me);

  console.log("inflation adjusted goal cost", inflationAdjustedGoalCost);
  // this is the goal duration + years till goal so the total number of years this goal will exist
  let totalYears = goal.targetAge - me.age + goal.goalDuration;

  //this function will add to savingsByYear array so that it also decreases by inflation adjusted yearly goal cost
  //for the duration of the goal. so it will increase for the growing period, then decrease for the spending period
  function spendingSavingsOnGoal(
    inflationAdjustedGoalCost,
    savingsByYear,
    goal
  ) {
    let lastYearSavings = savingsByYear[savingsByYear.length - 1];
    let indexOfLastYearSavings = savingsByYear.length;
    let savingsByYearContinued = [...savingsByYear];
    //this is the array but it only includes the inflation adjusted yearly goal costs of the indexes when spending down the savings

    //this will be to keep track of the savings number as it decreases
    let currentSavingsNumber = lastYearSavings;
    //this adds on to savings by year array by taking the savings and removing the associated years inflation adjusted goal cost
    for (let i = 0; i < goal.goalDuration; i++) {
      currentSavingsNumber =
        currentSavingsNumber -
        inflationAdjustedGoalCost[indexOfLastYearSavings + i];
      savingsByYearContinued.push(currentSavingsNumber);
    }
    return savingsByYearContinued;
  }
  let savingsGrowingDecreasing = spendingSavingsOnGoal(
    inflationAdjustedGoalCost,
    savingsByYear,
    goal
  );
  console.log("savingsgrowingdecreasing", savingsGrowingDecreasing);
  // this is the goal duration + years till goal so the total number of years this goal will exist

  //this makes an array of labels of "Year x" where the length is the total years
  const labels = Array.from({ length: totalYears }, (v, i) => `${me.age + i}`);

  return (
    <>
      <h2>Goal Information</h2>
      <table className="incomeExpensesTable">
        <thead>
          <tr>
            <th className="tableSpace">Goal</th>
            <th className="tableSpace">{me.firstname}'s Age</th>
            <th className="tableSpace">Inflation Rate</th>
            <th className="tableSpace">Annual Growth Rate Of Assets</th>
            <th className="tableSpace">Yearly Contributions</th>
            <th className="tableSpace">Total Savings Toward Goal</th>
            <th className="tableSpace">Inflation Adjusted Yearly Goal Cost</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={index}>
              <td className="tableSpace">{goal.name}</td>
              <td className="tableSpace">{labels[index]}</td>
              <td className="tableSpace">{(me.inflation / 100).toFixed(2)}</td>
              <td className="tableSpace">
                {(goal.annualGrowthRate / 100).toFixed(2)}
              </td>
              <td className="tableSpace">
                {index < goal.targetAge - me.age ? goal.savingsTowardAmount : 0}
              </td>
              <td className="tableSpace">
                {savingsGrowingDecreasing[index].toFixed(2)}
              </td>
              <td className="tableSpace">
                {inflationAdjustedGoalCost[index].toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function GoalGraph({ totalGoalCostInflationAdjusted, totalFVSavings }) {
  //I want this graph to show what they currently have saved, and then on top of that what they are slated to grow from there
  // then also the cost of the goal overall on the right stacked bar graph. so will show how much they already have saved in todays dollars, then on top of that everything else they will save.
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

  const labels = [
    "Projected Savings For Goal",
    "Inflation Adjusted Overall Goal Cost",
  ];

  let savingsDataSet = [
    //first part of stack of savings is what they have already saved, then it shows future value of that savings - what they already have saved, then
    // the future value of their annual contributions
    {
      label: "Total Future Value Of Savings Toward Goal",
      data: [totalFVSavings, 0],
      backgroundColor: getRandomRGBA(),
    },
    {
      label: "Inflation Adjusted Future Value Of Goal",
      data: [0, totalGoalCostInflationAdjusted],
      backgroundColor: getRandomRGBA(),
    },
  ];
  const data = {
    labels,
    datasets: savingsDataSet,
  };

  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
}

function IndividualGoalBreakdown({ goal, me }) {
  //this is the number of years from their current age until the target year of the goal
  console.log("goal name", goal.name);
  let yearsTillGoal = goal.targetAge - me.age;
  console.log("years till goal", yearsTillGoal);
  //this is converting the annual growth rate to be a decimal instead of a whole number percentage
  let annualGrowthRateDecimal = goal.annualGrowthRate / 100;
  console.log("annual growth rate decimal", annualGrowthRateDecimal);
  // future value of assets already saved toward this goal. this is calculated by taking the
  // the already saved value, then multiplying it by the annual growth rate + 1
  // to the power of the years till the goal.

  //this iterative function calculates over the duration of the build up period until the the goals target date
  // how much is expected to be saved in total.
  function calculateSavingsByYear(goal, me) {
    let yearsTillGoal = goal.targetAge - me.age;
    let annualGrowthRateDecimal = goal.annualGrowthRate / 100;

    let increasedSavings = goal.alreadySaved; // Initial lump sum already saved

    for (let i = 0; i < yearsTillGoal; i++) {
      increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
      increasedSavings += goal.savingsTowardAmount; // Add contribution every year
    }
    return increasedSavings;
  }
  let totalFVSavings = calculateSavingsByYear(goal, me);

  console.log("total savings future value", totalFVSavings);
  //this converts the whole number inflation rate into a decimal
  let inflationRateDecimal = me.inflation / 100;
  console.log("inflation rate decimal", inflationRateDecimal);
  //this is the future value of the target amount adjusted for a yearly inflation rate
  //after a number of years
  let fVGoalInflationAdjusted =
    goal.targetAmount * (1 + inflationRateDecimal) ** yearsTillGoal;
  console.log("future value goal inflation adjusted", fVGoalInflationAdjusted);
  // Total cost of the goal adjusted for the entire duration, considering inflation over the distribution period
  let totalGoalCostInflationAdjusted = 0;
  //this assumes that they will not be saving more during the duration of the goal. The goal cost continues to increase during
  // the duration of the goal. the savings stops after the years till goal does not continue saving during the duration of the goal
  //this is adding more every year to the goal cost inflation adjusted because the goal costs so much every year of the duration of the goal
  // so fvgoalinflationadjusted is how much the goal costs after the years till goal, totalgoalcostinflationadjusted
  // adds on top of that number every year more inflation and also tallies up total goal cost
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
  let percentToGoal = (totalFVSavings / totalGoalCostInflationAdjusted) * 100;
  console.log("percent to goal", percentToGoal);

  return (
    <>
      <h2>Breakdown of Your Progress Toward the Goal: {goal.name}</h2>
      <p>
        Your goal, {goal.name}, has a target amount of {goal.targetAmount} per
        year. With an inflation rate of {me.inflation}% over the next{" "}
        {yearsTillGoal} years until you reach your target age, the
        inflation-adjusted annual amount you will need is{" "}
        {fVGoalInflationAdjusted.toFixed(2)}.
      </p>
      <p>
        Considering the duration of {goal.goalDuration} years for this goal, the
        total cost, adjusted for inflation, is estimated to be{" "}
        {totalGoalCostInflationAdjusted.toFixed(2)}.
      </p>
      <p>
        With an estimated annual growth rate of {goal.annualGrowthRate}% on the
        savings for this goal, you are currently {percentToGoal.toFixed(2)}% of
        the way to reaching your goal. You are projected to save a total of{" "}
        {totalFVSavings.toFixed(2)}.
      </p>
      <GoalGraph
        goal={goal}
        totalGoalCostInflationAdjusted={totalGoalCostInflationAdjusted}
        totalFVSavings={totalFVSavings}
      />
      <GoalSavingsCostTable goal={goal} me={me} />
    </>
  );
}

export default function FinancialGoals() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  return (
    <>
      {token ? (
        <>
          <h1>
            Here Is How You Are Tracking Toward Achieving Your Financial Goals
          </h1>
          <section>
            {me?.Goals.map((goal) => (
              <IndividualGoalBreakdown key={goal.id} goal={goal} me={me} />
            ))}
          </section>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </>
  );
}
