import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  useGetUserQuery,
  useDeleteInfoMutation,
  useAddAssetMutation,
} from "./accountSlice";
import "./userform.css";

//this generates a random unique id for each new asset
const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};
//this creates a new asset item, and keeps track of the particular information for each asset
//this component is outside of assets main component
function NewAssetItem({ asset, handleNewAssetChange, handleDeleteAsset }) {
  const { id, name, type, balance, interest, contributions, physMon } = asset;

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleNewAssetChange(id, name, value);
  };

  const handleDelete = () => {
    handleDeleteAsset(asset.id); // Call the parent component's delete function with the correct index
  };

  return (
    <section>
      <label>
        Name Of Asset:
        <input
          className="input"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </label>
      <label>
        Balance:
        <input
          className="input"
          type="text"
          name="balance"
          value={balance}
          onChange={handleChange}
        />
      </label>
      <label>
        Yearly Interest Percentage:
        <input
          className="input"
          type="text"
          name="interest"
          value={interest}
          onChange={handleChange}
        />
      </label>
      <label>
        Yearly Contributions:
        <input
          className="input"
          type="text"
          name="contributions"
          value={contributions}
          onChange={handleChange}
        />
      </label>
      <label>
        Physical Or Monetary Asset?
        <select
          className="input"
          name="physMon"
          value={physMon}
          onChange={handleChange}
        >
          <option value="PHYSICAL">Physical</option>
          <option value="MONETARY">Monetary</option>
        </select>
      </label>
      <label>
        Type Of Asset:
        <select
          className="input"
          name="type"
          value={type}
          onChange={handleChange}
        >
          <option value="SAVINGS">Savings</option>
          <option value="CHECKING">Checking</option>
          <option value="INVESTMENT">Investment</option>
          <option value="IRA">IRA</option>
          <option value="ROTH_IRA">Roth IRA</option>
          <option value="FOUR01K">401k</option>
          <option value="CAR">Car</option>
          <option value="HOUSE">House</option>
          <option value="COLLECTIBLE">Collectible</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <button onClick={() => handleDelete()}>Delete Asset</button>
    </section>
  );
}
//this component displays all of the existing assets they have.
function ExistingAssetItem({ asset, deleteAnAsset }) {
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

export default function Assets() {
  const { data: me } = useGetUserQuery();
  let [deleteAsset] = useDeleteInfoMutation();
  let [addAsset] = useAddAssetMutation();
  const token = useSelector(selectToken);
  const [newAssets, setNewAssets] = useState([]);

  const submitAssetsAndLink = async (evt) => {
    evt.preventDefault();
    try {
      for (let i = 0; i < newAssets.length; i++) {
        await addAsset({
          name: newAssets[i]["name"],
          assetType: newAssets[i]["type"],
          balance: newAssets[i]["balance"],
          interest: newAssets[i]["interest"],
          contributions: newAssets[i]["contributions"],
          physMon: newAssets[i]["physMon"],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleAddNewAsset = () => {
    setNewAssets([
      ...newAssets,
      {
        id: generateUniqueId(),
        name: "",
        type: "SAVINGS",
        balance: 0,
        interest: 0,
        contributions: 0,
        physMon: "PHYSICAL",
      },
    ]);
  };

  const handleDeleteAsset = (id) => {
    const updatedAssets = newAssets.filter((asset) => asset.id !== id);
    setNewAssets(updatedAssets);
  };

  const handleNewAssetChange = (id, fieldName, value) => {
    setNewAssets((prevAssets) => {
      return prevAssets.map((asset) => {
        if (asset.id === id) {
          return { ...asset, [fieldName]: value };
        }
        return asset;
      });
    });
  };

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
              <ExistingAssetItem
                key={asset.id}
                asset={asset}
                deleteAnAsset={deleteAnAsset}
              />
            ))}
          </section>
          {newAssets.map((newAsset) => (
            <NewAssetItem
              key={newAsset.id}
              asset={newAsset}
              handleNewAssetChange={handleNewAssetChange}
              handleDeleteAsset={handleDeleteAsset}
            />
          ))}
          <button onClick={handleAddNewAsset}> Add New Asset </button>
          <button onClick={submitAssetsAndLink}>To Liabilites</button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
