import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./Market.css";
import Marketbar from "../Menubar/MarBar";
import MGainSlider from "./MGainSlider";
import MLossSlider from "./MLossSlider";
import BuySellTabs from "./BuySellTabs";
import SideBar from "../Menubar/FinalTestBar";
import Menubar from "./../Menubar/Menubar";
import Footer from "./../Footer/Footer";
import Candlestickchart from "./Candlestickchart";

function Market() {
  const [theme, setTheme] = React.useState("dark");
  return (
    <div className="marketBG">
      {/* <Menubar theme={theme} setTheme={setTheme} /> */}
      <div className="market-layout">
        <div className="market-bar-section">
          <Marketbar theme={theme} setTheme={setTheme} />
        </div>
        <div className="title-section"></div>
        <div className="graph-section">
          <Candlestickchart />
        </div>
        <div className="buysell-section">
          <BuySellTabs />
        </div>

        <div className="gain-section">
          <div className="gain-title">
            <span>Top Gainer</span>
          </div>
          <div className="gain-slider">
            <MGainSlider theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <div className="loss-section">
          <div className="loss-title">
            <span>Top Loser</span>
          </div>
          <div className="loss-slider">
            <MLossSlider theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Market;
