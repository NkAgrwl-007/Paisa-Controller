const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const createUser = async (req, res) => {
  try {
    const { name, email, password, currentBalance, monthlyBudget, savingsGoal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      currentBalance: currentBalance || 0,
      monthlyBudget: monthlyBudget || 0,
      savingsGoal: savingsGoal || 0,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currentBalance: user.currentBalance,
        monthlyBudget: user.monthlyBudget,
        savingsGoal: user.savingsGoal,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currentBalance: user.currentBalance,
        monthlyBudget: user.monthlyBudget,
        savingsGoal: user.savingsGoal,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user financial details
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentBalance, monthlyBudget, savingsGoal } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.currentBalance = currentBalance !== undefined ? currentBalance : user.currentBalance;
    user.monthlyBudget = monthlyBudget !== undefined ? monthlyBudget : user.monthlyBudget;
    user.savingsGoal = savingsGoal !== undefined ? savingsGoal : user.savingsGoal;

    await user.save();

    return res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currentBalance: user.currentBalance,
        monthlyBudget: user.monthlyBudget,
        savingsGoal: user.savingsGoal,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/users/me
// @access  Private
// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUsers,
  getMe,
};
