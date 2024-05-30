import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetUserQuery,
  useDeleteInfoMutation,
  useAddLiabilityMutation,
} from "./accountSlice";
import "./userform.css";

//this generates a random unique id for each new liability
const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

//this creates a new Liability item, and keeps track of the particular information for each Liability
//this component is outside of Liabilities main component
function NewLiabilityItem({
  liability,
  handleNewLiabilityChange,
  handleDeleteLiability,
}) {
  const { id, name, interest, liabilityType, monthlyPayment, amount } =
    liability;

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleNewLiabilityChange(id, name, value);
  };

  const handleDelete = () => {
    handleDeleteLiability(liability.id); // Call the parent component's delete function with the correct index
  };

  return (
    <section className="questionnaire">
      <label>
        What Is The Name Of This Liability:
        <input
          className="input"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Montly Payment For This Liability? If None, Enter 0:
        <input
          className="input"
          type="text"
          name="monthlyPayment"
          value={monthlyPayment}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Yearly Interest Percentage Paid For This Liability? If None,
        Enter 0:
        <input
          className="input"
          type="text"
          name="interest"
          value={interest}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Balance Of This Liability:
        <input
          className="input"
          type="text"
          name="amount"
          value={amount}
          onChange={handleChange}
        />
      </label>
      <label>
        What Is The Type Of Liability:
        <select
          className="input"
          name="liabilityType"
          value={liabilityType}
          onChange={handleChange}
        >
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="STUDENT_LOAN">Student Loan</option>
          <option value="MORTGAGE">Mortgage</option>
          <option value="AUTO_LOAN">Auto Loan</option>
          <option value="PERSONAL_LOAN">Personal Loan</option>
          <option value="MEDICAL_DEBT">Medical Debt</option>
          <option value="TAXES_OWNED">Taxes Owed</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <button className="buttondelete" onClick={() => handleDelete()}>
        Delete Liability
      </button>
    </section>
  );
}

function ExistingLiabilitiesItem({ liability, deleteALiability }) {
  //delete button will on click delete that liabilities and send a delete request to delete it
  return (
    <section className="questionnaire">
      <p> Liability Name: {liability?.name}</p>
      <p> Liability Type: {liability?.liabilityType}</p>
      <p> Yearly Interest Paid On This Liability: {liability?.interest} %</p>
      <p> Balance Of This Liability: {liability?.amount}</p>
      <p>
        {" "}
        Monthly Payment Paid Toward This Liability: {liability?.monthlyPayment}
      </p>
      <form onSubmit={(evt) => deleteALiability(liability, evt)}>
        <button className="buttondelete">Delete Liability</button>
      </form>
    </section>
  );
}

export default function Liabilities() {
  const { data: me } = useGetUserQuery();
  let [deleteLiability] = useDeleteInfoMutation();
  let [addLiability] = useAddLiabilityMutation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [newLiabilities, setNewLiabilities] = useState([]);

  const submitLiabilitiesAndLink = async (evt) => {
    evt.preventDefault();
    try {
      for (let i = 0; i < newLiabilities.length; i++) {
        if (newLiabilities[i]["name"] != "")
          await addLiability({
            name: newLiabilities[i]["name"],
            interest: newLiabilities[i]["interest"],
            liabilityType: newLiabilities[i]["liabilityType"],
            monthlyPayment: newLiabilities[i]["monthlyPayment"],
            amount: newLiabilities[i]["amount"],
          });
      }
      navigate(`/userform/incomes`);
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleDeleteLiability = (id) => {
    const updatedLiabilities = newLiabilities.filter(
      (liability) => liability.id !== id
    );
    setNewLiabilities(updatedLiabilities);
  };

  const handleNewLiabilityChange = (id, fieldName, value) => {
    setNewLiabilities((prevLiabilities) => {
      return prevLiabilities.map((liability) => {
        if (liability.id === id) {
          return { ...liability, [fieldName]: value };
        }
        return liability;
      });
    });
  };

  const handleAddNewLiability = () => {
    setNewLiabilities([
      ...newLiabilities,
      {
        id: generateUniqueId(),
        name: "",
        interest: 0,
        //made it so default liabilityType is credit card to line up with the default of the drop down menu being credit card so doesnt throw error anymore
        liabilityType: "CREDIT_CARD",
        monthlyPayment: 0,
        amount: 0,
      },
    ]);
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
          <p>Page 3/6</p>
          <h1>Liabilities</h1>
          {me?.Liabilities.length > 0 ? (
            <h2>Existing Liabilities:</h2>
          ) : (
            <p></p>
          )}
          <section>
            {me?.Liabilities.map((liability) => (
              <ExistingLiabilitiesItem
                key={liability.id}
                liability={liability}
                deleteALiability={deleteALiability}
              />
            ))}
          </section>
          {newLiabilities.length > 0 ? <h2>New Liabilities:</h2> : <p></p>}
          {newLiabilities.map((newLiability) => (
            <NewLiabilityItem
              key={newLiability.id}
              liability={newLiability}
              handleNewLiabilityChange={handleNewLiabilityChange}
              handleDeleteLiability={handleDeleteLiability}
            />
          ))}
          <button onClick={handleAddNewLiability}> Add New Liability </button>
          <button onClick={submitLiabilitiesAndLink}>
            Save And Continue To Incomes
          </button>
          <button>
            <Link to={"/userform/assets"}>Return To Assets</Link>
          </button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
