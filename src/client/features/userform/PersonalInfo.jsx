import React, { useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate, NavLink } from "react-router-dom";
import { useGetUserQuery, useUpdatePersonalInfoMutation } from "./accountSlice";
import "./userform.css";

export default function PersonalInfo() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [updatePersonalInfo] = useUpdatePersonalInfoMutation();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    retired: "",
    lifeexpect: "",
    inflation: "",
  });

  const submitPersonalInfoAndLink = async (evt) => {
    evt.preventDefault();
    try {
      await updatePersonalInfo({
        firstname: formData["firstname"],
        lastname: formData["lastname"],
        age: formData["age"],
        retired: formData.retired === "TRUE",
        lifeexpect: formData["lifeexpect"],
        inflation: formData["inflation"],
      });
      navigate(`/userform/assets`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (me) {
      setFormData({
        firstname: me.firstname || "",
        lastname: me.lastname || "",
        age: me.age || "",
        retired: me.retired ? "TRUE" : "FALSE",
        lifeexpect: me.lifeexpect || "",
        inflation: me.inflation || "",
      });
    }
  }, [me]);
  //user must be logged in for the form to appear, otherwise asks them to log in
  //also if the user has not filled out form before and dont have first and last name will
  //say hello user instead of hello first name last name
  return (
    <>
      {token ? (
        <>
          <section className="toparea">
            {me?.firstname && me?.lastname ? (
              <p>
                Hello {me?.firstname} {me?.lastname}
              </p>
            ) : (
              <p>Hello User</p>
            )}
            <p>Please Fill Out The Following Information</p>
            <p id="currentpage">Page 1/6</p>
          </section>
          <div className="personalinfolayout">
            <article>
              <p className="descriptionForm">
                Over the following pages you will enter information on your
                current financial standing. Beginning with your personal
                information such as first and last name, followed by entering
                your assets, liabilities, income, expenses, and goals, our
                system will build a statistical analysis of your financial
                wellness, and provide recommendations to help you better achieve
                your financial dreams.
              </p>
            </article>
            <section>
              <form>
                <section className="personalinfoquestions">
                  <label>
                    What is your first name?
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      className="personalinfoinput"
                    />
                  </label>
                  <label>
                    What is your last name?
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                      className="personalinfoinput"
                    />
                  </label>
                  <label>
                    How old are you?
                    <input
                      type="text"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="personalinfoinput"
                    />
                  </label>
                  <label>
                    Are you currently retired?
                    <select
                      value={formData.retired}
                      onChange={(e) =>
                        setFormData({ ...formData, retired: e.target.value })
                      }
                      className="personalinfoinput"
                    >
                      <option value="TRUE">Yes</option>
                      <option value="FALSE">No</option>
                    </select>
                  </label>
                  <label>
                    What is your life expectancy?
                    <input
                      type="text"
                      value={formData.lifeexpect}
                      onChange={(e) =>
                        setFormData({ ...formData, lifeexpect: e.target.value })
                      }
                      className="personalinfoinput"
                    />
                  </label>
                  <label>
                    What do you estimate inflation to be year over year? Enter
                    as a whole number, for example 2% enter 2.
                    <input
                      type="text"
                      value={formData.inflation}
                      onChange={(e) =>
                        setFormData({ ...formData, inflation: e.target.value })
                      }
                      className="personalinfoinput"
                    />
                  </label>
                </section>
              </form>
              <button
                className="bottombuttons"
                onClick={submitPersonalInfoAndLink}
              >
                Save And Continue To Assets
              </button>
            </section>
          </div>
        </>
      ) : (
        <section className="pleaseloginarea">
          <p className="pleaselogin">Please Log In</p>
          <button className="link">
            <NavLink to="/login">Log In Or Register</NavLink>
          </button>
        </section>
      )}
    </>
  );
}
