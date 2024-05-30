import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetUserQuery,
  useDeleteInfoMutation,
  useAddIncomeMutation,
} from "./accountSlice";
import "./userform.css";

//this generates a random unique id for each new Income
const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

//this creates a new income item, and keeps track of the particular information for each income
//this component is outside of incomes main component
function NewIncomeItem({ income, handleNewIncomeChange, handleDeleteIncome }) {
  const { id, name, incomeType, amount, yearlyIncrease } = income;

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleNewIncomeChange(id, name, value);
  };

  const handleDelete = () => {
    handleDeleteIncome(income.id); // Call the parent component's delete function with the correct index
  };

  return (
    <section>
      <label>
        Name Of Income:
        <input
          className="input"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </label>
      <label>
        How much is this income every year:
        <input
          className="input"
          type="text"
          name="amount"
          value={amount}
          onChange={handleChange}
        />
      </label>
      <label>
        How much does this income increase year over year:
        <input
          className="input"
          type="text"
          name="yearlyIncrease"
          value={yearlyIncrease}
          onChange={handleChange}
        />
      </label>
      <label>
        Type Of Income:
        <select
          className="input"
          name="incomeType"
          value={incomeType}
          onChange={handleChange}
        >
          <option value="SALARY">Salary</option>
          <option value="BONUS">Bonus</option>
          <option value="COMMISSION">Commission</option>
          <option value="DIVIDENDS">Dividends</option>
          <option value="INTEREST">Interest</option>
          <option value="RENTAL_INCOME">Rental Income</option>
          <option value="SIDE_HUSTLE">Side Hustle</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <button onClick={() => handleDelete()}>Delete Income</button>
    </section>
  );
}

function ExistingIncomeItem({ income, deleteAnIncome }) {
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

export default function Incomes() {
  const { data: me } = useGetUserQuery();
  let [deleteIncome] = useDeleteInfoMutation();
  let [addIncome] = useAddIncomeMutation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [newIncomes, setNewIncomes] = useState([]);

  const submitIncomesAndLink = async (evt) => {
    evt.preventDefault();
    try {
      for (let i = 0; i < newIncomes.length; i++) {
        if (newIncomes[i]["name"] != "")
          await addIncome({
            name: newIncomes[i]["name"],
            incomeType: newIncomes[i]["incomeType"],
            amount: newIncomes[i]["amount"],
            yearlyIncrease: newIncomes[i]["yearlyIncrease"],
          });
      }
      navigate(`/userform/expenses`);
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleAddNewIncome = () => {
    setNewIncomes([
      ...newIncomes,
      {
        id: generateUniqueId(),
        name: "",
        incomeType: "SALARY",
        amount: 0,
        yearlyIncrease: 0,
      },
    ]);
  };

  const handleDeleteIncome = (id) => {
    const updatedIncomes = newIncomes.filter((income) => income.id !== id);
    setNewIncomes(updatedIncomes);
  };

  const handleNewIncomeChange = (id, fieldName, value) => {
    setNewIncomes((prevIncomes) => {
      return prevIncomes.map((income) => {
        if (income.id === id) {
          return { ...income, [fieldName]: value };
        }
        return income;
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
          <p>Page 4/6</p>
          <h1>Incomes</h1>
          <section>
            {me?.Income.map((income) => (
              <ExistingIncomeItem
                key={income.id}
                income={income}
                deleteAnIncome={deleteAnIncome}
              />
            ))}
          </section>
          {newIncomes.map((newIncome) => (
            <NewIncomeItem
              key={newIncome.id}
              income={newIncome}
              handleNewIncomeChange={handleNewIncomeChange}
              handleDeleteIncome={handleDeleteIncome}
            />
          ))}
          <button onClick={handleAddNewIncome}> Add New Income </button>
          <button onClick={submitIncomesAndLink}>
            Save And Continue To Expenses
          </button>
          <button>
            <Link to={"/userform/liabilities"}>Return To Liabilities</Link>
          </button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
