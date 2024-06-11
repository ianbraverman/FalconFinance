import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bottom">
      <section>
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/about">
          About Us
        </NavLink>
      </section>
      <p className="navlink">Created By Ian Braverman</p>
    </footer>
  );
}
