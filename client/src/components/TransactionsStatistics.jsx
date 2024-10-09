import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionsStatistics = ({ month }) => {
  const [data, setData] = useState(null);
  const fetchTransactionsMonth = async () => {
    await axios
      .get(`http://localhost:5000/api/transactions/statistics?month=${month}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  };

  useEffect(() => {
    fetchTransactionsMonth();
  }, [month]);

  return (
    <div className="statistics">
      <h2>Transaction Statistics</h2>
      <p>Total Sale Amount: ${data?.totalAmount || 0}</p>
      <p>Total Sold Items: {data?.soldItems || 0}</p>
      <p>Total Not Sold Items: {data?.notSoldItems || 0}</p>
    </div>
  );
};

export default TransactionsStatistics;
