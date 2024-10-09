import React, { useState, useEffect } from "react";
import TransactionBarChart from "./TransactionBarChart";
import TransactionsStatistics from "./TransactionsStatistics";
import TransactionsTable from "./TransactionsTable";
// import { getStatistics, getBarChart } from "../api"; // Ensure you import getBarChart
import "./TransactionTable.css";

const HomePage = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedMonth, setSelectedMonth] = useState(3);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    fetchStatistics();
    fetchBarChart();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    const response = await getStatistics(selectedMonth);
    setStatistics(response.data);
  };

  const fetchBarChart = async () => {
    const response = await getBarChart(selectedMonth);
    setBarChartData(response.data);
  };

  return (
    <div className="main">
      <h1>Transaction Dashboard</h1>
      <div className="main-containt">
        <div className="innercontaienr">
          <TransactionsTable month={selectedMonth} />
          <select
            className="month"
            value={selectedMonth}
            defaultValue={3}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month, i) => (
              <option key={i} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
          <TransactionsStatistics month={selectedMonth} />
          <TransactionBarChart data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
