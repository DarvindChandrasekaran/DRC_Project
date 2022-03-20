import Chart from "@qognicafinance/react-lightweight-charts";
import React, { useState, useEffect, useRef, memo } from "react";
import "./lightweight-chart.css";
import Logo from "../../assets/Logo/L_menulogo.svg";

const LightWeightChart = ({ symbol, interval, onLoadComplete }) => {
  // const [symbol, setSymbol] = useState("BTCUSDT");
  const [is_loading, setIsLoading] = useState(false);
  // const [width, setWidth] = useState(window.visualViewport.width - 500);
  const [is_mounted, setMounted] = useState(false);
  // const [interval, setInterval] = useState("1m");
  const [time, setTime] = useState(0);
  const [open, setOpen] = useState(0);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [close, setClose] = useState(0);

  //CHARTS
  const [chart_data, setChartData] = useState([]);
  const socket = React.useRef(null);

  useEffect(() => {
    setMounted(false);
    setChartData([]);
    //FOR REAL-TIME DATA
    socket.current = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${symbol?.toLowerCase()}@kline_${interval}`
    );

    socket.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const { t, o, h, l, c } = data.data.k;
      setTime(t / 1000);
      setOpen(o);
      setHigh(h);
      setLow(l);
      setClose(c);

      //FOR HISTORICAL DATA
      fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&limit=1000&interval=${interval}`
      )
        .then((res) => res.json())
        .then((data) => {
          let curr_data = data.map((d) => {
            return {
              time: d[0] / 1000,
              open: parseFloat(d[1]),
              high: parseFloat(d[2]),
              low: parseFloat(d[3]),
              close: parseFloat(d[4]),
            };
          });
          //Set historical data
          setChartData(curr_data);
          setMounted(true);
          onLoadComplete(true);
        });
    };
    return () => socket.current.close();
  }, [symbol, interval]);

  const options = {
    handleScroll: true,
    handleScale: true,
    alignLabels: true,
    timeScale: {
      rightOffset: 12,
      barSpacing: 3,
      fixLeftEdge: true,
      lockVisibleTimeRangeOnResize: true,
      rightBarStaysOnScroll: true,
      borderVisible: true,
      borderColor: "#404043",
      visible: true,
      timeVisible: true,
      secondsVisible: false,
    },
    priceScale: {
      borderVisible: true,
      borderColor: "#404043",
    },
    watermark: {
      color: "rgba(0, 179, 60, 0.2)",
      visible: true,
      text: "Hikers",
      fontSize: 62,
      horzAlign: "center",
      vertAlign: "center",
    },
    layout: {
      backgroundColor: "rgba(255,255,255, 0)",
      textColor: "#A3A3A3",
      fontSize: 12,
      fontFamily: "sans-serif",
    },
    grid: {
      vertLines: {
        color: "rgba(64, 64, 67, 0.4)",
        style: 1,
        visible: true,
      },
      horzLines: {
        color: "rgba(64, 64, 67, 0.4)",
        style: 1,
        visible: true,
      },
    },
  };

  return (
    <div className="chartz">
      {is_loading || !is_mounted ? (
        <div className="loaders"></div>
      ) : (
        <Chart
          options={options}
          candlestickSeries={[
            {
              options: {
                upColor: "#2EB689",
                downColor: "#D05757",
                borderVisible: false,
                wickVisible: true,
                borderColor: "#000000",
                wickColor: "#404043",
                borderUpColor: "#2EB689",
                borderDownColor: "#D05757",
                wickUpColor: "#2EB689",
                wickDownColor: "#D05757",
              },
              data: chart_data,
            },
          ]}
          autoWidth={true}
          height={450}
        />
      )}
    </div>
  );
};

export default memo(LightWeightChart);
