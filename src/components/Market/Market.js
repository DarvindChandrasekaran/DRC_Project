import React from "react";
import { Link } from "react-router-dom";
import BuySellTabs from "./BuySellTabs";
import ChartControls from "./ChartControls/ChartControls";
import HeaderBar from "../Menubar/HeaderBar";
import LightWeightChart from "../Chart/lightweight-chart";
import TimeBar from "./TimeBar";
import WalletBalance from "./WalletBalance";
import { SiteDataContext } from "../../SiteData";
import "./Market.css";
import TopGainerList from "./Sliders/TopGainerList";
import TopLoserList from "./Sliders/TopLoserList";
import TransactionLogs from "./TransactionLogs";

// Configuring - How many Transaction Logs to show
const TXN_COUNT = 2;

const Market = () => {
  const { pair, setPair, user_data } = React.useContext(SiteDataContext);
  const [is_complete, setComplete] = React.useState(false);
  const [theme, setTheme] = React.useState("dark");
  const [interval, setInterval] = React.useState("1m");
  const [txn_details, setTxnDetails] = React.useState([]);
  const [transaction_type, setTransactionType] = React.useState("buy");

  const handleTransaction = (new_txn) => {
    setTxnDetails((prev) => [new_txn, ...prev]);
  };

  return (
    <div className="market-container">
      <HeaderBar theme={theme} setTheme={setTheme} />
      <div className="market-section">
        <div className="chart">
          <ChartControls
            interval={interval}
            setInterval={setInterval}
            pair={pair}
            setPair={setPair}
          />
          <LightWeightChart
            symbol={pair}
            interval={interval}
            onLoadComplete={setComplete}
          />
          {is_complete && (
            <div className="market-trends-section">
              <TopGainerList />
              <TopLoserList />
            </div>
          )}
        </div>
        <div className="transaction">
          <TimeBar />
          <WalletBalance />
          <BuySellTabs
            theme={theme}
            setTheme={setTheme}
            handleTransaction={handleTransaction}
            setTransactionType={setTransactionType}
            pair={pair}
          />
          {!user_data ? (
            <div className="login-signup-section">
              Please{" "}
              <Link to="/login" className="market-links">
                Log In
              </Link>{" "}
              or&nbsp;
              <Link to="/signup" className="market-links">
                Register
              </Link>
            </div>
          ) : (
            ""
          )}
          <TransactionLogs
            details={txn_details}
            type={transaction_type}
            count={TXN_COUNT}
          />
        </div>
      </div>
      {/* {is_complete && (
        <div className="market-trends-section">
          <TopGainerList />
          <TopLoserList />
        </div>
      )} */}
    </div>
  );
};

export default Market;
