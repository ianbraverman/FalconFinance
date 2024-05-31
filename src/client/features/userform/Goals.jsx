import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetUserQuery,
  useDeleteInfoMutation,
  useAddGoalsMutation,
} from "./accountSlice";
import "./userform.css";

//this generates a random unique id for each new goal
const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

function NewGoalItem({ goal, handleNewGoalChange, handleDeleteGoal }) {
  const {
    id,
    name,
    goalType,
    targetAge,
    targetAmount,
    goalPriority,
    savingsTowardAmount,
    alreadySaved,
    annualGrowthRate,
  } = goal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleNewGoalChange(id, name, value);
  };

  const handleDelete = () => {
    handleDeleteGoal(goal.id); // Call the parent component's delete function with the correct index
  };

  return (
    <section className="questionnaire">
      <label>
        Name Of Goal:
        <input
          className="input"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Target Age Of This Goal?
        <input
          className="input"
          type="text"
          name="targetAge"
          value={targetAge}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Target Amount For This Goal?
        <input
          className="input"
          type="text"
          name="targetAmount"
          value={targetAmount}
          onChange={handleChange}
        />
      </label>
      <label>
        How Much Have You Already Saved Toward This Goal?
        <input
          className="input"
          type="text"
          name="alreadySaved"
          value={alreadySaved}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is the Annual Growth Rate Percentage For The Assets Allocated
        Toward This Goal?
        <input
          className="input"
          type="text"
          name="annualGrowthRate"
          value={annualGrowthRate}
          onChange={handleChange}
        />
      </label>
      <label>
        How Much Are You Saving Yearly Toward This Goal?
        <input
          className="input"
          type="text"
          name="savingsTowardAmount"
          value={savingsTowardAmount}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Priority Of This Goal?
        <select
          className="input"
          name="goalPriority"
          value={goalPriority}
          onChange={handleChange}
        >
          <option value="ASPIRATIONAL">Aspirational</option>
          <option value="IMPORTANT">Important</option>
          <option value="NECESSARY">Necessary</option>
        </select>
      </label>
      <label>
        Type Of Goal:
        <select
          className="input"
          name="goalType"
          value={goalType}
          onChange={handleChange}
        >
          <option value="SAVINGS">Savings</option>
          <option value="INVESTMENT">Investment</option>
          <option value="RETIREMENT">Retirement</option>
          <option value="EDUCATION">Education</option>
          <option value="DEBT_REDUCTION">Debt Reduction</option>
          <option value="EMERGENCY_FUND">Emergency Fund</option>
          <option value="TRAVEL">Travel</option>
          <option value="HOME_PURCHASE">Home Purchase</option>
          <option value="OTHER">Other</option>
        </select>
      </label>

      <button className="buttondelete" onClick={() => handleDelete()}>
        Delete Goal
      </button>
    </section>
  );
}

function ExistingGoalItem({ goal, deleteAGoal }) {
  //delete button will on click delete that goal and send a delete request to delete it
  return (
    <section className="questionnaire">
      <p> Name: {goal?.name}</p>
      <p> Type: {goal?.goalType}</p>
      <p> Target Age: {goal?.targetAge}</p>
      <p> Target Amount: {goal?.targetAmount}</p>
      <p> Goal Priority: {goal?.goalPriority}</p>
      <p> Yearly Savings Toward Goal: {goal?.savingsTowardAmount}</p>
      <p> Amount Already Saved Toward This Goal: {goal?.alreadySaved}</p>
      <p>
        {" "}
        Amount Assets Allocated Toward This Goal Grow Year Over Year:{" "}
        {goal?.annualGrowthRate}%
      </p>
      <form onSubmit={(evt) => deleteAGoal(goal, evt)}>
        <button className="buttondelete">Delete Goal</button>
      </form>
    </section>
  );
}

export default function Goals() {
  const { data: me } = useGetUserQuery();
  let [deleteGoal] = useDeleteInfoMutation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [newGoals, setNewGoals] = useState([]);
  const [addGoal] = useAddGoalsMutation();

  const submitGoalsAndLink = async (evt) => {
    evt.preventDefault();
    try {
      for (let i = 0; i < newGoals.length; i++) {
        if (newGoals[i]["name"] != "")
          await addGoal({
            name: newGoals[i]["name"],
            goalType: newGoals[i]["goalType"],
            targetAge: newGoals[i]["targetAge"],
            targetAmount: newGoals[i]["targetAmount"],
            goalPriority: newGoals[i]["goalPriority"],
            savingsTowardAmount: newGoals[i]["savingsTowardAmount"],
            alreadySaved: newGoals[i]["alreadySaved"],
            annualGrowthRate: newGoals[i]["annualGrowthRate"],
          });
      }
      navigate(`/statistics`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAGoal = async (goal, evt) => {
    evt.preventDefault();
    try {
      await deleteGoal({
        id: goal.id,
        table: "goals",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewGoal = () => {
    setNewGoals([
      ...newGoals,
      {
        id: generateUniqueId(),
        name: "",
        goalType: "SAVINGS",
        targetAge: 0,
        targetAmount: 0,
        goalPriority: "ASPIRATIONAL",
        savingsTowardAmount: 0,
        alreadySaved: 0,
        annualGrowthRate: 0,
      },
    ]);
  };

  const handleNewGoalChange = (id, fieldName, value) => {
    setNewGoals((prevGoals) => {
      return prevGoals.map((goal) => {
        if (goal.id === id) {
          return { ...goal, [fieldName]: value };
        }
        return goal;
      });
    });
  };

  const handleDeleteGoal = (id) => {
    const updatedGoals = newGoals.filter((goal) => goal.id !== id);
    setNewGoals(updatedGoals);
  };

  return (
    <>
      {token ? (
        <>
          <p>
            Hello {me?.firstname} {me?.lastname}
          </p>
          <p>Please Fill Out The Following Information</p>
          <p>Page 6/6</p>
          <h1>Goals</h1>
          {me?.Goals.length > 0 ? <h2>Existing Goals:</h2> : <p></p>}
          <section>
            {me?.Goals.map((goal) => (
              <ExistingGoalItem
                key={goal.id}
                goal={goal}
                deleteAGoal={deleteAGoal}
              />
            ))}
          </section>
          {newGoals.length > 0 ? <h2>New Goals:</h2> : <p></p>}
          {newGoals.map((newGoal) => (
            <NewGoalItem
              key={newGoal.id}
              goal={newGoal}
              handleNewGoalChange={handleNewGoalChange}
              handleDeleteGoal={handleDeleteGoal}
            />
          ))}
          <button onClick={handleAddNewGoal}> Add New Goal </button>
          <p>
            Great job, after completing this page you can see your financial
            breakdown
          </p>
          <button onClick={submitGoalsAndLink}>
            Save And Continue To Statistics
          </button>
          <button>
            <Link to={"/userform/expenses"}>Return To Expenses</Link>
          </button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
