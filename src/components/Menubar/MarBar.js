import React from "react";
import "./DashMarBar.css";
import MarketLogoDark from "../../assets/DashboardAsset/DashLogoDark.svg";
import MarketLogoLight from "../../assets/DashboardAsset/DashLogoLight.svg";
import ToggleSwitch from "./../ModeSwitch/Switch";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Marbar = ({ theme, setTheme }) => {
  return (
    <div className="market-bar">
      <div className="MarketLogo">
        <img
          src={theme === "dark" ? MarketLogoDark : MarketLogoLight}
          alt="Market Header Logo"
        />
        <span className="MarketHead">Market</span>
      </div>
      <div className="market-icon-head">
        <ToggleSwitch theme={theme} setTheme={setTheme} />
        {/* <NotificationsIcon
          sx={theme === "dark" ? { color: "white" } : { color: "black" }}
          fontSize="large"
          className="dash-icon-pads"
        />
        <MailIcon
          sx={theme === "dark" ? { color: "white" } : { color: "black" }}
          fontSize="large"
        /> */}
      </div>
    </div>
  );
};

export default Marbar;
