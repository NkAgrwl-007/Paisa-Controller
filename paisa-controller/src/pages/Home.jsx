import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "../styles/home.css";

const COLORS = ["#00C49F", "#FF4444"];

const Home = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [transactions, setTransactions] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(!user);
  const [formData, setFormData] = useState({
    totalBalance: user?.totalBalance || 0,
    monthlyBudget: user?.monthlyBudget || 0,
    savingsGoal: user?.savingsGoal || 0,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(res.data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  const toggleSidePanel = () => setIsPanelOpen(!isPanelOpen);

  const totalIncome = transactions.reduce((acc, tx) => (tx.type === "income" ? acc + tx.amount : acc), 0);
  const totalExpenses = transactions.reduce((acc, tx) => (tx.type === "expense" ? acc + tx.amount : acc), 0);

  const savingsProgress = user?.savingsGoal ? Math.min((user.totalBalance / user.savingsGoal) * 100, 100) : 0;

  const data = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  return (
    <div className="home">
      <header className="header">
        <h1>Paisa Controller</h1>
        {user && <h2 className="welcome">Welcome, {user.name}!</h2>}
        {user && (
          <div className="profile-section" onClick={toggleSidePanel}>
            <div className="profile-icon">{user.name?.charAt(0).toUpperCase() || "U"}</div>
          </div>
        )}
      </header>

      <p>Track your expenses and manage your budget easily.</p>

      {user && user.savingsGoal > 0 && (
        <p className="motive">Your goal is to save ${user.savingsGoal}. Stay focused and achieve financial freedom!</p>
      )}

      {editMode ? (
        <form className="user-form" onSubmit={handleSubmit}>
          <h2>{user ? "Edit Your Financial Details" : "Enter Your Financial Details"}</h2>
          <input type="number" name="totalBalance" value={formData.totalBalance} placeholder="Total Balance" onChange={handleChange} required />
          <input type="number" name="monthlyBudget" value={formData.monthlyBudget} placeholder="Monthly Budget" onChange={handleChange} required />
          <input type="number" name="savingsGoal" value={formData.savingsGoal} placeholder="Savings Goal" onChange={handleChange} required />
          <button type="submit">{user ? "Update Details" : "Save Details"}</button>
        </form>
      ) : (
        <div className="dashboard">
          <h2>Financial Dashboard</h2>
          <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>

          <div className="grid-container">
            <div className="card balance">
              <h3>Current Balance</h3>
              <p>${user.totalBalance}</p>
            </div>

            <div className="card chart">
              <h3>Expense vs. Income</h3>
              <PieChart width={200} height={200}>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="card savings">
              <h3>Savings Progress</h3>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${savingsProgress}%`, backgroundColor: "#00C49F" }}>
                  {savingsProgress.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="card insights">
              <h3>AI Insights & Recommendations</h3>
              <p>💡 You spent 20% more on dining this month.</p>
              <p>🔹 Consider reducing entertainment expenses to save more.</p>
            </div>
          </div>
        </div>
      )}

      {isPanelOpen && user && (
        <div className="side-panel">
          <button className="close-btn" onClick={toggleSidePanel}>X</button>
          <h3>{user.name || "User"}</h3>
        </div>
      )}
    </div>
  );
};

export default Home;