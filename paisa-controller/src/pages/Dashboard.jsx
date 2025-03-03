import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/dashboard.css";

const COLORS = ["#00C49F", "#FF4444", "#FFA500", "#8884d8", "#FFBB28"];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = totalIncome - totalExpenses;

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

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Overview of your financial activities.</p>

      <div className="summary">
        <div className="card income">
          <h3>Total Income</h3>
          <p>${totalIncome || "Not Available"}</p>
        </div>
        <div className="card expenses">
          <h3>Total Expenses</h3>
          <p>${totalExpenses || "Not Available"}</p>
        </div>
        <div className="card savings">
          <h3>Savings</h3>
          <p>${savings || "Not Available"}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart spending-trend">
          <h3>Category-wise Spending</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
