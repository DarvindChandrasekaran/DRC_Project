import React, { useEffect } from "react";
import { SiteDataContext } from "../../SiteData";
import "./WalletBalance.css";

const WalletBalance = () => {
  const { fetchWalletList, wallet_list } = React.useContext(SiteDataContext);
  const [balance, setBalance] = React.useState(0);

  useEffect(() => {
    if (wallet_list.length < 1) {
      fetchWalletList();
    }

    const usd_wallet = wallet_list.find((w) => w.currency === "USD");
    if (usd_wallet) {
      setBalance(usd_wallet.balance);
    }
  }, [fetchWalletList, wallet_list]);

  return (
    <div className="balance-section">
      <div className="w-value">
        <p>Wallet's Balance</p>
        <h1 id="wal-bal">{`USD ${balance.toLocaleString("en-US")}`}</h1>
      </div>
    </div>
  );
};

export default WalletBalance;
