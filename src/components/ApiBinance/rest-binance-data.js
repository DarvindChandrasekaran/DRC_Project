import axios from "axios";

const API_ENDPOINT = "https://api.binance.com/api/v3";

export const getCurrentCryptoPrice = async (target) => {
  const response = await axios.get(
    `${API_ENDPOINT}/ticker/price?symbol=${target.toUpperCase()}`
  );

  const { price } = response.data;
  return Number.parseFloat(price);
};

export const getDailyCryptoChange = async (target) => {
  const response = await axios.get(
    `${API_ENDPOINT}/ticker/24hr?symbols=["${target.toUpperCase()}"]`
  );

  return response.data;
};
