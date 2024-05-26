import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import {
    useGetUserQuery,
} from "../userform/accountSlice"

export default function Homepage() {
    const { data: me } = useGetUserQuery();
    const token = useSelector(selectToken);
    
    
    return (
        <>
            <h1>Welcome to The Budgeting Website</h1>
            <p>We're thrilled to have you here and excited to help you on your journey to financial wellness. At Financial Budgeting Website, we believe that everyone deserves to achieve their financial goals and secure a prosperous future. Our easy-to-use platform is designed to guide you every step of the way.</p>
            <h2></h2>
            {token ? (
                <p>Hello {me?.firstname} {me?.lastname}</p>
            ) : (
                <>
                    <p>Please Log In Or Make An Account</p>
                    <Link to="/login">
                        <button>Log In Or Register</button>
                    </Link>
                </>
            )}
        </>
    )
}

