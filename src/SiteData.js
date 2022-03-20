import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "./components/ApiBinance/HikersAPI";
import jwt_decode from "jwt-decode";

export const SiteDataContext = createContext({});

const SiteData = ({ children }) => {
  const [user_data, setUserData] = useState();
  const [wallet_list, setWalletList] = useState([]);
  const [is_data_ready, setDataReady] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const [pair, setPair] = useState("BTCUSDT");

  useEffect(() => {
    setDataReady(false);
    const data = JSON.parse(localStorage.getItem("user_data"));
    if (data) {
      setUserData(data);
      setDataReady(true);
    }
  }, []);

  const fetchWalletList = async () => {
    try {
      if (user_data && checkJWT()) {
        const { loginid, token } = user_data;
        const result = await fetch(`${BASE_URL}/wallet/${loginid}`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ token }),
        });
        const data = await result.json();
        setWalletList(data);
      }
    } catch (e) {
      setErrorMessage("Something bad happened. Please try again.");
    }
  };

  useEffect(() => {
    setDataReady(false);
    fetchWalletList().then(() => {
      setDataReady(true);
    });
  }, [user_data]);

  const handleLogin = async (user_data) => {
    setDataReady(false);
    localStorage.removeItem("user_data");
    setUserData(null);
    setWalletList([]);
    const login_credentials = {
      ...user_data,
    };

    const req = new Request(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(login_credentials),
    });

    const res = await fetch(req);
    const data = await res.json();

    if (data.error) {
      setErrorMessage(data.error);
      return false;
    } else {
      // loginid, username, full_name, email, phone, date_joined
      setUserData(data);
      localStorage.setItem("user_data", JSON.stringify(data));
      await fetchWalletList();
      setDataReady(true);
      return true;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    setUserData(null);
    setWalletList([]);
    window.location.pathname = "/";
  };

  const checkJWT = () => {
    const stored_user_data = localStorage.getItem("user_data");
    if (!stored_user_data) {
      return false;
    }
    const { token } = JSON.parse(stored_user_data);
    const decodedToken = jwt_decode(token);
    const currentDate = new Date();

    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      localStorage.removeItem("user_data");
      setUserData(null);
      return false;
    } else {
      return true;
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        user_data,
        error_message,
        handleLogin,
        handleLogout,
        is_data_ready,
        wallet_list,
        fetchWalletList,
        pair,
        setPair,
        checkJWT,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export default SiteData;
