import React from "react";
import {
  getCurrentCryptoPrice,
  getDailyCryptoChange,
} from "../ApiBinance/rest-binance-data";
import "./DSliderCard.css";

const DSliderCard = ({ pair, src, name, data, onCardClick }) => {
  const [price, setPrice] = React.useState(0);
  const [change_percent, setChangePercent] = React.useState(0);
  const [bought_price, setBoughtPrice] = React.useState(0);
  const [change, setChange] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const calculateBoughtPrice = React.useCallback(
    (price) => {
      let qty_bought = 0;
      let total_bought = 0;
      let total_bought_price = 0;

      const bought_data = data.filter((d) => d.transaction_type === "buy");

      bought_data.forEach((d) => {
        qty_bought += d.quantity;
        total_bought += d.quantity * d.current_price;
        total_bought_price += d.current_price;
      });

      const profit = price * qty_bought - total_bought;
      const avg_bought_price = total_bought_price / bought_data.length;

      setChange(profit.toFixed(2));
      setBoughtPrice(avg_bought_price.toFixed(2));
      setLoading(false);
    },
    [data]
  );

  const onClickHandler = () => {
    onCardClick(name, bought_price);
  };

  React.useEffect(() => {
    const promise1 = getCurrentCryptoPrice(pair);
    const promise2 = getDailyCryptoChange(pair);

    Promise.all([promise1, promise2]).then((values) => {
      const [current_price, daily_change] = values;
      setPrice(current_price);
      setChangePercent(daily_change[0].priceChangePercent);
      calculateBoughtPrice(current_price);
    });
  }, [calculateBoughtPrice, pair]);

  if (loading) {
    return (
      <div className="dslider-card">
        <div className="crypto-detail">Loading..</div>
      </div>
    );
  }

  return (
    <div className="dslider-card" onClick={onClickHandler}>
      <div className="crypto-detail">
        <img src={src} className="image" alt={name} />
        <div className="details">
          {pair}
          <br />
          <strong>{price} USD</strong>
        </div>
      </div>
      <div className="crypo-statistics">
        <div className="stats-row">
          <div className="item">24h %</div>
          <div className="value">{change_percent}</div>
        </div>
        <div className="stats-row">
          <div className="item">Bought Price</div>
          <div className="value">{bought_price}</div>
        </div>
        <div className="stats-row">
          <div className="item">Profit/Loss</div>
          <div className="value">{change} USD</div>
        </div>
      </div>
    </div>
  );
};

export default DSliderCard;
