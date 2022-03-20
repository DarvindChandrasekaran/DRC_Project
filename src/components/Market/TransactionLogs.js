import React from "react";
import { SiteDataContext } from "../../SiteData";
import "./TransactionLogs.css";

const TransactionLogs = ({ count, details, type }) => {
  const { wallet_list, is_data_ready } = React.useContext(SiteDataContext);
  const filtered_logs = details.filter((d) => d.transaction_type === type);

  if (!is_data_ready || !filtered_logs) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="transaction">
      {filtered_logs.slice(0, count).map((log, index) => {
        const { id, currency, current_price, quantity, wallet_id } = log;
        const balance =
          wallet_list.find((w) => w.wallet_id === wallet_id)?.balance || 0;

        return (
          <div
            className={`txn-card ${index === 0 ? "animate" : "animate-down"}`}
            key={id}
          >
            <div className={`txn-type ${type}`}>{type}</div>
            <div className="txn-details">
              <div className="header">
                <strong>{`${quantity} ${currency} `}</strong>
                {`at ${(current_price * quantity).toLocaleString("en-US")} USD`}
              </div>
              <div className="body">
                {currency} balance is {balance?.toLocaleString("en-US") || 0}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionLogs;
