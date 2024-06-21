import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate, NavLink } from "react-router-dom";
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
    goalDuration,
    continueToSave,
  } = goal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Destructure the name and value properties from the event target (the input element)
    // Determine the new value based on the input name
    // If the input name is 'continueToSave', convert the value to a boolean (true or false)
    // Otherwise, use the value as is
    const newValue = name === "continueToSave" ? value === "TRUE" : value;
    // Call the handleNewGoalChange function with the id of the goal, the input name, and the new value
    handleNewGoalChange(id, name, newValue);
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
        What Is The Target Age Of This Goal:
        <input
          className="input"
          type="text"
          name="targetAge"
          value={targetAge}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Target Amount For This Goal? If This Is A Multiple Year Goal
        Such As Retirement, Then How Much Is The Target Amount Yearly:
        <input
          className="input"
          type="text"
          name="targetAmount"
          value={targetAmount}
          onChange={handleChange}
        />
      </label>
      <label>
        How Much Have You Already Saved Toward This Goal:
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
        Toward This Goal:
        <input
          className="input"
          type="text"
          name="annualGrowthRate"
          value={annualGrowthRate}
          onChange={handleChange}
        />
      </label>
      <label>
        How Much Are You Saving Yearly Toward This Goal:
        <input
          className="input"
          type="text"
          name="savingsTowardAmount"
          value={savingsTowardAmount}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Priority Of This Goal:
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
        What Is The Expected Duration Of Years For This Goal? For Example, The
        Number Of Years You Expect To Live In Retirement. If Less Than One Year,
        Enter 1.
        <input
          className="input"
          type="text"
          name="goalDuration"
          value={goalDuration}
          onChange={handleChange}
        />
      </label>
      <label>
        Upon Reaching The Target Age Of This Goal, Do You Plan To Continue
        Saving For This Goal For Its Duration? For Example, When You Retire, Do
        You Plan To Keep Saving For Retirement:
        <select
          //this allows you to correctly toggle between true and false in the field
          value={continueToSave ? "TRUE" : "FALSE"}
          onChange={handleChange}
          name="continueToSave"
        >
          <option value="TRUE">True</option>
          <option value="FALSE">False</option>
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

  function continueToSave(goal) {
    if (goal.continueToSave === true) {
      return "True";
    } else {
      return "False";
    }
  }
  return (
    <section className="questionnaire">
      <p> Goal Name: {goal?.name}</p>
      <p> Goal Type: {goal?.goalType}</p>
      <p> Target Age Of Goal: {goal?.targetAge}</p>
      <p> Target Amount Of Goal Yearly: {goal?.targetAmount}</p>
      <p> Goal Priority: {goal?.goalPriority}</p>
      <p> Yearly Savings Toward Goal: {goal?.savingsTowardAmount}</p>
      <p> Amount Already Saved Toward Goal: {goal?.alreadySaved}</p>
      <p>
        {" "}
        Amount Assets Allocated Toward This Goal Grow Year Over Year:{" "}
        {goal?.annualGrowthRate}%
      </p>
      <p> Expected Duration Of Years For This Goal: {goal?.goalDuration}</p>
      <p> Continue Saving Toward Goal For Duration: {continueToSave(goal)}</p>
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
        if (newGoals[i]["name"] != "" && newGoals[i]["targetAmount"] > 0)
          await addGoal({
            name: newGoals[i]["name"],
            goalType: newGoals[i]["goalType"],
            targetAge: newGoals[i]["targetAge"],
            targetAmount: newGoals[i]["targetAmount"],
            goalPriority: newGoals[i]["goalPriority"],
            savingsTowardAmount: newGoals[i]["savingsTowardAmount"],
            alreadySaved: newGoals[i]["alreadySaved"],
            annualGrowthRate: newGoals[i]["annualGrowthRate"],
            goalDuration: newGoals[i]["goalDuration"],
            continueToSave: newGoals[i]["continueToSave"],
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
        targetAge: me?.age,
        targetAmount: 0,
        goalPriority: "ASPIRATIONAL",
        savingsTowardAmount: 0,
        alreadySaved: 0,
        annualGrowthRate: 0,
        goalDuration: 1,
        continueToSave: true,
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
          <section className="toparea">
            <p>
              Hello {me?.firstname} {me?.lastname}
            </p>
            <p>Please Fill Out The Following Information</p>
            <p id="currentpage">Page 6/6</p>
          </section>
          <div className="threeareasectionuserform">
            <section className="leftsideuserform">
              <article className="userformimagecontainer">
                <img
                  className="userformimages"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718735362/FalconFinancial/userformsection/falconcollege_s2le2a.webp"
                />
              </article>
              <article className="userformimagecontainer">
                <img
                  className="userformimages"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718735436/FalconFinancial/userformsection/falconbeach_ttu6dc.webp"
                />
              </article>
              <article className="userformimagecontainer">
                <img
                  className="userformimages"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718735515/FalconFinancial/userformsection/falconretired_pswizu.webp"
                />
              </article>
            </section>
            <section className="centeruserform">
              <h1 className="userformsectionheader">Goals</h1>
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

              <button className="bottombuttons" onClick={handleAddNewGoal}>
                {" "}
                Add New Goal{" "}
              </button>

              <button className="bottombuttons" onClick={submitGoalsAndLink}>
                Save And Continue To Statistics
              </button>
              <button className="bottombuttons">
                <Link to={"/userform/expenses"}>Return To Expenses</Link>
              </button>
            </section>
            <section className="rightsideuserform">
              <article className="userformimagecontainer">
                <img
                  className="userformimages"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718735597/FalconFinancial/userformsection/falconbuyinghome_azyzlm.webp"
                />
              </article>
              <article className="userformimagecontainer">
                <img
                  className="userformimages"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718735684/FalconFinancial/userformsection/falconpayingdebt_oesviw.webp"
                />
              </article>
              <article className="userformimagecontainer">
                <img
                  className="userformimages"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718735805/FalconFinancial/userformsection/falconbuyingboat_nkjpcr.webp"
                />
              </article>
            </section>
          </div>
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
