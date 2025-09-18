// backend/routes/userRoutes.js
const express = require("express");
const {
  createUser,
  loginUser,
  getUsers,
  updateUser,
  getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/users/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", createUser);

// @route   POST /api/users/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/users/me
// @desc    Get current logged-in user profile
// @access  Private
router.get("/me", protect, getMe);

// @route   GET /api/users
// @desc    Get all users (admin access later)
// @access  Private
router.get("/", protect, getUsers);

// @route   PUT /api/users/:id
// @desc    Update user financial details
// @access  Private
router.put("/:id", protect, updateUser);

module.exports = router;
