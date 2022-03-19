import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { Avatar } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Slider from "./DSlider";
import Dashbar from "../Menubar/HeaderBar";
import Linechart from "./Linechart";
import TransTable from "./TransacHist";
import { SiteDataContext } from "../../SiteData";
import WalletReloadModal from "../Modal/WalletReloadModal";
import {
  EventBusyOutlined,
  PhotoSizeSelectLargeRounded,
} from "@mui/icons-material";

Chart.register(...registerables);

function Dashboard(props) {
  //light mode and dark mode
  const [theme, setTheme] = React.useState("dark");

  const [chartTitle, setChartTitle] = React.useState("Total Profit/Loss");
  const [getLabel, setLabel] = React.useState(["Loss", "Profit"]);
  const [dataSets, setDataSets] = React.useState([0, 0]);
  const { user_data, is_data_ready, wallet_list } = useContext(SiteDataContext);
  const [doughnutType, setDoughnutType] = useState("");
  const [display, setDisplay] = useState("none");
  const [asset_database, setAssetDatabase] = useState([]);

  const WalletPopupHandler = () => {
    setDisplay("unset");
  };

  const handleChange = (e) => {
    setDoughnutType(e.target.value);
  };

  let curr_date = new Date();

  React.useEffect(() => {
    const base_url = "https://api.tradehikers.xyz";
    const { loginid, token } = user_data;
    const req = new Request(`${base_url}/transaction/${loginid}`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ token }),
    });
    fetch(req).then((res) => {
      res.json().then((data) => {
        setAssetDatabase(data);
      });
    });
  }, []);

  let profitArr = [];
  let lossArr = [];

  let buyArr = [];
  let sellArr = [];

  asset_database.forEach((element) => {
    if (element.transaction_type === "sell") {
      sellArr.push(element);
    } else {
      buyArr.push(element);
    }
  });

  let sellTotalPrice = [];
  sellArr.reduce(function (a, value) {
    if (!a[value.currency]) {
      a[value.currency] = {
        currency: value.currency,
        total_price: 0,
        count: 0,
        quantity: 0,
      };
      sellTotalPrice.push(a[value.currency]);
    }
    a[value.currency].total_price += value.current_price * value.quantity;
    a[value.currency].count += 1;
    a[value.currency].quantity += value.quantity;
    return a;
  }, {});

  let buyTotalPrice = [];
  buyArr.reduce(function (res, value) {
    if (!res[value.currency]) {
      res[value.currency] = {
        currency: value.currency,
        total_price: 0,
        count: 0,
        quantity: 0,
      };
      buyTotalPrice.push(res[value.currency]);
    }
    res[value.currency].total_price += value.current_price * value.quantity;
    res[value.currency].count += 1;
    res[value.currency].quantity += value.quantity;
    return res;
  }, {});

  let buyTotalPriceAvg = [];
  buyArr.reduce(function (res, value) {
    if (!res[value.currency]) {
      res[value.currency] = {
        currency: value.currency,
        total_price: 0,
        count: 0,
        quantity: 0,
      };
      buyTotalPriceAvg.push(res[value.currency]);
    }
    res[value.currency].total_price += value.current_price;
    res[value.currency].count += 1;
    res[value.currency].quantity += value.quantity;
    return res;
  }, {});

  let currentAsset = () => {
    let buysell = buyTotalPrice.concat(sellTotalPrice);
    let result = {};
    buysell.map((item) => {
      result[item.currency] = {
        currency: item.currency,
        total_price: result[item.currency]
          ? result[item.currency].total_price - item.total_price
          : item.total_price,
        quantity: result[item.currency]
          ? result[item.currency].quantity - item.quantity
          : item.quantity,
      };
    });
    result = Object.values(result);

    return result;
  };

  let databaseAvgPrice = [];
  buyTotalPriceAvg.forEach((element) => {
    let tempObj = {};
    tempObj["currency"] = element.currency;
    let calc = element.total_price / element.count;
    tempObj["avg_price"] = calc;
    databaseAvgPrice.push(tempObj);
  });

  let sellArrWithAvg = () => {
    sellArr.map((item) => {
      databaseAvgPrice.map((subItem) => {
        if (item.currency === subItem.currency) {
          item.average_price = subItem.avg_price;
        }
      });
    });

    return sellArr;
  };

  let currentAssetWithAvg = () => {
    let result = currentAsset();
    result = result.map((item) => {
      let newItem;
      databaseAvgPrice.map((subItem) => {
        if (item.currency === subItem.currency) {
          item.average_price = subItem.avg_price;
          newItem = item;
        }
      });

      return newItem;
    });

    return result;
  };

  let profitnLoss = (price, avg) => {
    let calculation1 = ((price - avg) / avg) * 100;
    if (calculation1 > 0) {
      profitArr.push(calculation1);
    } else {
      lossArr.push(Math.abs(calculation1));
    }
  };

  sellArrWithAvg().forEach((element) => {
    profitnLoss(element.current_price, element.average_price);
  });

  const sumProfit = profitArr.reduce(
    (totalProfit, number) => totalProfit + number,
    0
  );
  const sumLoss = lossArr.reduce((totalLoss, number) => totalLoss + number, 0);
  const profitPercent = (sumProfit / (sumLoss + sumProfit)) * 100;
  const lossPercent = (sumLoss / (sumLoss + sumProfit)) * 100;

  const sumCoinValue = currentAsset()
    .filter((c) => c.currency !== "USD")
    .map((b) => b.total_price)
    .reduce((a, number) => a + number, 0);

  let positioning = () => {
    if (window.innerWidth < 768) {
      return "right";
    } else {
      return "bottom";
    }
  };

  if (!is_data_ready) {
    return <h1>Loading..</h1>;
  }

  return (
    <div className="DashBG">
      <WalletReloadModal display={display} setDisplay={setDisplay} />
      <div className="Layout">
        <div className="dash-top">
          <Dashbar titleName={"Dashboard"} theme={theme} setTheme={setTheme} />
        </div>
        <div className="BoughtAssets" style={{ height: 175 }}>
          <div className="b-title">
            <span>Bought Assets</span>
          </div>
          <div className="wrap">
            <Slider backendData={currentAssetWithAvg()} />
          </div>
        </div>
        <div className="Profile">
          <div className="profile-details-box">
            <div className="profile-details">
              <h3 id="prof-head">User Profile</h3>
              <p>@{user_data.username}</p>
              <p>{user_data.full_name}</p>
              <p>Date joined: {user_data.date_joined}</p>
              <p className="p3">
                Asset's Balance as on {curr_date.toDateString()}
              </p>
              <p id="prof-bal">
                USD &nbsp; {sumCoinValue.toLocaleString("en-US") || "0"}
              </p>
            </div>
          </div>
          <div className="profile-avatar">
            <Avatar
              alt="user's pic"
              src={props.dashDP}
              sx={[
                {
                  "@media (max-width: 1720px)": {
                    width: 55,
                    height: 55,
                  },
                  "@media (max-width: 1070px)": {
                    width: 50,
                    height: 50,
                  },
                  "@media (max-width: 1024px)": {
                    width: 50,
                    height: 50,
                  },
                  width: 65,
                  height: 65,
                },
              ]}
            />
          </div>
        </div>
        <div className="LiveCharts-header">Current Trend (Since buy Price)</div>
        <div className="LiveCharts">
          <Linechart />
        </div>
        <div className="Wallet">
          <div className="w-value">
            <p>Wallet's Balance</p>
            <h1 id="wal-bal">
              USD
              {wallet_list
                .find((w) => w.currency === "USD")
                ?.balance.toLocaleString("en-US") || "0"}
            </h1>
          </div>
          <img
            className="w-icon"
            onClick={WalletPopupHandler}
            alt="reload wallet"
          />
        </div>
        <div className="Chart">
          <div className="c-top">
            <div className="c-top-title c-col">
              <p id="c-title">{chartTitle}</p>
              <p id="c-subtitle">as on {curr_date.toDateString()}</p>
            </div>
            <div className="c-top-dropdown c-col">
              <FormControl
                sx={
                  theme === "dark"
                    ? {
                        m: 1,
                        backgroundColor: "#193460",
                        height: 30,
                        borderRadius: 2,
                        "@media (min-width: 1024px) and (max-width: 1175px)": {
                          width: 110,
                        },
                        "@media (min-width: 769px) and (max-width: 1024px)": {
                          width: 110,
                        },
                        "@media (min-width: 10px) and (max-width: 375px)": {
                          width: 100,
                        },
                      }
                    : {
                        m: 1,
                        backgroundColor: "#609D45",
                        height: 30,
                        borderRadius: 2,
                        "@media (min-width: 1024px) and (max-width: 1175px)": {
                          width: 110,
                        },
                        "@media (min-width: 769px) and (max-width: 1024px)": {
                          width: 110,
                        },
                        "@media (min-width: 10px) and (max-width: 375px)": {
                          width: 100,
                        },
                      }
                }
              >
                <Select
                  sx={{
                    height: 30,
                    color: "white",
                    fontSize: 12,
                    borderRadius: 2,
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                  }}
                  value={doughnutType}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{
                    "aria-label": "Without label",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setLabel(["Loss", "Profit"]);
                      setDataSets([lossPercent, profitPercent]);
                      setChartTitle("Total Profit/Loss");

                      console.log("buy", buyArr);
                      console.log("sell", sellArr);
                      console.log("profit", profitArr);
                      console.log("loss", lossArr);
                      console.log(sumProfit);
                      console.log("sum loss", sumLoss);
                      // console.log("dataBuy", databaseBuy);
                      console.log("buyTotal", buyTotalPrice);
                      console.log("sellTotal", sellTotalPrice);
                      console.log("avg", databaseAvgPrice);
                      console.log("add avg ", sellArrWithAvg());
                      console.log("profitnloss", profitnLoss());
                      console.log("live data", asset_database);
                      console.log("currentAsset", currentAsset());
                      console.log("currentAseet AVG", currentAssetWithAvg());
                      console.log(
                        "coin value",
                        currentAsset()
                          .filter((c) => c.currency !== "USD")
                          .map((b) => b.total_price)
                      );
                      console.log("coin sum", sumCoinValue);
                      // handleClickTrial();
                      // console.log("hi, ", processedInput);
                    }}
                    sx={{
                      height: 30,
                      fontSize: 12,
                    }}
                    value=""
                  >
                    Total Profit/Loss
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setLabel(
                        currentAsset()
                          .filter((c) => c.currency !== "USD")
                          .map((a) => a.currency)
                      );
                      setDataSets(
                        currentAsset()
                          .filter((c) => c.currency !== "USD")
                          .map((b) => b.total_price)
                      );
                      setChartTitle("Total Assets");
                    }}
                    sx={{ fontSize: 12 }}
                    value={10}
                  >
                    Total Assets
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="c-mid">
            <div
              id={`${
                chartTitle === "Total Profit/Loss" ? "donut" : "donut-alt"
              }`}
            >
              <Doughnut
                options={{
                  plugins: {
                    legend: {
                      position: positioning(),
                      display:
                        chartTitle === "Total Profit/Loss" ? false : true,
                      labels: {
                        generateLabels: (chart) => {
                          const datasets = chart.data.datasets;
                          return datasets[0].data.map((data, i) => ({
                            text: `${chart.data.labels[i]} ${currentAsset()
                              .filter(
                                (c) => c.currency === chart.data.labels[i]
                              )
                              .map((b) => b.quantity.toFixed(2))}`,
                            fillStyle: datasets[0].backgroundColor[i],
                          }));
                        },
                        boxWidth: 15,
                        font: {
                          size: 12,
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      bodyColor: "black",
                      callbacks: {
                        label: function (context) {
                          var label = context.label,
                            currentValue = context.raw,
                            total =
                              context.chart._metasets[context.datasetIndex]
                                .total;

                          var percentage = parseFloat(
                            ((currentValue / total) * 100).toFixed(1)
                          );

                          return label + ":" + " (" + percentage + "%)";
                        },
                      },
                    },
                  },
                }}
                data={{
                  labels: getLabel,
                  datasets: [
                    {
                      data: dataSets,
                      backgroundColor: [
                        "#C14462",
                        "#439090",
                        "#00BFFF",
                        "#F0E68C",
                        "#DDA0DD",
                        "#FFFFFF",
                        "#9ACD32",
                        "#E9967A",
                        "#808000",
                        "#7F0000",
                      ],
                      borderColor: [
                        "#FF003D",
                        "#00FFFF",
                        "#98C4EC",
                        "#FFD700",
                        "#FF00FF",
                        "#DCDCDC",
                        "#00FF00",
                        "#FA8072",
                        "#B5B35D",
                        "#800000",
                      ],
                    },
                  ],
                }}
              />
            </div>
            <div className="c-bot">
              <p id="c-footer">
                {chartTitle === "Total Profit/Loss"
                  ? `Total Profit:
                  ${
                    sumProfit ? Number.parseFloat(sumProfit).toFixed(2) : "0.00"
                  } USD`
                  : ""}
              </p>
              <p id="c-footer">
                {chartTitle === "Total Profit/Loss"
                  ? `Total Loss:
                  ${
                    sumLoss ? Number.parseFloat(sumLoss).toFixed(2) : "0.00"
                  } USD`
                  : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="Table-header">Transaction History </div>
        <div className="Table">
          <TransTable
            theme={theme}
            setTheme={setTheme}
            transData={asset_database}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
