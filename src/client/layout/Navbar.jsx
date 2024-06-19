import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../features/auth/authSlice";

import "./navbar.css";

/**
 * A simple navigation bar that displays "Log In" if the user is not logged in,
 * and "Log Out" if the user is logged in.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(selectToken);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="top">
      <section className="leftnavbarside">
        <NavLink to="/">
          <img
            src="https://res.cloudinary.com/dzpne110u/image/upload/v1718034077/FalconFinancial/falconfinancial500500.png"
            alt="emoji"
            className="nav-image"
          />
        </NavLink>
        <NavLink className="navlink" to="/">
          <p className="websitename">Falcon Finance </p>
        </NavLink>
      </section>
      <menu className="links">
        {token ? (
          <li>
            <NavLink className="navlink" to="/userform/personalinfo">
              User Information Form
            </NavLink>
          </li>
        ) : (
          <></>
        )}
        {token ? (
          <li>
            <NavLink className="navlink" to="/statistics">
              Financial Breakdown
            </NavLink>
          </li>
        ) : (
          <></>
        )}
        {token ? (
          <li>
            <a className="navlink" onClick={handleLogout}>
              Log Out
            </a>
          </li>
        ) : (
          <li>
            <NavLink className="navlink" to="/login">
              Log In/Register
            </NavLink>
          </li>
        )}
      </menu>
    </nav>
  );
}
