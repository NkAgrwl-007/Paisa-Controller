import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/reports.css";

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  useEffect(() => {
    filterTransactions();
  }, [filter, transactions]);

  // ✅ Fetch user transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter by type
  const filterTransactions = () => {
    if (filter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter((tx) => tx.type === filter));
    }
  };

  // ✅ Totals
  const incomeTotal = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const expenseTotal = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const savings = incomeTotal - expenseTotal;

  // ✅ Chart Data
  const barData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount ($)",
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#00C49F", "#FF4444"],
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

  // ✅ Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) return <p className="loading">🚀 Generating AI-powered reports...</p>;

  return (
    <div className="reports futuristic">
      {/* ✅ Navbar (shared with dashboard) */}
     

      <h1 className="reports-title">📊 Financial Reports</h1>
      <p className="reports-subtitle">AI-powered breakdown of your money flow</p>

      {/* ✅ Filter */}
      <div className="filter-options">
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* ✅ Charts Section */}
      <div className="charts-grid">
        <div className="glass-card chart">
          <h2>Income vs Expense</h2>
          <Bar data={barData} />
        </div>
        <div className="glass-card chart">
          <h2>Distribution</h2>
          <Pie data={pieData} />
        </div>
        <div className="glass-card insights">
          <h2>🤖 AI Insights</h2>
          {incomeTotal > 0 ? (
            <>
              <p>
                💡 You spent {(expenseTotal / incomeTotal * 100).toFixed(1)}% of
                your income.
              </p>
              {expenseTotal > incomeTotal * 0.5 && (
                <p>⚠️ High spending detected! Consider reducing expenses.</p>
              )}
              {savings > 0 ? (
                <p>🚀 Great! You’re saving ${savings.toFixed(2)} overall.</p>
              ) : (
                <p>❌ Warning: Expenses are exceeding income!</p>
              )}
            </>
          ) : (
            <p>No insights yet. Add transactions.</p>
          )}
        </div>
      </div>

      {/* ✅ Transactions List */}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
