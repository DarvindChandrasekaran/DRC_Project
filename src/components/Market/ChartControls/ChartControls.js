import React from "react";
import { Chart, registerables } from "chart.js";
import "./ChartControls.css";
import useBinanceData from "../../ApiBinance/binance-data";
import annotationPlugin from "chartjs-plugin-annotation";
import Btc from "./../../../assets/Icon_symbol/btc.png";
import Eth from "./../../../assets/Icon_symbol/eth.png";
import Shib from "./../../../assets/Icon_symbol/shiba.png";
import Bnb from "./../../../assets/Icon_symbol/bnb.png";
import Slp from "./../../../assets/Icon_symbol/slp.png";
import Sol from "./../../../assets/Icon_symbol/sol.png";
import Ltc from "./../../../assets/Icon_symbol/ltc.png";
import Xrp from "./../../../assets/Icon_symbol/xrp.png";
import Ada from "./../../../assets/Icon_symbol/ada.png";
import Nul from "./../../../assets/Icon_symbol/nuls.png";
import Clv from "./../../../assets/Icon_symbol/clv.png";
import Matic from "./../../../assets/Icon_symbol/matic.png";
import Doge from "./../../../assets/Icon_symbol/doge.png";
import Beta from "./../../../assets/Icon_symbol/beta.png";
import Anc from "./../../../assets/Icon_symbol/anc.png";
import Luna from "./../../../assets/Icon_symbol/luna.png";
import Knc from "./../../../assets/Icon_symbol/knc.png";
import Jst from "./../../../assets/Icon_symbol/jst.png";
import Bnx from "./../../../assets/Icon_symbol/bnx.png";
import Xvs from "./../../../assets/Icon_symbol/xvs.png";
import Row from "./Row";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

Chart.register(...registerables, annotationPlugin);

const crypto_list = [
  { src: Btc, id: "BTCUSDT", name: "BTC/USDT", fullname: "Bitcoin" },
  { src: Eth, id: "ETHUSDT", name: "ETH/USDT", fullname: "Ethereum" },
  { src: Shib, id: "SHIBUSDT", name: "SHIB/USDT", fullname: "Shiba-Inu" },
  { src: Bnb, id: "BNBUSDT", name: "BNB/USDT", fullname: "BinanceCoin" },
  { src: Slp, id: "SLPUSDT", name: "SLP/USDT", fullname: "Smooth-Love-Potion" },
  { src: Sol, id: "SOLUSDT", name: "SOL/USDT", fullname: "Solana" },
  { src: Ltc, id: "LTCUSDT", name: "LTC/USDT", fullname: "Litecoin" },
  { src: Xrp, id: "XRPUSDT", name: "XRP/USDT", fullname: "Ripple" },
  { src: Ada, id: "ADAUSDT", name: "ADA/USDT", fullname: "Cardano" },
  { src: Nul, id: "NULSUSDT", name: "NULS/USDT", fullname: "Nuls" },
  { src: Clv, id: "CLVUSDT", name: "CLV/USDT", fullname: "Clover" },
  {
    src: Matic,
    id: "MATICUSDT",
    name: "MATIC/USDT",
    fullname: "Matic-Network",
  },
  { src: Doge, id: "DOGEUSDT", name: "DOGE/USDT", fullname: "Dogecoin" },
  { src: Beta, id: "BETAUSDT", name: "BETA/USDT", fullname: "Beta-Finance" },
  { src: Anc, id: "ANCUSDT", name: "ANC/USDT", fullname: "Anchor-Protocol" },
  { src: Luna, id: "LUNAUSDT", name: "LUNA/USDT", fullname: "Terra-Luna" },
  {
    src: Knc,
    id: "KNCUSDT",
    name: "KNC/USDT",
    fullname: "Kyber-Network-Crystal",
  },
  { src: Jst, id: "JSTUSDT", name: "JST/USDT", fullname: "Just" },
  { src: Bnx, id: "BNXUSDT", name: "BNX/USDT", fullname: "BinaryX" },
  { src: Xvs, id: "XVSUSDT", name: "XVS/USDT", fullname: "Venus" },
];

const ChartControls = ({ interval, setInterval, pair, setPair }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [, , , , , close, , , percent] = useBinanceData(pair);

  const getName = (id) => crypto_list.find((c) => c.id === id).name;
  const getSrc = (id) => crypto_list.find((c) => c.id === id).src;

  return (
    <React.Fragment>
      <div className="container">
        <div
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          Cryptocurrency
          <img alt="dropdown button" className="dropdown-icon" />
        </div>
        <table>
          <tbody className={showDropdown ? "dropdown-box" : ""}>
            <tr
              className={showDropdown ? "dropdown-coin-header" : "hide-header"}
            >
              <td>
                <p>Symbol</p>
              </td>
              <td id="dropdown-coin-header-name">
                <p>Name</p>
              </td>
              <td>
                <p>Price</p>
              </td>
              <td>
                <p>24hr %</p>
              </td>
            </tr>
            {crypto_list.map((c) => {
              if (showDropdown) {
                return (
                  <div
                    onClick={(e) => {
                      setPair(c.id);
                      setShowDropdown(!showDropdown);
                    }}
                    key={c.id}
                    className="pair-list"
                  >
                    <Row key={c.id} src={c.src} pair={c.id} name={c.name} />
                  </div>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
      <div className="mchart-title-and-filter">
        <div className="market-chart-title">
          <span>
            <img src={getSrc(pair)} className="crypto_logo" alt="crypto" />
          </span>
          <span id="mchart-title-name">{getName(pair)}</span>
          <span id="mchart-title-price">
            {close === 0 ? <p>Loading...</p> : Number.parseFloat(close)}
          </span>
          <span
            className={`coin-precentage ${
              Number.parseFloat(percent) > 0 ? "arrow up" : "arrow down"
            }`}
          ></span>
          <span
            className={`coin-precentage ${
              Number.parseFloat(percent) > 0
                ? "green coin-pads"
                : "red coin-pads"
            }`}
          >
            {Number.parseFloat(percent).toFixed(2)}
          </span>
        </div>
        <div className="interval-filter">
          <ToggleButtonGroup
            value={interval}
            exclusive
            onChange={(e) => setInterval(e.target.value)}
            aria-label="interval filter"
            sx={{
              "& .MuiToggleButton-root": {
                backgroundColor: "#595959",
                height: "25px",
                color: "white",
                fontSize: "0.875rem",
              },
              "& .MuiToggleButton-root:hover": {
                backgroundColor: "rgb(56, 55, 55)",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                color: "white",
                backgroundColor: "rgb(56, 55, 55)",
              },
            }}
          >
            <ToggleButton value="1m" aria-label="minutes">
              Min
            </ToggleButton>
            <ToggleButton value="1h" aria-label="hours">
              Hr
            </ToggleButton>
            <ToggleButton value="1d" aria-label="days">
              Day
            </ToggleButton>
            <ToggleButton value="1w" aria-label="weeks">
              Week
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChartControls;
