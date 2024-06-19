import "./navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bottom">
      <section id="leftfooter" className="links">
        <NavLink className="navlink" to="/">
          Home
        </NavLink>
        <NavLink className="navlink" to="/about">
          About Us
        </NavLink>
      </section>
      <section className="leftside">
        <Link to="https://www.linkedin.com/in/bravermanian/">
          <img
            className="social_media_logo"
            src="https://res.cloudinary.com/dzpne110u/image/upload/v1718309017/FalconFinancial/linkedin_j2xyoh.svg"
          />
        </Link>
        <p id="rightfooter" className="navlink">
          Created By Ian Braverman
        </p>
      </section>
    </footer>
  );
}
