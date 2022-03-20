import React, { useState } from "react";

const useBinanceData = (symbol) => {
  const [ask, setAsk] = React.useState(0);
  const [bid, setBid] = React.useState(0);
  const [open, setOpen] = React.useState(0);
  const [low, setLow] = React.useState(0);
  const [high, setHigh] = React.useState(0);
  const [close, setClose] = React.useState(0);
  const [volume, setVolume] = React.useState(0);
  const [time, setTime] = React.useState();
  const [percent, setPercent] = React.useState(0);
  const socket = React.useRef(null);
  const [lineChart] = useState([]);

  React.useEffect(() => {
    socket.current = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${symbol.toLowerCase()}@ticker`
    );
    socket.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const { a, b, o, l, h, c, v, E, P } = data.data;
      let obj = {
        time: E,
        close: c,
      };
      lineChart.push(obj);
      setAsk(a);
      setBid(b);
      setOpen(o);
      setLow(l);
      setHigh(h);
      setClose(c);
      setVolume(v);
      setTime(E);
      setPercent(P);
    };

    return () => socket.current.close();
  }, [symbol]);

  return [ask, bid, open, low, high, close, volume, time, percent, lineChart];
};

export default useBinanceData;
