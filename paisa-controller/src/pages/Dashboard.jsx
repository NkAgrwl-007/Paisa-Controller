import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../styles/dashboard.css";

const COLORS = ["#00C49F", "#FF4444", "#FFA500", "#8884d8", "#FFBB28"];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  // ✅ Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = totalIncome - totalExpenses;

  // ✅ Category breakdown
  const categoryData = transactions.reduce((acc, curr) => {
    if (curr.type === "expense") {
      const category = acc.find((cat) => cat.name === curr.category);
      if (category) {
        category.value += Number(curr.amount);
      } else {
        acc.push({ name: curr.category, value: Number(curr.amount) });
      }
    }
    return acc;
  }, []);

  // ✅ Format numbers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  if (loading) return <p className="loading">🚀 Loading your dashboard...</p>;

  return (
    <div className="dashboard futuristic">
      
      <h1 className="dashboard-title">🌌 Paisa Controller Dashboard</h1>
      <p className="dashboard-subtitle">
        AI-powered insights into your financial universe
      </p>

      {/* ✅ Summary Section */}
      <div className="summary-grid">
        <div className="glass-card income">
          <h3>Total Income</h3>
          <p>{totalIncome > 0 ? formatCurrency(totalIncome) : "—"}</p>
        </div>
        <div className="glass-card expenses">
          <h3>Total Expenses</h3>
          <p>{totalExpenses > 0 ? formatCurrency(totalExpenses) : "—"}</p>
        </div>
        <div className="glass-card savings">
          <h3>Savings</h3>
          <p>{savings !== 0 ? formatCurrency(savings) : "—"}</p>
        </div>
      </div>

      {/* ✅ Charts */}
      <div className="charts-grid">
        <div className="glass-card chart">
          <h3>Category-wise Spending</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No spending data available.</p>
          )}
        </div>

        {/* ✅ AI Insights */}
        <div className="glass-card ai-insights">
          <h3>🤖 AI Insights</h3>
          {totalExpenses > 0 ? (
            <>
              <p>
                💡 You spent{" "}
                {((totalExpenses / totalIncome) * 100).toFixed(1)}% of your
                income.
              </p>
              {totalExpenses > totalIncome * 0.5 && (
                <p>⚠️ High spending! Cut back to boost savings.</p>
              )}
              {savings > 0 && (
                <p>🚀 Great! You’re saving {formatCurrency(savings)} this month.</p>
              )}
            </>
          ) : (
            <p>No insights yet. Add some transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
