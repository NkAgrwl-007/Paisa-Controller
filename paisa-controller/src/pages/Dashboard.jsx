// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import "../styles/dashboard.css";

const COLORS = ["#00f5ff", "#ff0080", "#00ff88", "#ffaa00", "#8a2be2", "#ff6b6b"];
const NEON_COLORS = {
  primary: "#00f5ff",
  secondary: "#ff0080",
  success: "#00ff88",
  warning: "#ffaa00",
  danger: "#ff6b6b",
  purple: "#8a2be2"
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState("overview");
  const [animationStep, setAnimationStep] = useState(0);
  const [timeRange, setTimeRange] = useState("30d");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchTransactions();
    
    // Animation sequence
    const timer = setTimeout(() => setAnimationStep(1), 500);
    return () => clearTimeout(timer);
  }, [token]);

  // ✅ Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Advanced calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100) : 0;

  // ✅ Category breakdown with advanced analytics
  const categoryData = transactions.reduce((acc, curr) => {
    if (curr.type === "expense") {
      const category = acc.find((cat) => cat.name === curr.category);
      if (category) {
        category.value += Number(curr.amount);
        category.count += 1;
      } else {
        acc.push({ 
          name: curr.category, 
          value: Number(curr.amount),
          count: 1,
          percentage: 0
        });
      }
    }
    return acc;
  }, []);

  // Calculate percentages
  categoryData.forEach(cat => {
    cat.percentage = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100) : 0;
  });

  // Sort by value
  categoryData.sort((a, b) => b.value - a.value);

  // ✅ Time series data for trends
  const getLast30DaysData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => 
        t.date && t.date.startsWith(dateStr)
      );
      
      const dayIncome = dayTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const dayExpenses = dayTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      last30Days.push({
        date: date.getDate(),
        income: dayIncome,
        expenses: dayExpenses,
        net: dayIncome - dayExpenses
      });
    }
    
    return last30Days;
  };

  const trendData = getLast30DaysData();

  // ✅ Financial Health Score
  const calculateHealthScore = () => {
    let score = 50; // Base score
    
    // Savings rate impact (40 points max)
    if (savingsRate >= 20) score += 40;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;
    else if (savingsRate < 0) score -= 20;
    
    // Transaction diversity (20 points max)
    if (categoryData.length >= 5) score += 20;
    else if (categoryData.length >= 3) score += 10;
    
    // Income stability (20 points max)
    if (totalIncome > 50000) score += 20;
    else if (totalIncome > 20000) score += 10;
    
    // Expense control (20 points max)
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) : 1;
    if (expenseRatio <= 0.7) score += 20;
    else if (expenseRatio <= 0.8) score += 10;
    else if (expenseRatio >= 1) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  // ✅ Smart insights with AI-like analysis
  const generateSmartInsights = () => {
    const insights = [];
    
    if (totalIncome === 0) {
      return [{ type: 'info', message: 'Add income transactions to see insights', icon: '💡' }];
    }
    
    // Savings insights
    if (savingsRate >= 20) {
      insights.push({ type: 'success', message: `Excellent! You're saving ${savingsRate.toFixed(1)}% of income`, icon: '🚀' });
    } else if (savingsRate >= 10) {
      insights.push({ type: 'info', message: `Good saving rate: ${savingsRate.toFixed(1)}%. Try to reach 20%`, icon: '💪' });
    } else if (savingsRate < 0) {
      insights.push({ type: 'danger', message: 'You\'re spending more than earning! Urgent action needed', icon: '⚠️' });
    }
    
    // Category insights
    if (categoryData.length > 0) {
      const topCategory = categoryData[0];
      if (topCategory.percentage > 40) {
        insights.push({ 
          type: 'warning', 
          message: `${topCategory.name} takes ${topCategory.percentage.toFixed(1)}% of expenses`, 
          icon: '📊' 
        });
      }
    }
    
    // Trend insights
    const recentTrend = trendData.slice(-7);
    const avgNet = recentTrend.reduce((sum, day) => sum + day.net, 0) / 7;
    if (avgNet > 0) {
      insights.push({ type: 'success', message: 'Your weekly trend is positive!', icon: '📈' });
    }
    
    // Health score insight
    if (healthScore >= 80) {
      insights.push({ type: 'success', message: 'Your financial health is excellent!', icon: '💎' });
    } else if (healthScore >= 60) {
      insights.push({ type: 'info', message: 'Your financial health is good with room for improvement', icon: '⭐' });
    } else {
      insights.push({ type: 'warning', message: 'Focus on improving your financial habits', icon: '🎯' });
    }
    
    return insights;
  };

  const insights = generateSmartInsights();

  // ✅ Currency formatting
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="dashboard futuristic loading-screen">
        <div className="loading-container">
          <div className="quantum-loader"></div>
          <h2 className="loading-title">Initializing Neural Network...</h2>
          <p className="loading-subtitle">Analyzing financial patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard futuristic">
      {/* Animated Background */}
      <div className="cosmic-bg">
        <div className="stars"></div>
        <div className="nebula"></div>
      </div>

      {/* Header Section */}
      <header className={`dashboard-header ${animationStep >= 1 ? 'animate-in' : ''}`}>
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">🌌</span>
            PAISA NEURAL CENTER
            <span className="title-glow"></span>
          </h1>
          <p className="dashboard-subtitle">
            Advanced Financial Intelligence • Real-time Analytics • Quantum Insights
          </p>
          <div className="health-indicator">
            <div className="health-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,245,255,0.2)" strokeWidth="2"/>
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke="#00f5ff" strokeWidth="2"
                  strokeDasharray={`${healthScore * 2.83} 283`}
                  strokeLinecap="round"
                  className="health-progress"
                />
              </svg>
              <div className="health-score">
                <span className="score-number">{healthScore}</span>
                <span className="score-label">HEALTH</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metric Selector */}
      <nav className="metric-selector">
        {["overview", "trends", "categories", "insights"].map(metric => (
          <button
            key={metric}
            className={`metric-btn ${activeMetric === metric ? 'active' : ''}`}
            onClick={() => setActiveMetric(metric)}
          >
            <span className="btn-glow"></span>
            {metric.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Summary Cards */}
        {activeMetric === "overview" && (
          <>
            <section className="summary-grid">
              <div className="quantum-card income-card">
                <div className="card-header">
                  <h3>Total Income</h3>
                  <div className="card-icon">💰</div>
                </div>
                <div className="card-value">
                  {totalIncome > 0 ? formatCurrency(totalIncome) : "—"}
                </div>
                <div className="card-trend positive">
                  <span>▲ Active streams detected</span>
                </div>
              </div>

              <div className="quantum-card expenses-card">
                <div className="card-header">
                  <h3>Total Expenses</h3>
                  <div className="card-icon">💸</div>
                </div>
                <div className="card-value">
                  {totalExpenses > 0 ? formatCurrency(totalExpenses) : "—"}
                </div>
                <div className="card-trend">
                  <span>{categoryData.length} categories tracked</span>
                </div>
              </div>

              <div className="quantum-card savings-card">
                <div className="card-header">
                  <h3>Net Savings</h3>
                  <div className="card-icon">🚀</div>
                </div>
                <div className="card-value">
                  {savings !== 0 ? formatCurrency(savings) : "—"}
                </div>
                <div className={`card-trend ${savings >= 0 ? 'positive' : 'negative'}`}>
                  <span>{savingsRate.toFixed(1)}% savings rate</span>
                </div>
              </div>
            </section>

            {/* Category Chart */}
            <section className="chart-section">
              <div className="quantum-card chart-card">
                <div className="card-header">
                  <h3>Expense Distribution Matrix</h3>
                  <div className="chart-controls">
                    <button className="control-btn active">Quantum View</button>
                  </div>
                </div>
                <div className="chart-container">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <defs>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge> 
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={140}
                          dataKey="value"
                          label={({ name, percentage }) =>
                            `${name}: ${percentage.toFixed(1)}%`
                          }
                          labelLine={false}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              filter="url(#glow)"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)} 
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid #00f5ff',
                            borderRadius: '10px',
                            color: '#00f5ff'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">
                      <div className="empty-icon">📊</div>
                      <p>No expense data in neural network</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Trends View */}
        {activeMetric === "trends" && (
          <section className="trends-section">
            <div className="quantum-card">
              <div className="card-header">
                <h3>Financial Timeline Analysis</h3>
                <div className="time-controls">
                  {["7d", "30d", "90d"].map(range => (
                    <button 
                      key={range}
                      className={`time-btn ${timeRange === range ? 'active' : ''}`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff0080" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff0080" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,245,255,0.2)" />
                  <XAxis dataKey="date" stroke="#00f5ff" />
                  <YAxis stroke="#00f5ff" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #00f5ff',
                      borderRadius: '10px',
                      color: '#00f5ff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#00ff88"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ff0080"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Categories View */}
        {activeMetric === "categories" && (
          <section className="categories-section">
            <div className="quantum-card">
              <div className="card-header">
                <h3>Category Analysis Matrix</h3>
              </div>
              <div className="category-grid">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="category-item">
                    <div className="category-header">
                      <h4>{category.name}</h4>
                      <span className="category-amount">{formatCurrency(category.value)}</span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                    <div className="category-stats">
                      <span>{category.percentage.toFixed(1)}%</span>
                      <span>{category.count} transactions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Insights View */}
        {activeMetric === "insights" && (
          <section className="insights-section">
            <div className="quantum-card">
              <div className="card-header">
                <h3>🤖 Neural Financial Analysis</h3>
                <div className="ai-indicator">
                  <div className="ai-pulse"></div>
                  <span>AI ACTIVE</span>
                </div>
              </div>
              <div className="insights-grid">
                {insights.map((insight, index) => (
                  <div key={index} className={`insight-item ${insight.type}`}>
                    <div className="insight-icon">{insight.icon}</div>
                    <div className="insight-content">
                      <p>{insight.message}</p>
                    </div>
                    <div className="insight-glow"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="quantum-card recommendations">
              <div className="card-header">
                <h3>💡 Quantum Recommendations</h3>
              </div>
              <div className="recommendations-list">
                <div className="recommendation">
                  <span className="rec-icon">🎯</span>
                  <div className="rec-content">
                    <h4>Optimize Spending Patterns</h4>
                    <p>Based on neural analysis, consider reducing expenses in your top category by 15%</p>
                  </div>
                </div>
                <div className="recommendation">
                  <span className="rec-icon">💰</span>
                  <div className="rec-content">
                    <h4>Savings Acceleration Protocol</h4>
                    <p>Increase your savings rate by 5% to reach financial independence faster</p>
                  </div>
                </div>
                <div className="recommendation">
                  <span className="rec-icon">📈</span>
                  <div className="rec-content">
                    <h4>Investment Opportunity Detection</h4>
                    <p>Your surplus funds could generate additional returns through strategic investments</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;