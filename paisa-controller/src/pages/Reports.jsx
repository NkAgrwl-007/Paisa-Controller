import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/reports.css";

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const incomeTotal = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const expenseTotal = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const savings = incomeTotal - expenseTotal;

  // Top categories
  const categoryTotals = transactions.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = 0;
    acc[tx.category] += Number(tx.amount);
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  const barData = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [
      {
        label: "Amount ($)",
        data: [incomeTotal, expenseTotal, savings],
        backgroundColor: ["#00C49F", "#FF4444", savings >= 0 ? "#00ff88" : "#ff5555"],
        borderRadius: 12,
      },
    ],
  };

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#00C49F", "#FF4444"],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading)
    return <p className="loading">🚀 Loading AI-powered financial insights...</p>;

  return (
    <div className="reports dashboard">
      <h1 className="reports-title">📊 Financial Dashboard</h1>
      <p className="reports-subtitle">Your AI-assisted money flow analysis</p>

      {/* Filter */}
      <div className="filter-options">
        <label>Filter Transactions:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="glass-card chart">
          <h2>Overview</h2>
          <Bar data={barData} />
        </div>
        <div className="glass-card chart">
          <h2>Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card insights">
        <h2>🤖 AI Insights</h2>
        <p>
          💡 You spent {(expenseTotal / incomeTotal) * 100 || 0}% of your income.
        </p>
        {expenseTotal > incomeTotal * 0.5 && (
          <p>⚠️ High spending detected! Consider reducing expenses.</p>
        )}
        {savings > 0 ? (
          <p>🚀 You are saving ${savings.toFixed(2)} overall!</p>
        ) : (
          <p>❌ Warning: Expenses exceed income!</p>
        )}

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div className="top-categories">
            <h3>📌 Top Spending Categories:</h3>
            <ul>
              {topCategories.map(([cat, amt]) => (
                <li key={cat}>
                  {cat}: ${amt.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="glass-card transaction-list">
        <h2>Recent Transactions</h2>
        {filteredTransactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx._id} className={`transaction-card ${tx.type}`}>
              <span>{formatDate(tx.date)}</span>
              <span>{tx.category}</span>
              <span className="amount">
                {tx.type === "income" ? "+" : "-"}${tx.amount}
              </span>
              {tx.description && <span className="desc">{tx.description}</span>}
              {tx.paymentMethod && <span className="method">{tx.paymentMethod}</span>}
              {tx.tags && <span className="tags">{tx.tags.join(", ")}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
