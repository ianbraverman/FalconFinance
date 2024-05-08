import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery } from "./accountSlice";
import "./userform.css";

export default function Liabilities() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  function ExistingLiabilitiesItem({ liabilities }) {
    //delete button will on click delete that liabilities and send a delete request to delete it
    return (
      <section>
        <p> Name: {liabilities?.name}</p>
        <p> Type: {liabilities?.liabilityType}</p>
        <p> Interest: {liabilities?.interest}</p>
        <p> Balance: {liabilities?.amount}</p>
        <p> Monthly Payment: {liabilities?.monthlyPayment}</p>
        <button>Delete</button>
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
            {me?.Liabilities.map((liabilities) => (
              <ExistingLiabilitiesItem
                key={liabilities.id}
                liabilities={liabilities}
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
