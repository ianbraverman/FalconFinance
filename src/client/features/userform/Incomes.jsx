import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useDeleteInfoMutation } from "./accountSlice";
import "./userform.css";

export default function Incomes() {
  const { data: me } = useGetUserQuery();
  let [deleteIncome] = useDeleteInfoMutation();
  const token = useSelector(selectToken);

  const deleteAnIncome = async (income, evt) => {
    evt.preventDefault();
    try {
      await deleteIncome({
        id: income.id,
        table: "incomes",
      });
    } catch (error) {
      console.log(error);
    }
  };

  function ExistingExpenseItem({ income }) {
    //delete button will on click delete that Income and send a delete request to delete it
    return (
      <section>
        <p> Name: {income?.name}</p>
        <p> Type: {income?.incomeType}</p>
        <p> Income Amount: {income?.amount}</p>
        <p> Yearly Increase: {income?.yearlyIncrease}</p>
        <form onSubmit={(evt) => deleteAnIncome(income, evt)}>
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
          <p>Page 4/6</p>
          <h1>Incomes</h1>
          <section>
            {me?.Income.map((income) => (
              <ExistingExpenseItem key={income.id} income={income} />
            ))}
          </section>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
