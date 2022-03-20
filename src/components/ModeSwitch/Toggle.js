import React from "react";
import "./ToggleSwitch.scss";

//toggle component
//onClick it will change the theme
const Toggle = ({ toggleTheme, theme }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        name="toggleSwitch"
        id="toggleSwitch"
        onClick={toggleTheme}
      />
      {
        <label className="toggle-switch-label" htmlFor="toggleSwitch">
          <span className="toggle-switch-inner" />
          <span className="toggle-switch-switch" />
        </label>
      }
    </label>
  );
};

export default Toggle;
