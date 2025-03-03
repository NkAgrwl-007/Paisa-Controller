const express = require("express");
const Budget = require("../models/BudgetModel"); // Make sure this model exists
const router = express.Router();

// Get all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error: error.message });
  }
});

// Create a new budget
router.post("/", async (req, res) => {
  try {
    const { category, amount } = req.body;
    const newBudget = new Budget({ category, amount });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: "Error creating budget", error: error.message });
  }
});

// Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error: error.message });
  }
});

module.exports = router;
