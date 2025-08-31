const Budget = require("../models/BudgetModel");

// Create new budget
const createBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }

    const budget = new Budget({
      category,
      amount,
      user: req.user.id   // comes from auth middleware
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all budgets for a user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
