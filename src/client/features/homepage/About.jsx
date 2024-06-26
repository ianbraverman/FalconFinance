import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useGetUserQuery } from "../userform/accountSlice";
// import "./home.css";

export default function About() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);

  return (
    <>
      <section className="aboutmainsection">
        <article className="aboutsection">
          <h1 className="aboutheader">Getting Started: </h1>
          <section className="aboutphotoandinfo">
            <div className="aboutleftsideinfogettingstarted">
              <p id="aboutsectionheaders">Register For A New Account: </p>
              <p>
                Begin by signing up for a new account. Your information is
                secure with us, and we value your privacy.
              </p>
              <p id="aboutsectionheaders">Log In: </p>
              <p>
                Once your account is set up, log in to access your personalized
                dashboard.
              </p>
            </div>
            <article className="aboutimagecontainer">
              <img
                className="aboutimagegettingstarted"
                src="https://res.cloudinary.com/dzpne110u/image/upload/v1718983750/FalconFinancial/AboutPage/loginpage_jwwknc.jpg"
              />
            </article>
          </section>
        </article>
        <article className="aboutsection">
          <h1 className="aboutheader">How It Works: </h1>
          <section className="aboutphotoandinfo">
            <div className="aboutleftsideinfo">
              <p id="aboutsectionheaders">Fill Out Your Financial Profile: </p>
              <p>
                After logging in, you'll be directed to a comprehensive survey.
                Here, you'll enter important details about your finances:
              </p>
              <li>
                Assets: List all your valuable possessions and investments.
              </li>
              <li>Liabilities: Enter any debts or financial obligations.</li>
              <li>
                Income: Provide details about your earnings from various
                sources.
              </li>
              <li>
                Expenses: Document your regular and occasional expenditures.
              </li>
              <li>
                Goals: Define your financial aspirations, whether it's saving
                for retirement, buying a house, or anything in between.
              </li>
              <li>
                Personal Information: Share insights like your expected
                inflation rate and life expectancy.
              </li>
              <p id="aboutsectionheaders">Analyze Your Financial Health:</p>
              <p>
                Once you've completed the survey, you'll be taken to your
                Statistics page. Here, you can monitor your financial progress
                through various metrics including:
              </p>
              <li>
                Goal Achievement Percentages: See how close you are to reaching
                your financial goals.
              </li>
              <li>
                Emergency Fund Status: Check the health of your emergency
                savings.
              </li>
              <li>
                Income vs. Expenses: Analyze your spending habits to ensure
                you're living within your means.
              </li>
            </div>
            <section className="aboutrightsideinfo">
              <article className="aboutimagecontainer">
                <img
                  className="aboutimage"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718984317/FalconFinancial/AboutPage/userform_yejgk5.jpg"
                />
              </article>
              <article className="aboutimagecontainer">
                <img
                  className="aboutimage"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718984497/FalconFinancial/AboutPage/financialbreakdown_qffvj7.jpg"
                />
              </article>
            </section>
          </section>
        </article>
        <article className="aboutsection">
          <h1 className="aboutheader">Personalized Recommendations</h1>
          <section className="aboutphotoandinfo">
            <div className="aboutleftsideinfogettingstarted">
              <p>
                Our system provides tailored advice to help you improve your
                financial standing. You'll receive tips on:
              </p>
              <li>Increasing your savings rate.</li>
              <li>Reducing unnecessary expenses.</li>
              <li>Optimizing your investment strategies.</li>
              <li>Enhancing your overall financial health.</li>
            </div>
            <section className="aboutrightsideinfo">
              <article className="aboutpersonalizedrecommendationsimagecontainer">
                <img
                  className="aboutimagegettingstarted"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718987271/FalconFinancial/AboutPage/financialgoalsbreakdown_yvzzyy.jpg"
                />
              </article>
              <article className="aboutpersonalizedrecommendationsimagecontainer">
                <img
                  className="aboutimagegettingstarted"
                  src="https://res.cloudinary.com/dzpne110u/image/upload/v1718986669/FalconFinancial/AboutPage/financialrecommendations_dvrhwm.jpg"
                />
              </article>
            </section>
          </section>
        </article>
        <article className="aboutsection">
          <h1 className="aboutheader">Our Commitment</h1>
          <p>
            At Falcon Finance, we're dedicated to helping you take control of
            your finances with confidence. Whether you're just starting out or
            you're looking to fine-tune your financial plan, our tools and
            insights are here to support you every step of the way.
          </p>
        </article>
        <article className="aboutsection">
          <h1 className="aboutheader">Join Us Today!</h1>
          <p>
            Ready to transform your financial future? Sign up now and take the
            first step towards achieving your financial goals.
          </p>
          <p>
            Thank you for choosing Falcon Finance. We're here to make your
            financial dreams a reality!
          </p>
          <p>All images generated with the assistance of AI.</p>
        </article>
      </section>
    </>
  );
}
