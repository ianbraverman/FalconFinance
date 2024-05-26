import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import {
    useGetUserQuery,
} from "../userform/accountSlice"

function YearlyIncomeExpenses({me}) {
    let totalIncome = 0
    let totalExpenses = 0
    for (let i = 0; i<me.Income.length; i++) {
        totalIncome += me.Income[i].amount;
    }
    for (let i = 0; i<me.Expenses.length; i++) {
        totalExpenses += me.Expenses[i].amount;
    }
    let surplusDeficit = totalIncome - totalExpenses;
    if (surplusDeficit >= 0) {
        return (
            <>
                <p>Great job, your yearly income of {totalIncome} exceeds your yearly expenses of {totalExpenses}. Your yearly surplus is {surplusDeficit}</p>
                <p>You are earning enough to cover your yearly expenses</p>
                <p>For a more detailed breakdown please press here</p>
                <button>Income Expenses Breakdown</button>
            </>
        )
    } else {
        return ( 
            <>
                <p>Due to your yearly expenses of {totalExpenses} exceeding your yearly income of {totalIncome}, you are currently running a deficit of {surplusDeficit}</p>
                <p>There are many ways to manage your expenses. For a more detailed breakdown please press here</p>
                <button>Income Expenses Breakdown</button>
            </>
        )
    }
}


export default function StatisticsHome() {
    const { data: me } = useGetUserQuery();
    const token = useSelector(selectToken);
    
    return (
    <>



    {token ? (
        <> 
        <h1>Here is a breakdown of some of the key aspects of your financial wellness</h1>
        {me && <YearlyIncomeExpenses me={me} />}
        </>
    ) : (
        <p>Please Log In</p>
    )}
    </>
    )

}