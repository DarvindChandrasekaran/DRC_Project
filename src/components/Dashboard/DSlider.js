import React from "react";
import Ticker from "react-ticker";
import { SiteDataContext } from "../../SiteData";
import { crypto_list } from "../Icons/icons";
import DSliderCard from "./DSliderCard";
import "./DSlider.css";

const DSlider = ({ transaction_data, selectCrypto }) => {
  const { wallet_list } = React.useContext(SiteDataContext);
  const filtered_wallet = wallet_list.filter((w) => w.currency !== "USD");

  const components = (
    <div style={{ display: "flex" }}>
      {filtered_wallet.map((wallet) => {
        const { id, fullname, src } = crypto_list.find(
          (c) => c.id === `${wallet.currency}USDT`
        );

        return (
          <DSliderCard
            key={id}
            name={fullname}
            src={src}
            pair={id}
            data={transaction_data.filter(
              (td) => td.currency === wallet.currency
            )}
            onCardClick={selectCrypto}
          />
        );
      })}
    </div>
  );

  if (filtered_wallet.length < 3) {
    return components;
  }

  return <Ticker>{() => components}</Ticker>;
};

export default DSlider;
