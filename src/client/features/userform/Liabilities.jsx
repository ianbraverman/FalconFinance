import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useDeleteInfoMutation } from "./accountSlice";
import "./userform.css";

export default function Liabilities() {
  const { data: me } = useGetUserQuery();
  let [deleteLiability] = useDeleteInfoMutation();
  const token = useSelector(selectToken);

  const deleteALiability = async (liability, evt) => {
    evt.preventDefault();
    try {
      await deleteLiability({
        id: liability.id,
        table: "liabilities",
      });
    } catch (error) {
      console.log(error);
    }
  };

  function ExistingLiabilitiesItem({ liability }) {
    //delete button will on click delete that liabilities and send a delete request to delete it
    return (
      <section>
        <p> Name: {liability?.name}</p>
        <p> Type: {liability?.liabilityType}</p>
        <p> Interest: {liability?.interest}</p>
        <p> Balance: {liability?.amount}</p>
        <p> Monthly Payment: {liability?.monthlyPayment}</p>
        <form onSubmit={(evt) => deleteALiability(liability, evt)}>
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
          <p>Page 2/6</p>
          <h1>Liabilities</h1>
          <section>
            {me?.Liabilities.map((liability) => (
              <ExistingLiabilitiesItem
                key={liability.id}
                liability={liability}
              />
            ))}
          </section>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
