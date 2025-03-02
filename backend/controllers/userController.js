const User = require("../models/User");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    const { name, email, totalBalance, monthlyBudget, savingsGoal } = req.body;

    if (!name || !email || !totalBalance || !monthlyBudget || !savingsGoal) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = new User({ name, email, totalBalance, monthlyBudget, savingsGoal });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createUser, getUsers };
