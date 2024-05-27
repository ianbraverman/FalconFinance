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
                <p>Great job, your yearly income of {totalIncome} exceeds or covers your yearly expenses of {totalExpenses}. Your yearly surplus is {surplusDeficit}</p>
                <p>You are earning enough to cover your yearly expenses</p>
                <p>For a more detailed breakdown press the button below</p>
                <button>Income Expenses Breakdown</button>
            </>
        )
    } else {
        return ( 
            <>
                <p>Due to your yearly expenses of {totalExpenses} exceeding your yearly income of {totalIncome}, you are currently running a deficit of {surplusDeficit}</p>
                <p>There are many ways to manage your expenses. For a more detailed breakdown press the button below</p>
                <button>Income Expenses Breakdown</button>
            </>
        )
    }
}

function CurrentAssetsLiabilities({me}) {
    let totalAssets = 0
    let totalLiabilities = 0
    for (let i = 0; i<me.Assets.length; i++) {
        totalAssets += me.Assets[i].balance;
    }
    for (let i = 0; i<me.Liabilities.length; i++) {
        totalLiabilities += me.Liabilities[i].amount;
    }
    let breakdown = totalAssets - totalLiabilities;
    if (breakdown >=0) {
        return (
            <>
                <p>Great job, your overall assets of {totalAssets} exceeds your overall liabilities of {totalLiabilities}</p>
                <p>You have done a nice job of not taking on too much debt, and saving enough.</p>
                <p>For a more detailed breakdown press the button below</p>
                <button>Assets Liabilities Breakdown</button>
            </>
        )
    } else {
        return (
            <>
                <p>Your total liabilities of {totalLiabilities} is currently exceeding your overall assets of {totalAssets}</p>
                <p>There are many ways to decrease your liabilities and increase your assets. For a more detailed breakdown press the button below</p>
                <button>Assets Liabilities Breakdown</button>
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
        {me && <CurrentAssetsLiabilities me={me} />}
        </>
    ) : (
        <p>Please Log In</p>
    )}
    </>
    )

}