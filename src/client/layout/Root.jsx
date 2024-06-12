import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

import "../index.css";

export default function Root() {
  return (
    <>
      <Navbar id="header" />
      <main id="mainContent">
        <Outlet />
      </main>
      <Footer id="footerBottom" />
    </>
  );
}
