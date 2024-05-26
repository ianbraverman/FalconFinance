import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import {
    useGetUserQuery,
} from "../userform/accountSlice"

export default function StatisticsHome() {
    const { data: me } = useGetUserQuery();
    const token = useSelector(selectToken);
    
    return (
    <>
    {token ? (
        <> yoyoyo </>
    ) : (
        <p>Please Log In</p>
    )}
    </>
    )

}