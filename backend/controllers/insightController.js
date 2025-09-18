// backend/controllers/insightController.js
const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.getAIInsights = async (req, res) => {
  try {
    let expenses, savings, budgets;

    if (req.user) {
      // 🔹 Fetch from logged-in user
      const user = await User.findById(req.user._id);
      const transactions = await Transaction.find({ user: user._id });

      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      expenses = { total: totalExpenses };
      savings = {
        current: totalIncome - totalExpenses,
        goal: user.savingsGoal || 100000,
        monthly: user.monthlyBudget || 0,
      };
      budgets = { entertainment: user.monthlyBudget || 0 };
    } else {
      // 🔹 Fallback: take from request body
      ({ expenses, savings, budgets } = req.body);
    }

    const insights = [
      {
        title: "Spending Analysis",
        description: `This month’s total spending is ₹${expenses.total}.`,
      },
      {
        title: "Savings Projection",
        description: `If you save ₹${savings.monthly} each month, you’ll reach ₹${savings.goal} in ${Math.ceil(
          (savings.goal - savings.current) / (savings.monthly || 1)
        )} months.`,
      },
      {
        title: "Budget Alert",
        description: `Entertainment spending is ₹${
          expenses.entertainment || 0
        }, compared to your budget of ₹${budgets.entertainment || 0}.`,
      },
    ];

    res.json(insights);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating insights", error: err.message });
  }
};
