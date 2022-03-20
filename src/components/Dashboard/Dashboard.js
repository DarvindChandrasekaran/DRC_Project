import React from "react";
import "./Dashboard.css";
import { BASE_URL } from "../ApiBinance/HikersAPI";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DSlider from "./DSlider";
import Dashbar from "../Menubar/HeaderBar";
import Linechart from "./Linechart";
import TransTable from "./TransacHist";
import { SiteDataContext } from "../../SiteData";
import WalletReloadModal from "../Modal/WalletReloadModal";
import Logo from "../../assets/Icon_symbol/btc.png";
import { crypto_list } from "../Icons/icons";

Chart.register(...registerables);

function Dashboard(props) {
  const { user_data, is_data_ready, wallet_list } =
    React.useContext(SiteDataContext);

  const [is_complete, setComplete] = React.useState(false);
  const [theme, setTheme] = React.useState("dark");
  const [chartTitle, setChartTitle] = React.useState("");
  const [getLabel, setLabel] = React.useState(["Loss", "Profit"]);
  const [dataSets, setDataSets] = React.useState([0, 0]);
  const [doughnutType, setDoughnutType] = React.useState("");
  const [display, setDisplay] = React.useState("none");
  const [asset_database, setAssetDatabase] = React.useState([]);
  const [selected_crypto, setSelectedCrypto] = React.useState(
    crypto_list[0].fullname
  );
  const [bought_price, setBoughtPrice] = React.useState(0);
  // Calculations
  const [buy_list, setBuyList] = React.useState([]);
  const [sell_list, setSellList] = React.useState([]);
  const [sum_coin, setSumCoin] = React.useState(0);
  const [loss, setLoss] = React.useState(0);
  const [profit, setProfit] = React.useState(0);
  const [current_asset, setCurrentAsset] = React.useState([]);
  const [sum_profit, setSumProfit] = React.useState(0);
  const [sum_loss, setSumLoss] = React.useState(0);

  const WalletPopupHandler = () => {
    setDisplay("unset");
  };

  const handleChange = (e) => {
    setDoughnutType(e.target.value);
  };

  const handleCardClick = (name, bought_price) => {
    setSelectedCrypto(name);
    setBoughtPrice(bought_price);
  };

  let curr_date = new Date();

  React.useEffect(() => {
    setComplete(false);
    const { loginid, token } = user_data;
    const req = new Request(`${BASE_URL}/transaction/${loginid}`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ token }),
    });
    fetch(req).then((res) => {
      res.json().then((data) => {
        setAssetDatabase(data);
        const buy_arr = data.filter((d) => d.transaction_type === "buy");
        const sell_arr = data.filter((d) => d.transaction_type === "sell");

        setBuyList(buy_arr);
        setSellList(sell_arr);

        let sell_total_price = [];
        sell_arr.reduce(function (a, value) {
          if (!a[value.currency]) {
            a[value.currency] = {
              currency: value.currency,
              total_price: 0,
              count: 0,
              quantity: 0,
            };
            sell_total_price.push(a[value.currency]);
          }
          a[value.currency].total_price += value.current_price * value.quantity;
          a[value.currency].count += 1;
          a[value.currency].quantity += value.quantity;
          return a;
        }, {});

        let buy_total_price = [];
        buy_arr.reduce(function (res, value) {
          if (!res[value.currency]) {
            res[value.currency] = {
              currency: value.currency,
              total_price: 0,
              count: 0,
              quantity: 0,
            };
            buy_total_price.push(res[value.currency]);
          }
          res[value.currency].total_price +=
            value.current_price * value.quantity;
          res[value.currency].count += 1;
          res[value.currency].quantity += value.quantity;
          return res;
        }, {});

        let buy_total_price_avg = [];
        buy_arr.reduce(function (res, value) {
          if (!res[value.currency]) {
            res[value.currency] = {
              currency: value.currency,
              total_price: 0,
              count: 0,
              quantity: 0,
            };
            buy_total_price_avg.push(res[value.currency]);
          }
          res[value.currency].total_price += value.current_price;
          res[value.currency].count += 1;
          res[value.currency].quantity += value.quantity;
          return res;
        }, {});

        let database_avg_price = [];
        buy_total_price_avg.forEach((element) => {
          let tempObj = {};
          tempObj["currency"] = element.currency;
          let calc = element.total_price / element.count;
          tempObj["avg_price"] = calc;
          database_avg_price.push(tempObj);
        });

        const sellArrWithAvg = () => {
          sell_arr.map((item) => {
            database_avg_price.map((subItem) => {
              if (item.currency === subItem.currency) {
                item.average_price = subItem.avg_price;
              }
            });
          });

          return sell_arr;
        };

        const currentAsset = () => {
          let buysell = buy_total_price.concat(sell_total_price);
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

        setCurrentAsset(currentAsset());

        const profit_arr = [];
        const lost_arr = [];

        const profitnLoss = (price, avg) => {
          let calculation1 = ((price - avg) / avg) * 100;
          if (calculation1 > 0) {
            profit_arr.push(calculation1);
          } else {
            lost_arr.push(Math.abs(calculation1));
          }
        };

        sellArrWithAvg().forEach((element) => {
          profitnLoss(element.current_price, element.average_price);
        });

        const sumProfit = profit_arr.reduce(
          (totalProfit, number) => totalProfit + number,
          0
        );
        const sumLoss = lost_arr.reduce(
          (totalLoss, number) => totalLoss + number,
          0
        );

        setSumProfit(sumProfit);
        setSumLoss(sumLoss);

        const profit_percent = (sumProfit / (sumLoss + sumProfit)) * 100;
        const loss_percent = (sumLoss / (sumLoss + sumProfit)) * 100;

        setProfit(profit_percent);
        setLoss(loss_percent);

        const sum_coin_value = currentAsset()
          .filter((c) => c.currency !== "USD")
          .map((b) => b.total_price)
          .reduce((a, number) => a + number, 0);

        setSumCoin(sum_coin_value);
        setComplete(true);
        setChartTitle("Total Profit/Loss");
      });
    });
  }, [user_data]);

  const positioning = () => {
    if (window.innerWidth < 768) {
      return "right";
    } else {
      return "bottom";
    }
  };

  if (!is_data_ready || !is_complete) {
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
          <DSlider
            transaction_data={asset_database}
            selectCrypto={handleCardClick}
          />
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
                USD &nbsp; {sum_coin.toLocaleString("en-US") || "0"}
              </p>
            </div>
          </div>
          <div className="profile-avatar">
            <img alt="user's pic" src={props.dashDP} className="profile_pic" />
          </div>
        </div>
        <div className="LiveCharts-header">Current Trend (Since buy Price)</div>
        <div className="LiveCharts">
          <div className="icon-wrapper">
            <img
              src={
                crypto_list.find((cl) => cl.fullname === selected_crypto).src
              }
              alt="hello test"
              style={{ width: "30px" }}
            />
            <h2>{selected_crypto}</h2>
          </div>
          <Linechart crypto={selected_crypto} bought_price={bought_price} />
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
                      setDataSets([loss, profit]);
                      setChartTitle("Total Profit/Loss");
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
                        current_asset
                          .filter((c) => c.currency !== "USD")
                          .map((a) => a.currency)
                      );
                      setDataSets(
                        current_asset
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
                            text: `${chart.data.labels[i]} ${current_asset
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
                    sum_profit
                      ? Number.parseFloat(sum_profit).toFixed(2)
                      : "0.00"
                  } USD`
                  : ""}
              </p>
              <p id="c-footer">
                {chartTitle === "Total Profit/Loss"
                  ? `Total Loss:
                  ${
                    sum_loss ? Number.parseFloat(sum_loss).toFixed(2) : "0.00"
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
