import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useDeleteInfoMutation } from "./accountSlice";
import "./userform.css";

export default function Assets() {
  const { data: me } = useGetUserQuery();
  let [deleteAsset] = useDeleteInfoMutation();
  const token = useSelector(selectToken);

  const deleteAnAsset = async (asset, evt) => {
    evt.preventDefault();
    try {
      await deleteAsset({
        id: asset.id,
        table: "assets",
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        <form onSubmit={(evt) => deleteAnAsset(asset, evt)}>
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
