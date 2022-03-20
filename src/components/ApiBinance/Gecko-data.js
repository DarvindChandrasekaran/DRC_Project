import Axios from "axios";
import React from "react";

const useGeckoData = (symbol) => {
  const [time, setTime] = React.useState([]);
  const [price, setPrice] = React.useState([]);
  const [is_ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(false);
    Axios.get(
      `https://api.coingecko.com/api/v3/coins/${symbol
        .toString()
        .toLowerCase()}/market_chart?vs_currency=usd&days=365`
    ).then((res) => {
      const new_time = res.data.prices.map((d) => {
        return new Date(d[0]).toDateString();
      });

      const new_price = res.data.prices.map((d) => {
        return d[1];
      });

      setTime(new_time);
      setPrice(new_price);
      setReady(true);
    });
  }, [symbol]);

  return [time, price, is_ready];
};
export default useGeckoData;
