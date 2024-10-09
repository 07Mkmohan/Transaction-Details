import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransactionBarChart = ({ data }) => {
  const priceRanges = [
    "0 - 100",
    "101 - 200",
    "201 - 300",
    "301 - 400",
    "401 - 500",
    "501 - 600",
    "601 - 700",
    "701 - 800",
    "801 - 900",
    "901 - above",
  ];

  const chartData = {
    labels: priceRanges,
    datasets: [
      {
        label: "Number of Items",
        data: data.map((range) => range.count || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Transactions Bar Chart",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TransactionBarChart;
