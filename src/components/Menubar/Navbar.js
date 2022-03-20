import React from "react";
import { Link } from "react-router-dom";
import MenuLogoDark from "./../../assets/Logo/D_menulogo.svg";
import "./Navbar.css";

// imported on landing page

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <img src={MenuLogoDark} className="homebarlogo" alt="MenuLogo" />
      </Link>
      <div className="nav-list">
        <Link to="/market">
          <div>Market</div>
        </Link>
        {/* <Link to="/dashboard">
          <div>Dashboard Sample</div>
        </Link> */}

        <div className="login-signup">
          <Link to="/login">
            <div className="login-btn">Login</div>
          </Link>
          <Link to="/signup">
            <div className="signup-btn">Sign Up</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
