import React from "react";
import { Link } from "react-router-dom";
import "./Menubar.css";
import MenuLogoDark from "./../../assets/Logo/D_menulogo.svg";
import MenuLogoLight from "./../../assets/Logo/L_menulogo.svg";
import ToggleSwitch from "./../ModeSwitch/Switch";

const Menubar = ({ className, theme, setTheme }) => {
  return (
    <div className={`menubar ${className}`}>
      <Link to="/">
        <img
          src={theme === "dark" ? MenuLogoDark : MenuLogoLight}
          className="menulogo"
          alt="MenuLogo"
        />
      </Link>
      <div id="menubar-switch">
        <ToggleSwitch theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default Menubar;
