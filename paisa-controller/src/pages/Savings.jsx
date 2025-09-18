// src/pages/Savings.jsx
import React, { useState, useEffect } from "react";
import "../styles/savings.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Savings = () => {
  const [goal, setGoal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [saved, setSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        // ✅ Fetch user details
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = userRes.data;
        setBalance(user.currentBalance || 0);
        setGoal(user.savingsGoal || 0);

        // ✅ Fetch transactions to calculate net savings
        const txRes = await axios.get("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transactions = txRes.data || [];
        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        setSaved(totalIncome - totalExpenses);
      } catch (error) {
        console.error("Error fetching savings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <p className="loading">Loading savings data...</p>;
  }

  const percentage =
    goal > 0 ? Math.min(Math.round((saved / goal) * 100), 100) : 0;

  const chartData = [
    { name: "Saved", value: saved > goal ? goal : saved },
    { name: "Remaining", value: goal > saved ? goal - saved : 0 },
  ];

  const COLORS = ["#16a34a", "#d1d5db"];

  return (
    <div className="savings-main">
      <h2 className="savings-title">My Savings Progress</h2>

      {/* Only editable if user has no goal set */}
      <div className="savings-input-card">
        <div className="savings-inputs">
          <div>
            <label htmlFor="goal">Savings Goal (₹)</label>
            <input
              type="number"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="savings-content">
        {/* Progress card with chart */}
        <div className="savings-card savings-chart">
          <h3>Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="savings-percentage">{percentage}% of goal achieved</p>
        </div>

        {/* Details card */}
        <div className="savings-card">
          <h3>Details</h3>
          <p className="savings-text">
            <strong>Current Balance:</strong> ₹{balance.toLocaleString()}
          </p>
          <p className="savings-text">
            <strong>Savings Goal:</strong> ₹{goal.toLocaleString()}
          </p>
          <p className="savings-text">
            <strong>Saved:</strong> ₹{saved.toLocaleString()}
          </p>
          <p className="savings-text highlight">
            <strong>Remaining:</strong>{" "}
            ₹{Math.max(goal - saved, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Savings;
