import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/AIInsight.css";
import axios from "axios";

const AIInsight = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [financialHealth, setFinancialHealth] = useState(0);
  const token = localStorage.getItem("token");

  // 🧠 Advanced Financial Analysis Engine
  const generateAdvancedInsights = (income, expenses, savings, transactions, savingsGoal) => {
    const insights = {
      overview: [],
      budgeting: [],
      savings: [],
      investments: [],
      alerts: []
    };

    // Calculate financial health score (0-100)
    let healthScore = 50;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;

    // Health scoring algorithm
    if (savingsRate >= 20) healthScore += 20;
    else if (savingsRate >= 10) healthScore += 10;
    else if (savingsRate < 0) healthScore -= 20;

    if (expenseRatio <= 70) healthScore += 15;
    else if (expenseRatio <= 80) healthScore += 5;
    else healthScore -= 15;

    if (income > 50000) healthScore += 10;
    if (transactions.length >= 10) healthScore += 5;

    healthScore = Math.max(0, Math.min(100, healthScore));
    setFinancialHealth(healthScore);

    // 📊 OVERVIEW INSIGHTS
    insights.overview.push({
      title: "💰 Financial Health Score",
      description: `Your financial health is ${healthScore}/100. ${
        healthScore >= 80 ? "Excellent! You're doing great!" :
        healthScore >= 60 ? "Good! Room for improvement." :
        healthScore >= 40 ? "Fair. Focus on saving more." :
        "Needs attention. Review your spending habits."
      }`,
      type: "score",
      value: healthScore,
      color: healthScore >= 80 ? "#4CAF50" : healthScore >= 60 ? "#FF9800" : "#F44336"
    });

    insights.overview.push({
      title: "📈 Monthly Cash Flow",
      description: `You have ₹${savings.toLocaleString()} ${savings >= 0 ? 'surplus' : 'deficit'} this month. ${
        savings >= 0 ? 'Great job managing your finances!' : 'Consider reducing expenses or increasing income.'
      }`,
      type: "cashflow",
      value: savings,
      color: savings >= 0 ? "#4CAF50" : "#F44336"
    });

    // 💡 BUDGETING INSIGHTS
    const categoryExpenses = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      const cat = t.category || "Others";
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Number(t.amount);
    });

    const topExpenseCategory = Object.keys(categoryExpenses).length > 0 ? 
      Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0] : null;

    if (topExpenseCategory) {
      const [category, amount] = topExpenseCategory;
      const percentage = income > 0 ? ((amount / income) * 100).toFixed(1) : 0;
      
      insights.budgeting.push({
        title: `🎯 Top Spending: ${category}`,
        description: `You spent ₹${amount.toLocaleString()} on ${category} (${percentage}% of income). ${
          percentage > 30 ? 'Consider reducing this expense.' :
          percentage > 20 ? 'This is a significant portion of your budget.' :
          'This spending seems reasonable.'
        }`,
        type: "category",
        value: percentage,
        color: percentage > 30 ? "#F44336" : percentage > 20 ? "#FF9800" : "#4CAF50"
      });
    }

    // 50-30-20 Rule Analysis
    const needs = income * 0.5;
    const wants = income * 0.3;
    const savingsTarget = income * 0.2;

    insights.budgeting.push({
      title: "📋 50-30-20 Rule Analysis",
      description: `Ideal allocation: ₹${needs.toLocaleString()} needs, ₹${wants.toLocaleString()} wants, ₹${savingsTarget.toLocaleString()} savings. Your current savings: ₹${savings.toLocaleString()}.`,
      type: "rule",
      target: savingsTarget,
      actual: savings,
      color: savings >= savingsTarget ? "#4CAF50" : "#FF9800"
    });

    // 💰 SAVINGS INSIGHTS
    if (savingsGoal > 0) {
      const progress = (savings / savingsGoal) * 100;
      const monthsToGoal = savingsRate > 0 ? Math.ceil((savingsGoal - savings) / (income * savingsRate / 100)) : Infinity;
      
      insights.savings.push({
        title: "🎯 Savings Goal Progress",
        description: `You've saved ${progress.toFixed(1)}% of your ₹${savingsGoal.toLocaleString()} goal. ${
          monthsToGoal !== Infinity && monthsToGoal > 0 ? 
          `At current rate, you'll reach it in ${monthsToGoal} months.` :
          progress >= 100 ? "Congratulations! Goal achieved!" :
          "Consider increasing your savings rate."
        }`,
        type: "progress",
        value: progress,
        color: progress >= 100 ? "#4CAF50" : progress >= 50 ? "#FF9800" : "#2196F3"
      });
    }

    insights.savings.push({
      title: "🏦 Emergency Fund Status",
      description: `You should have 6 months of expenses (₹${(expenses * 6).toLocaleString()}) as emergency fund. ${
        savings >= expenses * 6 ? "✅ You're well prepared!" :
        savings >= expenses * 3 ? "Good start! Consider saving more." :
        "Build your emergency fund as priority."
      }`,
      type: "emergency",
      value: savings / (expenses * 6) * 100,
      color: savings >= expenses * 6 ? "#4CAF50" : savings >= expenses * 3 ? "#FF9800" : "#F44336"
    });

    // 📈 INVESTMENT INSIGHTS
    const investmentRecommendation = income * 0.15; // 15% of income
    insights.investments.push({
      title: "💎 Investment Recommendation",
      description: `Consider investing ₹${investmentRecommendation.toLocaleString()} monthly (15% of income) for wealth building. ${
        income > 100000 ? "Look into mutual funds, stocks, or SIP." :
        income > 50000 ? "Start with SIP or index funds." :
        "Begin with small amounts in index funds."
      }`,
      type: "investment",
      value: investmentRecommendation,
      color: "#9C27B0"
    });

    // 🚨 SMART ALERTS
    if (expenseRatio > 90) {
      insights.alerts.push({
        title: "⚠️ High Expense Alert",
        description: "Your expenses are over 90% of income. This is risky - try to reduce non-essential spending immediately.",
        type: "critical",
        color: "#F44336"
      });
    }

    if (savingsRate < 5 && income > 0) {
      insights.alerts.push({
        title: "💡 Savings Opportunity",
        description: "You're saving less than 5% of income. Try the 'Pay Yourself First' method - save 10% before any expenses.",
        type: "warning",
        color: "#FF9800"
      });
    }

    // Spending pattern analysis
    const recentTransactions = transactions.slice(-10);
    const avgExpense = recentTransactions.filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0) / Math.max(1, recentTransactions.filter(t => t.type === "expense").length);

    if (avgExpense > income * 0.1) {
      insights.alerts.push({
        title: "📊 Spending Pattern",
        description: `Your average transaction is ₹${avgExpense.toFixed(0)}. Consider using the 24-hour rule before big purchases.`,
        type: "info",
        color: "#2196F3"
      });
    }

    // Positive reinforcement
    if (healthScore >= 70) {
      insights.overview.push({
        title: "🌟 Keep It Up!",
        description: "You're managing your finances well. Consider automating your savings and investments for even better results.",
        type: "positive",
        color: "#4CAF50"
      });
    }

    return insights;
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [transactionsRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/api/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const transactions = transactionsRes.data || [];
        const user = userRes.data || {};

        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const savings = totalIncome - totalExpenses;

        const userData = {
          income: totalIncome,
          expenses: totalExpenses,
          savings,
          goal: user.savingsGoal || 0,
          transactions,
        };

        // Try AI backend first, fallback to advanced insights
        try {
          const res = await axios.post("http://localhost:5000/api/insights", userData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setInsights(res.data || generateAdvancedInsights(totalIncome, totalExpenses, savings, transactions, user.savingsGoal || 0));
        } catch (aiErr) {
          console.warn("⚠️ AI backend not ready, using advanced analysis engine.");
          setInsights(generateAdvancedInsights(totalIncome, totalExpenses, savings, transactions, user.savingsGoal || 0));
        }
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchInsights();
  }, [token]);

  const renderInsightCard = (insight, index) => (
    <div className="insight-card" key={index} style={{'--accent-color': insight.color}}>
      <div className="insight-header">
        <h3>{insight.title}</h3>
        {insight.type === "score" && (
          <div className="score-badge" style={{backgroundColor: insight.color}}>
            {insight.value}
          </div>
        )}
        {insight.type === "progress" && (
          <div className="progress-circle">
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="2"/>
              <circle cx="18" cy="18" r="16" fill="none" stroke={insight.color} strokeWidth="2"
                strokeDasharray={`${Math.min(insight.value, 100)} 100`} strokeLinecap="round"/>
            </svg>
            <span>{Math.round(insight.value)}%</span>
          </div>
        )}
      </div>
      <p>{insight.description}</p>
      {insight.type === "cashflow" && (
        <div className="value-display" style={{color: insight.color}}>
          ₹{Math.abs(insight.value).toLocaleString()}
        </div>
      )}
    </div>
  );

  return (
    <div className="aiinsight-container">
      <Navbar />
      <div className="aiinsight-layout">
        <Sidebar />
        <main className="aiinsight-main">
          <div className="aiinsight-header">
            <h1 className="aiinsight-title">🤖 AI Financial Insights</h1>
            <div className="health-score">
              <span>Financial Health:</span>
              <div className="health-bar">
                <div className="health-fill" style={{width: `${financialHealth}%`, backgroundColor: 
                  financialHealth >= 80 ? "#4CAF50" : financialHealth >= 60 ? "#FF9800" : "#F44336"}}></div>
              </div>
              <span className="health-number">{financialHealth}/100</span>
            </div>
          </div>

          <div className="insight-tabs">
            {["overview", "budgeting", "savings", "investments", "alerts"].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "alerts" && insights.alerts?.length > 0 && (
                  <span className="alert-badge">{insights.alerts.length}</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">🚀 Analyzing your finances...</p>
            </div>
          ) : (
            <div className="insights-content">
              {insights[activeTab]?.length > 0 ? (
                <div className="insights-grid">
                  {insights[activeTab].map((insight, index) => renderInsightCard(insight, index))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No {activeTab} insights yet</h3>
                  <p>Add more transactions and set savings goals to get personalized recommendations.</p>
                </div>
              )}
            </div>
          )}

          <div className="insight-footer">
            <div className="tip-box">
              <h4>💡 Pro Tip</h4>
              <p>Set up automatic transfers to savings accounts to improve your financial health score. Small, consistent actions lead to big results!</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIInsight;