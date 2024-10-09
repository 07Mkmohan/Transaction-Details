import React, { useEffect, useState } from "react";
// import { getTransactions } from "../api";
import "./TransactionTable.css";
import axios from "axios";

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTransactionsMonth();
  }, [page, search]);

  const fetchTransactionsMonth = async () => {
    await axios
      .get(
        `http://localhost:5000/api/transactions?page=${page}&search=${search}`
      )
      .then((res) => {
        console.log(res.data.transactions);
        setTransactions(res.data.transactions);
        setTotal(res.data.total);
      });
  };

  const fetchTransactions = async () => {
    await axios
      .get(`http://localhost:5000/api/transactions?page=${page}`)
      .then((res) => {
        console.log(res.data.transactions);
        setTransactions(res.data.transactions);
        setTotal(res.data.total);
      });
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="main-container">
      <div className="inner-container">
        <input
          className="search"
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search transaction"
        />
        <button className="btn" onClick={handleSearch}>
          Search
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="page">
          <button
            className="pagebtn"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <p className="pageno">
            Page : {page} of {Math.ceil(total / perPage)}
          </p>
          <button
            className="pagebtn"
            onClick={() => setPage(page + 1)}
            disabled={transactions.length < perPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
