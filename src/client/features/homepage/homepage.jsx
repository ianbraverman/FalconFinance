import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useGetUserQuery } from "../userform/accountSlice";
import "./home.css";

export default function Homepage() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  return (
    <>
      <div className="fullpage">
        <section className="threeareasection">
          <article className="leftsideinformation">
            <article className="welcomeleft">
              <p className="welcometoleft">Welcome to</p>
              <h1 className="falconfinanceleft">Falcon</h1>
              <h1 className="falconfinanceleft">Finance</h1>
              <section className="leftinfo">
                <article className="helloorlogin">
                  {token ? (
                    <>
                      <p>
                        Hello {me?.firstname} {me?.lastname},
                      </p>
                      <button className="link">
                        <NavLink to="/userform/personalinfo">
                          Update Your User Information
                        </NavLink>
                      </button>
                      <button className="link">
                        <NavLink to="/statistics">
                          View Your Financial Breakdown
                        </NavLink>
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Please Log In Or Make An Account</p>
                      <button className="link">
                        <NavLink to="/login">Log In Or Register</NavLink>
                      </button>
                    </>
                  )}
                </article>
                <p className="happytohaveyou">
                  We're thrilled to have you here and are excited to help you on
                  your journey to financial wellness.
                </p>
              </section>
            </article>
          </article>
          <article className="imagecontainer">
            <img
              className="falconimage"
              src="https://res.cloudinary.com/dzpne110u/image/upload/v1718035875/FalconFinancial/falconhomepage_pxacu8.webp"
            />
          </article>
          <article className="rightsideinformation">
            <p>
              At Falcon Finance, we believe that everyone deserves to achieve
              their financial goals and secure a prosperous future. Our
              easy-to-use platform is designed to guide you every step of the
              way.
            </p>
            <button className="link">
              <NavLink to="/about">About Us</NavLink>
            </button>
          </article>
        </section>
      </div>
    </>
  );
}
