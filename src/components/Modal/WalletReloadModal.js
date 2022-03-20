import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import classes from "./WalletReloadModal.module.css";
import { SiteDataContext } from "../../SiteData";
import { BASE_URL } from "../ApiBinance/HikersAPI";
import { useNavigate } from "react-router-dom";

const WalletReloadModal = (props) => {
  const [selected_wallet, setSelectedWallet] = useState(null);
  const [topup_amount, setTopupAmount] = useState(0);
  const [input_err, setInputError] = useState("");
  const [message, setMessage] = useState("");
  const { user_data, is_data_ready, wallet_list, fetchWalletList, checkJWT } =
    useContext(SiteDataContext);
  const navigate = useNavigate();

  //SET USER SELECTED WALLET
  useEffect(() => {
    if (wallet_list && wallet_list?.length > 0) {
      setSelectedWallet(wallet_list.find((w) => w.currency === "USD"));
    }
  }, [wallet_list]);

  //REQ TO BE FOR TRANSACTION HISTORYx1
  const getHistory = async () => {
    const { loginid, token } = user_data;
    const req = new Request(`${BASE_URL}/transaction/${loginid}`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ token }),
    });
    const result = await fetch(req);
    const data = await result.json();
  };

  //REQ TO BE FOR RELOAD/TRANSFER PROCESS
  const reloadWallet = () => {
    let is_authenticated = checkJWT();

    if (is_authenticated) {
      const reload_info = {
        token: user_data.token,
        amount: topup_amount,
        currency: selected_wallet?.currency,
      };
      const req = new Request(
        `${BASE_URL}/wallet/topup/${selected_wallet.wallet_id}`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(reload_info),
        }
      );
      fetch(req).then((res) => {
        res.json().then((data) => {
          fetchWalletList();
        });
      });
    } else {
      navigate("/login");
    }
  };

  const walletReloadHandler = () => {
    if (topup_amount >= 10 && topup_amount <= 10000) {
      reloadWallet();
      setTopupAmount("");
      setInputError("");
      setMessage("Reload/Transfer Successful");
    } else if (topup_amount < 10) {
      setInputError("Value must be greater than or equal to 10");
    } else if (topup_amount > 10000) {
      setInputError("Value must be less than or equal to 10000");
    }
  };

  //Check if user_data is ready
  if (!is_data_ready || !wallet_list || wallet_list.length < 1) {
    return <h1>Loading..</h1>;
  }

  return (
    <div style={{ display: `${props.display}` }}>
      <div
        className={classes.backdrop}
        onClick={() => props.setDisplay("none")}
      />
      <div className={classes.popup}>
        <Card className={classes.modal}>
          <h3 className={classes.title}>Wallet Reload &#38; Asset Transfer</h3>
          <div className={classes.info}>
            <div className={classes.info_line}>
              Wallet ID:
              <span className={classes.wallet_info}>
                {selected_wallet?.wallet_id}
              </span>
            </div>
            <div className={classes.info_line}>
              <label name="wallet_currency">Wallet Currency:</label>
              <select
                name="wallet_currency"
                id="wallet_currency"
                className={classes.wallet_currency}
                value={selected_wallet?.currency}
                onChange={(e) => {
                  setSelectedWallet(
                    wallet_list.find((w) => w.currency === e.target.value)
                  );
                }}
              >
                {wallet_list?.map((w) => {
                  return (
                    <option key={w.wallet_id} value={w.currency}>
                      {w.currency}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={classes.info_line}>
              {selected_wallet?.currency === "USD" ? "Reload " : "Transfer "}
              amount:
              <span className={classes.wallet_limit}>
                (Max topup limit 10,000)
              </span>
            </div>
            <input
              className={classes.input_area}
              type="number"
              placeholder="Amount..."
              min="10"
              max="10001"
              value={topup_amount === 0 ? "Amount..." : topup_amount}
              onChange={(e) => setTopupAmount(e.target.value)}
            />
            {input_err ? (
              <div className={`${classes.err_msg} ${classes.info_line}`}>
                {input_err}
              </div>
            ) : (
              <div className={`${classes.succ_msg} ${classes.info_line}`}>
                {message}
              </div>
            )}
          </div>
          <div className={classes.buttons}>
            <span
              className={classes.cancel_btn}
              onClick={() => props.setDisplay("none")}
            >
              Cancel
            </span>
            <button
              type="submit"
              className={classes.reload_btn}
              onClick={walletReloadHandler}
            >
              {selected_wallet?.currency === "USD" ? "Reload" : "Transfer"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletReloadModal;
