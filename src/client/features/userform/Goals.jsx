import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useDeleteInfoMutation } from "./accountSlice";
import "./userform.css";

export default function Goals() {
  const { data: me } = useGetUserQuery();
  let [deleteGoal] = useDeleteInfoMutation();
  const token = useSelector(selectToken);

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

  function ExistingGoalItem({ goal }) {
    //delete button will on click delete that goal and send a delete request to delete it
    return (
      <section>
        <p> Name: {goal?.name}</p>
        <p> Type: {goal?.goalType}</p>
        <p> Target Age: {goal?.targetAge}</p>
        <p> Target Amount: {goal?.targetAmount}</p>
        <p> goalPriority: {goal?.goalPriority}</p>
        <p> Savings Toward Goal: {goal?.savingsTowardAmount}</p>
        <form onSubmit={(evt) => deleteAGoal(goal, evt)}>
          <button>Delete</button>
        </form>
      </section>
    );
  }

  return (
    <>
      {token ? (
        <>
          <p>
            Hello {me?.firstname} {me?.lastname}
          </p>
          <p>Please Fill Out The Following Information</p>
          <p>Page 2/6</p>
          <h1>Goals</h1>
          <section>
            {me?.Goals.map((goal) => (
              <ExistingGoalItem key={goal.id} goal={goal} />
            ))}
          </section>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
