import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useDeleteInfoMutation } from "./accountSlice";
import "./userform.css";

const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

export default function Assets() {
  const { data: me } = useGetUserQuery();
  let [deleteAsset] = useDeleteInfoMutation();
  const token = useSelector(selectToken);
  const [newAssets, setNewAssets] = useState([]);
  const [focusedInputId, setFocusedInputId] = useState(null);

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

  const handleAddNewAsset = () => {
    setNewAssets([
      ...newAssets,
      { id: generateUniqueId(), name: "", type: "" },
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

  function NewAssetItem({ asset }) {
    const { id, name, type } = asset;
    const inputRef = useRef(null);

    const handleFocus = () => {
      setFocusedInputId(id);
    };
    useEffect(() => {
      if (focusedInputId === id && inputRef.current) {
        inputRef.current.focus();
      }
    }, [focusedInputId, id]);

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
            onFocus={handleFocus}
            ref={focusedInputId === id ? inputRef : null} // Add the ref here
          />
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
          {newAssets.map((newAsset) => (
            <NewAssetItem key={newAsset.id} asset={newAsset} />
          ))}
          <button onClick={handleAddNewAsset}> Add New Asset </button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
