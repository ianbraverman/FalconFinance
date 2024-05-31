import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../userform/accountSlice";

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
  let aSFV = goal.alreadySaved * (1 + annualGrowthRateDecimal) ** yearsTillGoal;
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
  console.log("future value goal inflation adjusted", fVGoalInflationAdjusted);
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
