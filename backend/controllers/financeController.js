// backend/controllers/financeController.js

export const getAIInsights = async (req, res) => {
  try {
    const { transactions, savings, budget } = req.body;

    let insights = [];
    const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);

    // Budget insights
    if (totalSpent > budget) {
      insights.push("⚠️ You are overspending your budget. Cut down non-essentials.");
    } else {
      insights.push("✅ Great! You’re within your budget.");
    }

    // Savings insights
    if (savings < budget * 0.2) {
      insights.push("💡 Try saving at least 20% of your budget.");
    } else {
      insights.push("🎉 Excellent! Your savings are on track.");
    }

    // Spending categories
    const categorySpend = {};
    transactions.forEach(t => {
      categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
    });

    let topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push(`📊 You spend the most on **${topCategory[0]}** (${topCategory[1]} units).`);
    }

    // Simple trend prediction
    const avgSpend = totalSpent / (transactions.length || 1);
    const predictedNextMonth = Math.round(avgSpend * (transactions.length + 5));
    insights.push(`📈 Predicted next month spending: ${predictedNextMonth}`);

    // 📊 Trend data (monthly expenses)
    const monthlySpend = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });
      monthlySpend[month] = (monthlySpend[month] || 0) + t.amount;
    });

    const trendData = Object.entries(monthlySpend).map(([month, value]) => ({
      month,
      value
    }));

    res.json({ insights, categorySpend, totalSpent, predictedNextMonth, savings, budget, trendData });
  } catch (err) {
    res.status(500).json({ error: "Error generating insights" });
  }
};
