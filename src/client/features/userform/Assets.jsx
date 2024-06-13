import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate, NavLink } from "react-router-dom";
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
    <section className="questionnaire">
      <label>
        What Is The Name Of Asset:
        <input
          className="input"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Current Balance Of The Asset:
        <input
          className="input"
          type="text"
          name="balance"
          value={balance}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Yearly Interest Earned On This Asset? If none, enter 0:
        <input
          className="input"
          type="text"
          name="interest"
          value={interest}
          onChange={handleChange}
        />
      </label>
      <label>
        How Much Are You Contributing Yearly To This Asset? If none, enter 0:
        <input
          className="input"
          type="text"
          name="contributions"
          value={contributions}
          onChange={handleChange}
        />
      </label>
      <label>
        Is This A Physical Or Monetary Asset?
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
        What Is The Type Of This Asset?
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
      <button className="buttondelete" onClick={() => handleDelete()}>
        Delete Asset
      </button>
    </section>
  );
}
//this component displays all of the existing assets they have.
function ExistingAssetItem({ asset, deleteAnAsset }) {
  //delete button will on click delete that asset and send a delete request to delete it

  return (
    <section className="questionnaire">
      <p> Asset Name: {asset?.name}</p>
      <p> Asset Type: {asset?.assetType}</p>
      <p> Yearly Interest Earned On Asset: {asset?.interest}</p>
      <p> Yearly Contributions Made To This Asset: {asset?.contributions}</p>
      <p> Physical Or Monetary Asset: {asset?.physMon}</p>
      <p> Asset Balance: {asset?.balance}</p>
      <form onSubmit={(evt) => deleteAnAsset(asset, evt)}>
        <button className="buttondelete">Delete Asset</button>
      </form>
    </section>
  );
}

export default function Assets() {
  const { data: me } = useGetUserQuery();
  let [deleteAsset] = useDeleteInfoMutation();
  let [addAsset] = useAddAssetMutation();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [newAssets, setNewAssets] = useState([]);

  const submitAssetsAndLink = async (evt) => {
    evt.preventDefault();
    try {
      for (let i = 0; i < newAssets.length; i++) {
        if (newAssets[i]["name"] != "")
          await addAsset({
            name: newAssets[i]["name"],
            assetType: newAssets[i]["type"],
            balance: newAssets[i]["balance"],
            interest: newAssets[i]["interest"],
            contributions: newAssets[i]["contributions"],
            physMon: newAssets[i]["physMon"],
          });
      }

      navigate(`/userform/liabilities`);
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
          <section className="toparea">
            <p>
              Hello {me?.firstname} {me?.lastname}
            </p>
            <p>Please Fill Out The Following Information</p>
            <p id="currentpage">Page 2/6</p>
          </section>
          <h1>Assets</h1>
          {me?.Assets.length > 0 ? <h2>Existing Assets:</h2> : <p></p>}
          <section>
            {me?.Assets.map((asset) => (
              <ExistingAssetItem
                key={asset.id}
                asset={asset}
                deleteAnAsset={deleteAnAsset}
              />
            ))}
          </section>
          {newAssets.length > 0 ? <h2>New Assets:</h2> : <p></p>}
          {newAssets.map((newAsset) => (
            <NewAssetItem
              key={newAsset.id}
              asset={newAsset}
              handleNewAssetChange={handleNewAssetChange}
              handleDeleteAsset={handleDeleteAsset}
            />
          ))}
          <button className="bottombuttons" onClick={handleAddNewAsset}>
            {" "}
            Add New Asset{" "}
          </button>
          <button className="bottombuttons" onClick={submitAssetsAndLink}>
            Save And Continue To Liabilites
          </button>
          <button className="bottombuttons">
            <Link to={"/userform/personalinfo"}>Return To Personal Info</Link>
          </button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
