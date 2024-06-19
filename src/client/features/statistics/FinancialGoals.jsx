import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../userform/accountSlice";
import { Bar } from "react-chartjs-2";
import { NavLink } from "react-router-dom";
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

function GoalSavingsCostTable({ goal, me }) {
  // this table takes the goal, and it shows a table by year of the growth of their assets saved toward the goal, and it also
  // shows the increasing cost of the goal with inflation by year
  // this will show the yearly inflation adjusted goal cost for the years leading till goal and the duration of the goal
  // then once they actually reach the goal also calculate year by year
  // the total cost of the goal adding for the duration of the goal
  // then after they reach the goal, the time till goal passes, it will subtract the inflation adjusted goal cost from the savings amount every year for the duration of the goal cost.

  function calculateSavingsByYear(goal, me) {
    //this is to ensure that years till goal is never 0, which can cause an empty array and break things
    let yearsTillGoal = 0;
    if (goal.targetAge - me.age <= 0) {
      yearsTillGoal = 1;
    } else {
      yearsTillGoal = goal.targetAge - me.age;
    }
    //this is for if they are not going to be continuing to fund the goal during the goal duration.
    //however, the goal value will continue to increase during goal duration by the growth rate
    if (goal?.continueToSave === false) {
      let annualGrowthRateDecimal = goal.annualGrowthRate / 100;
      let allIncreasingSavings = [];
      let increasedSavings = goal.alreadySaved; // Initial lump sum already saved
      //for the years till goal will add to savings, and also increase by annual growth rate decimal
      for (let i = 0; i < yearsTillGoal; i++) {
        increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
        increasedSavings += goal.savingsTowardAmount; // Add contribution every year
        allIncreasingSavings.push(increasedSavings);
      }
      //for the goal duration will just increase by the annual growth rate
      for (let i = 0; i < goal.goalDuration; i++) {
        increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
        allIncreasingSavings.push(increasedSavings); //this will just be pushing the growth with the growth rate no savings added
      }
      return allIncreasingSavings;
      //if they continue to save through the duration, continueToSave = true
    } else {
      let annualGrowthRateDecimal = goal.annualGrowthRate / 100;
      let allIncreasingSavings = [];
      let increasedSavings = goal.alreadySaved; // Initial lump sum already saved
      //for the years till goal  AND the goal duration will add to savings, and also increase by annual growth rate decimal
      for (let i = 0; i < yearsTillGoal + goal.goalDuration; i++) {
        increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
        increasedSavings += goal.savingsTowardAmount; // Add contribution every year
        allIncreasingSavings.push(increasedSavings);
      }

      return allIncreasingSavings;
    }
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

  // this is the goal duration + years till goal so the total number of years this goal will exist
  let totalYears = goal.targetAge - me.age + goal.goalDuration;

  //this function will add to savingsByYear array so that it also decreases by inflation adjusted yearly goal cost
  //for the duration of the goal. so it will increase for the growing period, then decrease for the spending period
  function spendingSavingsOnGoal(
    inflationAdjustedGoalCost,
    savingsByYear,
    goal
  ) {
    //the last year of savings in the scenario where they no longer are saving during the duration
    // is the years till goal of savings by year
    let lastYearSavings = savingsByYear[goal.targetAge - me.age - 1];

    let indexOfLastYearSavings = savingsByYear[goal.targetAge - me.age - 1];
    let savingsByYearUpdated = [...savingsByYear];
    //this is the array but it only includes the inflation adjusted yearly goal costs of the indexes when spending down the savings

    //this will keep track of total subtracted to from savings
    let totalsubtracted = 0;

    //this will update the savingsbyYearUpdated by for every index of it, subtracting from the savingsbyyearupdated at index the total subtracted
    // then adding to total subtracted the amount that was just subtracted
    for (
      let i = goal.targetAge - me.age;
      i < goal.targetAge - me.age + goal.goalDuration;
      i++
    ) {
      totalsubtracted = totalsubtracted + inflationAdjustedGoalCost[i];
      savingsByYearUpdated[i] = savingsByYearUpdated[i] - totalsubtracted;
    }
    return savingsByYearUpdated;
  }
  let savingsGrowingDecreasing = spendingSavingsOnGoal(
    inflationAdjustedGoalCost,
    savingsByYear,
    goal
  );

  // this is the goal duration + years till goal so the total number of years this goal will exist

  //this makes an array of labels of "Year x" where the length is the total years
  const labels = Array.from({ length: totalYears }, (v, i) => `${me.age + i}`);

  return (
    <>
      <section>
        <h2>Inflation Adjusted Yearly Breakdown Of Goal</h2>
        <section className="fulltablearea">
          <table className="incomeExpensesTable">
            <thead>
              <tr>
                <th className="tableSpace">Goal</th>
                <th className="tableSpace">{me.firstname}'s Age</th>
                <th className="tableSpace">Inflation Rate</th>
                <th className="tableSpace">Annual Growth Rate Of Assets</th>
                <th className="tableSpace">Yearly Contributions</th>
                <th className="tableSpace">Total Savings Toward Goal</th>
                <th className="tableSpace">
                  Inflation Adjusted Yearly Goal Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label, index) => (
                <tr key={index}>
                  <td className="tableSpace">{goal.name}</td>
                  <td className="tableSpace">{labels[index]}</td>
                  <td className="tableSpace">
                    {(me.inflation / 100).toFixed(2)}
                  </td>
                  <td className="tableSpace">
                    {(goal.annualGrowthRate / 100).toFixed(2)}
                  </td>
                  <td className="tableSpace">
                    {index < goal.targetAge - me.age
                      ? goal.savingsTowardAmount
                      : 0}
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
        </section>
      </section>
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
        text: "Goal Breakdown",
      },
    },
    responsive: true,
    maintainAspectRatio: false, // This allows the chart to take the full height and width of the container
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
      <section className="financialchartholder">
        <Bar options={options} data={data} />
      </section>
    </>
  );
}

function IndividualGoalBreakdown({ goal, me }) {
  //this is the number of years from their current age until the target year of the goal

  let yearsTillGoal = goal.targetAge - me.age;

  //this is converting the annual growth rate to be a decimal instead of a whole number percentage
  let annualGrowthRateDecimal = goal.annualGrowthRate / 100;

  // future value of assets already saved toward this goal. this is calculated by taking the
  // the already saved value, then multiplying it by the annual growth rate + 1
  // to the power of the years till the goal.

  //this iterative function calculates over the duration of the build up period until the the goals target date
  // how much is expected to be saved in total.
  function calculateSavingsByYear(goal, me) {
    //this makes sense if they are not saving more during the duration of the goal.
    //however, if they are saving more during the duration of the goal, need to account for that. during duration of the goal though, the
    // assets continue to grow year by year by the growth factor
    if (goal?.continueToSave === false) {
      let yearsTillGoal = goal.targetAge - me.age;
      let annualGrowthRateDecimal = goal.annualGrowthRate / 100;

      let increasedSavings = goal.alreadySaved; // Initial lump sum already saved

      for (let i = 0; i < yearsTillGoal; i++) {
        increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
        increasedSavings += goal.savingsTowardAmount; // Add contribution every year until reaching goal
      }
      //even for the duration of the goal while not contributing more to savings, it continues to grow in value
      for (let i = 0; i < goal.goalDuration; i++) {
        increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
      }
      return increasedSavings;
      //if they do continue to save for the goal during the duration
    } else {
      let yearsTillGoal = goal.targetAge - me.age;
      let annualGrowthRateDecimal = goal.annualGrowthRate / 100;

      let increasedSavings = goal.alreadySaved; // Initial lump sum already saved
      //for the years till goal and the goal duration
      for (let i = 0; i < yearsTillGoal + goal.goalDuration; i++) {
        increasedSavings *= 1 + annualGrowthRateDecimal; // Apply growth rate
        increasedSavings += goal.savingsTowardAmount; // Add contribution every year for entirety of duration of goal
      }
      return increasedSavings;
    }
  }
  let totalFVSavings = calculateSavingsByYear(goal, me);

  //this converts the whole number inflation rate into a decimal
  let inflationRateDecimal = me.inflation / 100;

  //this is the future value of the target amount adjusted for a yearly inflation rate
  //after a number of years
  let fVGoalInflationAdjusted =
    goal.targetAmount * (1 + inflationRateDecimal) ** yearsTillGoal;

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

  // this is your overall percentage the user is tracking toward each financial goal, calculated
  // by dividing the amount they are slated to save by the inflation adjusted cost of the goal
  let percentToGoal = (totalFVSavings / totalGoalCostInflationAdjusted) * 100;

  function ContinueToSaveOrNot() {
    if (goal.continueToSave === true) {
      return (
        <p>
          You are currently contributing {goal.savingsTowardAmount} every year
          toward this goal, and plan to continue contributing this amount
          throughout the duration of the goal.
        </p>
      );
    } else {
      return (
        <p>
          You are currently contributing {goal.savingsTowardAmount} every year
          toward this goal, but will stop contributing to the goal upon reaching
          the target year of the goal.
        </p>
      );
    }
  }

  return (
    <>
      <section>
        <h2 className="financialgoalsheader">
          Breakdown of Your Progress Toward{" "}
          {goal.name.charAt(0).toUpperCase() + goal.name.slice(1)}:
        </h2>
        <div className="financialgoalsmain">
          <section className="financialgoalsdescription">
            <p>
              Your {goal.goalPriority} goal, {goal.name}, has a target amount of{" "}
              {goal.targetAmount} per year. With an inflation rate of{" "}
              {me.inflation}% over the next {yearsTillGoal} years until you
              reach your target age, the inflation-adjusted annual amount you
              will need is {fVGoalInflationAdjusted.toFixed(2)} on the target
              age. This amount continues to increase for the duration of the
              goal.
            </p>
            <p>
              Considering the duration of {goal.goalDuration} years for this
              goal, the total cost, adjusted for inflation, is estimated to be{" "}
              {totalGoalCostInflationAdjusted.toFixed(2)}.
            </p>
            {ContinueToSaveOrNot()}
            <p>
              With an estimated annual growth rate of {goal.annualGrowthRate}%
              on the savings for this goal, you are currently{" "}
              {percentToGoal.toFixed(2)}% of the way to reaching your goal. You
              are projected to save a total of {totalFVSavings.toFixed(2)}.
            </p>
          </section>
          <GoalGraph
            goal={goal}
            totalGoalCostInflationAdjusted={totalGoalCostInflationAdjusted}
            totalFVSavings={totalFVSavings}
          />
          <GoalSavingsCostTable goal={goal} me={me} />
        </div>
      </section>
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
          <h1 className="financialgoalsmainheader">
            Here Is How You Are Tracking Toward Achieving Your Financial Goals
          </h1>
          <section>
            {me?.Goals.map((goal) => (
              <IndividualGoalBreakdown key={goal.id} goal={goal} me={me} />
            ))}
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
