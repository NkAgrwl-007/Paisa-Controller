import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/reports.css";

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filter, transactions]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterTransactions = () => {
    if (filter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter((tx) => tx.type === filter));
    }
  };

  const incomeTotal = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);
  const expenseTotal = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const barData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount ($)",
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#00ff00", "#ff0000"],
      },
    ],
  };

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#00ff00", "#ff0000"],
      },
    ],
  };

  return (
    <div className="reports">
      <h1>Financial Reports</h1>
      <p>Analyze your income and expenses.</p>

      <div className="filter-options">
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="charts">
        <div className="chart-container">
          <Bar data={barData} />
        </div>
        <div className="chart-container">
          <Pie data={pieData} />
        </div>
      </div>

      <div className="transaction-list">
        <h2>Transactions</h2>
        {filteredTransactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx._id} className={`transaction-card ${tx.type}`}>
              <span>{tx.date}</span>
              <span>{tx.category}</span>
              <span className="amount">
                {tx.type === "income" ? "+" : "-"}${tx.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
