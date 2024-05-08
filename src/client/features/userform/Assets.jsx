import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery } from "./accountSlice";
import "./userform.css";

export default function Assets() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  function ExistingAssetItem({ asset }) {
    //delete button will on click delete that asset and send a delete request to delete it
    return (
      <section>
        <p> Name: {asset?.name}</p>
        <p> Type: {asset?.assetType}</p>
        <p> Interest Earned: {asset?.interest}</p>
        <p> Contributions: {asset?.contributions}</p>
        <p> Physical Or Monetary: {asset?.physMon}</p>
        <p> Balance: {asset?.balance}</p>
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
          <h1>Assets</h1>
          <section>
            {me?.Assets.map((asset) => (
              <ExistingAssetItem key={asset.id} asset={asset} />
            ))}
          </section>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
