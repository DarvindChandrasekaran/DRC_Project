import Btc from "./../../assets/Icon_symbol/btc.png";
import Eth from "./../../assets/Icon_symbol/eth.png";
import Shib from "./../../assets/Icon_symbol/shiba.png";
import Bnb from "./../../assets/Icon_symbol/bnb.png";
import Slp from "./../../assets/Icon_symbol/slp.png";
import Sol from "./../../assets/Icon_symbol/sol.png";
import Ltc from "./../../assets/Icon_symbol/ltc.png";
import Xrp from "./../../assets/Icon_symbol/xrp.png";
import Ada from "./../../assets/Icon_symbol/ada.png";
import Nul from "./../../assets/Icon_symbol/nuls.png";
import Clv from "./../../assets/Icon_symbol/clv.png";
import Matic from "./../../assets/Icon_symbol/matic.png";
import Doge from "./../../assets/Icon_symbol/doge.png";
import Beta from "./../../assets/Icon_symbol/beta.png";
import Anc from "./../../assets/Icon_symbol/anc.png";
import Luna from "./../../assets/Icon_symbol/luna.png";
import Knc from "./../../assets/Icon_symbol/knc.png";
import Jst from "./../../assets/Icon_symbol/jst.png";
import Bnx from "./../../assets/Icon_symbol/bnx.png";
import Xvs from "./../../assets/Icon_symbol/xvs.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import CardContent from "@mui/material/CardContent";
import "./Market.css";
import { styled } from "@mui/material/styles";
import GainLossCards from "./MGainLossCard";
import axios from "axios";
import Loader from "./Loader";

//Market List ----------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------

//API Call -------------------------------------------------------------------------------

export default function MLosslider({ theme, setTheme }) {
  const [intervalCount, setIntervalCount] = useState(0);
  const [cryptoCurrencies, setCryptoCurrencies] = useState([
    { fullname: "", id: "", name: "", percentage: "", price: "", src: "" },
  ]);
  const [topCryptoCurrencies, setTopCryptoCurrencies] = useState([
    { fullname: "", id: "", name: "", percentage: "", price: "", src: "" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  let cryptoData = [];
  var tempCrypArr = [];
  var top5Arr = [];
  let filteredCrypto = [];

  useEffect(() => {
    const timerCount = setInterval(() => {
      setIntervalCount(intervalCount + 1);
    }, 5000);
    if (intervalCount > 0) {
      clearInterval(timerCount);
    }

    crypto_list.forEach((element, index) => {
      let cryptoObj = {};
      //Push data from crypto_list into object
      cryptoObj["src"] = element.src;
      cryptoObj["name"] = element.name;
      cryptoObj["fullname"] = element.fullname;
      axios
        .get(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=["${element.id.toUpperCase()}"]`
        )
        .then((res) => {
          const data = res.data;
          //Push data from API into object
          cryptoObj["price"] = data[0].askPrice;
          cryptoObj["id"] = data[0].symbol;
          cryptoObj["percentage"] = data[0].priceChangePercent;
          //Push object into array
          cryptoData.push(cryptoObj);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    setCryptoCurrencies(cryptoData);

    // Calculation ------------------------------------------------------------------------
    //Push the percentage
    for (var i in cryptoCurrencies) {
      tempCrypArr.push(cryptoCurrencies[i].percentage);
    }
    //Sort in ascending
    tempCrypArr.sort(function (a, b) {
      return a - b;
    });

    //Select the top 5
    top5Arr = tempCrypArr.slice(0, 5);

    for (var i in top5Arr) {
      for (var j in cryptoCurrencies) {
        //Compare percentage of top 5 and with 20
        if (top5Arr[i] === cryptoCurrencies[j].percentage) {
          //Push all data from each top 5 object
          filteredCrypto.push(cryptoCurrencies[j]);
        } else {
          console.log("");
        }
      }
    }
    setTopCryptoCurrencies(filteredCrypto);
  }, [intervalCount]);

  //Loader Setting
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  //-------------------------------------------------------------------------------------
  //Slider Implementation ---------------------------------------------------------------

  const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    &:last-child {
      padding-bottom: 0;
    }
  `);

  var settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 5000,
    slidesToShow: 4,
    slidesToScroll: -1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  //-----------------------------------------------------------------------------------
  //Slider Display --------------------------------------------------------------------
  return (
    <>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <Slider {...settings}>
          {topCryptoCurrencies.map((c, index) => {
            return (
              <div className="m-card-content">
                <div className="card">
                  <GainLossCards
                    key={index}
                    src={c.src}
                    name={c.name}
                    price={c.price}
                    percentage={c.percentage}
                    fullname={c.fullname}
                  />
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </>
  );
}
//-----------------------------------------------------------------------------------
