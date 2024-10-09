import axios from "axios";

const API_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

export const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
