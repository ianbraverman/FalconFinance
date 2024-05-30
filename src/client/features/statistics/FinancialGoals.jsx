import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../userform/accountSlice";

function IndividualGoalBreakdown({ goal, me }) {
  //this is the number of years from their current age until the target year of the goal
  let yearsTillGoal = goal.targetAge - me.age;
  //this is converting the annual growth rate to be a decimal instead of a whole number percentage
  let annualGrowthRateDecimal = goal.annualGrowthRate / 100;
  // future value of assets already saved toward this goal. this is calculated by taking the
  // the already saved value, then multiplying it by the annual growth rate + 1
  // to the power of the years till the goal.
  let aSFV = goal.alreadySaved * (1 + annualGrowthRateDecimal) ** yearsTillGoal;
  // this is the future value of the annual contributions. this first takes the savings toward amount every year,
  //then multiplies it by future value of a series of annual contributions. the (1+annualgrowthrate)^n is the growth
  //factor over n years, then subtract 1. then multiple by the growth rate at the end 1+annual growth rate reflects
  //the final years growth.
  let aCFV =
    goal.savingsTowardAmount *
    (((1 + annualGrowthRateDecimal) ** yearsTillGoal - 1) /
      annualGrowthRateDecimal) *
    (1 + annualGrowthRateDecimal);
  //
  let totalFVSavings = aSFV + aCFV;
  //this converts the whole number inflation rate into a decimal
  let inflationRateDecimal = me.inflation / 100;
  //this is the future value of the target amount adjusted for a yearly inflation rate
  //after a number of years
  let fVGoalInflationAdjusted =
    goal.targetAmount * (1 + inflationRateDecimal) ** yearsTillGoal;
  // this is your overall percentage the user is tracking toward each financial goal, calculated
  // by dividing the amount they are slated to save by the inflation adjusted cost of the goal
  let percentToGoal = (totalFVSavings / fVGoalInflationAdjusted) * 100;

  return (
    <>
      <h2>
        Here is the breakdown for how you are tracking toward achieving your
        financial goal, {goal.name}.
      </h2>
      <p>
        Your goal of {goal.name}, with the target amount of {goal.targetAmount},
        adjusted for inflation over the {yearsTillGoal} years till your target
        year for this goal with your estimated inflation rate of {me.inflation}{" "}
        is {fVGoalInflationAdjusted.toFixed(2)}.
      </p>
      <p>
        After adjusting for inflation and taking into account your estimated
        annual growth rate of {goal.annualGrowthRate}% for the assets being put
        toward this goal, you are {percentToGoal.toFixed(2)}% toward achieving
        this goal and are estimated to save {totalFVSavings.toFixed(2)} toward
        this goal.
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
