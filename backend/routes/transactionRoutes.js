const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

// ✅ Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // store userId from token payload
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// ✅ Get all transactions for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user })
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add a transaction for logged-in user
router.post("/", authMiddleware, async (req, res) => {
  const { amount, category, type, date, description, paymentMethod, recurring, tags } = req.body;

  if (!amount || !category || !type || !date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const newTransaction = new Transaction({
      amount,
      category,
      type,
      date,
      description: description || "",
      paymentMethod: paymentMethod || "other",
      recurring: recurring || false,
      tags: Array.isArray(tags) ? tags : [],
      user: req.user,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error.message);
    res.status(500).json({ message: "Error saving transaction" });
  }
});


// ✅ Delete a transaction (only if it belongs to the logged-in user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted", transaction });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
