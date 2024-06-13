import React, { useState } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetUserQuery,
  useDeleteInfoMutation,
  useAddExpenseMutation,
} from "./accountSlice";
import "./userform.css";

//this generates a random unique id for each new expense
const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

//this creates a new expense item, and keeps track of the particular information for each expense
//this component is outside of expense main component
function NewExpenseItem({
  expense,
  handleNewExpenseChange,
  handleDeleteExpense,
}) {
  const { id, name, expenseType, monthlyCost, interest } = expense;

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleNewExpenseChange(id, name, value);
  };
  const handleDelete = () => {
    handleDeleteExpense(expense.id); // Call the parent component's delete function with the correct index
  };
  return (
    <section className="questionnaire">
      <label>
        Name Of Expense:
        <input
          className="input"
          type="text"
          name="name"
          value={name}
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
        Monthly Cost Of Expense:
        <input
          className="input"
          type="text"
          name="monthlyCost"
          value={monthlyCost}
          onChange={handleChange}
        />
      </label>
      <label>
        Type Of Expense:
        <select
          className="input"
          name="expenseType"
          value={expenseType}
          onChange={handleChange}
        >
          <option value="HOUSING">Housing</option>
          <option value="TRANSPORTATION">Transportation</option>
          <option value="FOOD">Food</option>
          <option value="UTILITIES">Utilities</option>
          <option value="HEALTHCARE">Healthcare</option>
          <option value="INSURANCE">Insurance</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="EDUCATION">Education</option>
          <option value="DEBT_PAYMENTS">Debt Payments</option>
          <option value="PERSONAL_CARE">Personal Care</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <button className="buttondelete" onClick={() => handleDelete()}>
        Delete Expense
      </button>
    </section>
  );
}

function ExistingExpenseItem({ expense, deleteAnExpense }) {
  //delete button will on click delete that expense and send a delete request to delete it
  return (
    <section className="questionnaire">
      <p> Name: {expense?.name}</p>
      <p> Type: {expense?.expenseType}</p>
      <p> Interest Cost: {expense?.interest}</p>
      <p> Monthly Cost: {expense?.monthlyCost}</p>
      <form onSubmit={(evt) => deleteAnExpense(expense, evt)}>
        <button className="buttondelete">Delete Expense</button>
      </form>
    </section>
  );
}

export default function Expenses() {
  const { data: me } = useGetUserQuery();
  let [deleteExpense] = useDeleteInfoMutation();
  let [addExpense] = useAddExpenseMutation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [newExpenses, setNewExpenses] = useState([]);

  const submitExpensesAndLink = async (evt) => {
    evt.preventDefault();
    try {
      for (let i = 0; i < newExpenses.length; i++) {
        if (newExpenses[i]["name"] != "")
          await addExpense({
            name: newExpenses[i]["name"],
            expenseType: newExpenses[i]["expenseType"],
            monthlyCost: newExpenses[i]["monthlyCost"],
            interest: newExpenses[i]["interest"],
          });
      }
      navigate(`/userform/goals`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnExpense = async (expense, evt) => {
    evt.preventDefault();
    try {
      await deleteExpense({
        id: expense.id,
        table: "expenses",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewExpense = () => {
    setNewExpenses([
      ...newExpenses,
      {
        id: generateUniqueId(),
        name: "",
        expenseType: "HOUSING",
        monthlyCost: 0,
        interest: 0,
      },
    ]);
  };
  const handleDeleteExpense = (id) => {
    const updatedExpenses = newExpenses.filter((expense) => expense.id !== id);
    setNewExpenses(updatedExpenses);
  };

  const handleNewExpenseChange = (id, fieldName, value) => {
    setNewExpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.id === id) {
          return { ...expense, [fieldName]: value };
        }
        return expense;
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
            <p id="currentpage">Page 5/6</p>
          </section>
          <h1>Expenses</h1>
          {me?.Expenses.length > 0 ? <h2>Existing Expenses:</h2> : <p></p>}
          <section>
            {me?.Expenses.map((expense) => (
              <ExistingExpenseItem
                key={expense.id}
                expense={expense}
                deleteAnExpense={deleteAnExpense}
              />
            ))}
          </section>
          {newExpenses.length > 0 ? <h2>New Expenses:</h2> : <p></p>}
          {newExpenses.map((newExpense) => (
            <NewExpenseItem
              key={newExpense.id}
              expense={newExpense}
              handleNewExpenseChange={handleNewExpenseChange}
              handleDeleteExpense={handleDeleteExpense}
            />
          ))}
          <button className="bottombuttons" onClick={handleAddNewExpense}>
            {" "}
            Add New Expense{" "}
          </button>
          <button className="bottombuttons" onClick={submitExpensesAndLink}>
            Save And Continue To Goals
          </button>
          <button className="bottombuttons">
            <Link to={"/userform/incomes"}>Return To Incomes</Link>
          </button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
