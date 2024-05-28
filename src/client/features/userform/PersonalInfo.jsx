import React, { useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useGetUserQuery, useUpdatePersonalInfoMutation } from "./accountSlice";
import "./userform.css";

export default function PersonalInfo() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);
  const [updatePersonalInfo] = useUpdatePersonalInfoMutation();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    retired: "",
    retage: "",
    retincome: "",
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
        retage: formData["retage"],
        retincome: formData["retincome"],
        lifeexpect: formData["lifeexpect"],
        inflation: formData["inflation"],
      });
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
        retage: me.retage || "",
        retincome: me.retincome || "",
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
          {me?.firstname && me?.lastname ? (
            <p>
              Hello {me?.firstname} {me?.lastname}
            </p>
          ) : (
            <p>Hello User</p>
          )}
          <p>Please Fill Out The Following Information</p>
          <p>Page 1/6</p>
          <form>
            <section className="form-section">
              <label>
                What is your first name?
                <input
                  className="input"
                  type="text"
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                />
              </label>
              <label>
                What is your last name?
                <input
                  className="input"
                  type="text"
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                />
              </label>
              <label>
                How old are you?
                <input
                  className="input"
                  type="text"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </label>
              <label>
                Are you currently retired?
                <select
                  className="input"
                  value={formData.retired}
                  onChange={(e) =>
                    setFormData({ ...formData, retired: e.target.value })
                  }
                >
                  <option value="TRUE">True</option>
                  <option value="FALSE">False</option>
                </select>
              </label>
              <label>
                What is your estimated retirement age?
                <input
                  className="input"
                  type="text"
                  value={formData.retage}
                  onChange={(e) =>
                    setFormData({ ...formData, retage: e.target.value })
                  }
                />
              </label>
              <label>
                What is your hopeful retirement income?
                <input
                  className="input"
                  type="text"
                  value={formData.retincome}
                  onChange={(e) =>
                    setFormData({ ...formData, retincome: e.target.value })
                  }
                />
              </label>
              <label>
                What is your life expectancy?
                <input
                  className="input"
                  type="text"
                  value={formData.lifeexpect}
                  onChange={(e) =>
                    setFormData({ ...formData, lifeexpect: e.target.value })
                  }
                />
              </label>
              <label>
                What is your expected inflation Percentage?
                <input
                  className="input"
                  type="text"
                  value={formData.inflation}
                  onChange={(e) =>
                    setFormData({ ...formData, inflation: e.target.value })
                  }
                />
              </label>
            </section>
          </form>
          <button onClick={submitPersonalInfoAndLink}>To Liabilities</button>
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
