import React, { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import "./BuySellTabs.css";
import { SiteDataContext } from "../../SiteData";
import { BASE_URL } from "../ApiBinance/HikersAPI";
import useBinanceData from "../ApiBinance/binance-data";

const BuySellInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "#727272 !important",
  },
  "& label.Mui-focused":
    theme === "dark"
      ? {
          color: "#E5E5E5",
        }
      : { color: "#000000" },
  "& .MuiInputAdornment-root":
    theme === "dark"
      ? {
          color: "white",
        }
      : {
          color: "black",
        },
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    color: "#E5E5E5",
    "& fieldset": {
      borderColor: "#BDBDBD",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#BDBDBD",
    },
    "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
      border: "2px solid",
      borderColor: "yellow",
    },
  },
  "& .MuiOutlinedInput-root":
    theme === "dark"
      ? {
          "& .Mui-disabled": {
            borderRadius: 10,
            color: "#E5E5E5",
            "& fieldset": {
              borderColor: "#BDBDBD",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#BDBDBD",
            },
          },
        }
      : {
          borderRadius: 10,
          color: "#000000",
          "& fieldset": {
            borderColor: "#616161",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#7E7E7E",
          },
        },
  "& .Mui-disabled": {
    "-webkit-text-fill-color": "rgba(114, 114, 114, 1)!important",
    "& fieldset": {
      borderColor: "#727272 !important",
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({
  theme,
  handleTransaction,
  setTransactionType,
  pair,
}) {
  const { user_data, is_data_ready, fetchWalletList, checkJWT } =
    useContext(SiteDataContext);
  const [value, setValue] = React.useState(0);
  const [ask, , , , , , , , ,] = useBinanceData(pair);
  const [quantity, setQuantity] = useState(0);
  const [error_message, setErrorMessage] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    setQuantity(0);
    setValue(0);
  }, [pair]);

  //REQ TO BE FOR BUY TRANSACTION
  const buyCrypto = () => {
    if (checkJWT()) {
      const buy_info = {
        token: user_data.token,
        loginid: user_data.loginid,
        quantity: Number.parseFloat(quantity),
        currency: pair.substr(0, pair.length - 4),
      };
      const req = new Request(`${BASE_URL}/transaction/buy`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(buy_info),
      });
      fetch(req).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            if (data.error.name) {
              setErrorMessage("token expired, please re-login");
            }
            return setErrorMessage(data.error);
          } else {
            setErrorMessage("Transaction successful.");
            fetchWalletList();
            handleTransaction(data);
          }
        });
      });
    } else {
      navigate("/login");
    }
  };

  //REQ TO BE FOR SELL TRANSACTION
  const sellCrypto = () => {
    let is_authenticated = checkJWT();
    if (is_authenticated) {
      const sell_info = {
        token: user_data.token,
        loginid: user_data.loginid,
        quantity: Number.parseFloat(quantity),
        currency: pair.substr(0, pair.length - 4),
      };
      const req = new Request(`${BASE_URL}/transaction/sell`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(sell_info),
      });
      fetch(req).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            if (data.error.name) {
              setErrorMessage("token expired, please re-login");
            }
            return setErrorMessage(data.error);
          } else {
            setErrorMessage("Transaction successful.");
            fetchWalletList();
            handleTransaction(data);
          }
        });
      });
    } else {
      navigate("/login");
    }
  };

  //Check if user_data is ready
  if (!is_data_ready) {
    return <h1>Loading..</h1>;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTransactionType(newValue === 0 ? "buy" : "sell");
    setErrorMessage("");
  };

  return (
    <Box
      sx={{
        "& .MuiBox-root": {
          padding: "10px 0px",
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
        sx={{ borderRadius: 4, "& .MuiTab-root": { opacity: 1 } }}
        TabIndicatorProps={{ style: { background: "transparent" } }}
      >
        <Tab
          sx={[
            {
              "&.Mui-selected": {
                backgroundColor: "green",
                fontWeight: 900,
                fontSize: 22,
              },

              fontSize: 18,
              color: "#C4C4C4",
              backgroundColor: "#171717",
            },
          ]}
          label="BUY"
          {...a11yProps(0)}
        />
        <Tab
          sx={[
            {
              "&.Mui-selected": {
                backgroundColor: "red",
                fontWeight: 900,
                fontSize: 22,
              },
              fontSize: 18,
              color: "#C4C4C4",
              backgroundColor: "#171717",
            },
          ]}
          label="SELL"
          {...a11yProps(1)}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <div
          className={`txn_message ${
            error_message === "Transaction successful."
              ? "txn-green"
              : "txn-red"
          }`}
        >
          {error_message}
        </div>
        <div className="buy-input-container">
          <BuySellInput
            label="Quantity"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Typography>{pair.substr(0, pair.length - 4)}</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#727272 !important" },
            }}
            fullWidth
          />
          <div className="buy-spacing"></div>
          <BuySellInput
            disabled={true}
            label="Estimated Price"
            value={Number.parseFloat(ask).toFixed(2)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Typography>USD</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#727272 !important" },
            }}
            fullWidth
          />
          <div className="buy-spacing"></div>
          <BuySellInput
            disabled={true}
            label="Estimated Total"
            value={(
              Number.parseFloat(quantity) * Number.parseFloat(ask)
            ).toFixed(2)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Typography>USD</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#727272 !important" },
            }}
            fullWidth
          />
          <div className="buy-spacing"></div>
          <Button
            variant="contained"
            disabled={!user_data ? true : false}
            sx={{
              bgcolor: "#498e2c",
              height: "54px",
              borderRadius: "10px",
              color: "white",
              fontSize: "24px",
              fontWeight: 900,
              "&:hover": {
                backgroundColor: "#237500",
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: "#498e2c",
                boxShadow: "none",
              },
            }}
            fullWidth
            onClick={buyCrypto}
          >
            BUY
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <div
          className={`txn_message ${
            error_message === "Transaction successful."
              ? "txn-green"
              : "txn-red"
          }`}
        >
          {error_message}
        </div>
        <div className="buy-input-container">
          <BuySellInput
            label="Quantity"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Typography>{pair.substr(0, pair.length - 4)}</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#727272 !important" },
            }}
            fullWidth
          />
          <div className="buy-spacing"></div>
          <BuySellInput
            disabled={true}
            label="Estimated Price"
            value={Number.parseFloat(ask).toFixed(2)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Typography>USD</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#727272 !important" },
            }}
            fullWidth
          />
          <div className="buy-spacing"></div>
          <BuySellInput
            disabled={true}
            label="Estimated Total"
            value={(
              Number.parseFloat(quantity) * Number.parseFloat(ask)
            ).toFixed(2)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Typography>USD</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: "#727272 !important " },
            }}
            fullWidth
          />
          <div className="buy-spacing"></div>
          <Button
            variant="contained"
            disabled={!user_data ? true : false}
            sx={{
              bgcolor: "red",
              height: "54px",
              borderRadius: "10px",
              color: "white",
              fontSize: "24px",
              fontWeight: 900,
              "&:hover": {
                backgroundColor: "#921010",
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: "red",
                boxShadow: "none",
              },
            }}
            fullWidth
            onClick={sellCrypto}
          >
            SELL
          </Button>
        </div>
      </TabPanel>
    </Box>
  );
}
