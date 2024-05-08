import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useDeleteInfoMutation } from "./accountSlice";
import "./userform.css";

export default function Expenses() {
  const { data: me } = useGetUserQuery();
  let [deleteExpense] = useDeleteInfoMutation();
  const token = useSelector(selectToken);

  const deleteAnExpense = async (expense, evt) => {
    evt.preventDefault();
    try {
      await deleteExpense({
        id: expense.id,
        table: "expenses",
      });
    } catch (error) {
      console.log(error);
    }
  };

  function ExistingExpenseItem({ expense }) {
    //delete button will on click delete that expense and send a delete request to delete it
    return (
      <section>
        <p> Name: {expense?.name}</p>
        <p> Type: {expense?.expenseType}</p>
        <p> Interest Cost: {expense?.interest}</p>
        <p> Monthly Cost: {expense?.monthlyCost}</p>
        <form onSubmit={(evt) => deleteAnExpense(expense, evt)}>
          <button>Delete</button>
        </form>
      </section>
    );
  }
  //user must be logged in for the form to appear, otherwise asks them to log in
  return (
    <>
      {token ? (
        <>
          <p>
            Hello {me?.firstname} {me?.lastname}
          </p>
          <p>Please Fill Out The Following Information</p>
          <p>Page 3/6</p>
          <h1>Expenses</h1>
          <section>
            {me?.Expenses.map((expense) => (
              <ExistingExpenseItem key={expense.id} expense={expense} />
            ))}
          </section>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
