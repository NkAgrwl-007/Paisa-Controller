const express = require("express");
const { createUser, loginUser, getUsers } = require("../controllers/userController");

const router = express.Router();

// @route   POST /api/users/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", createUser);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/users
// @desc    Get all users (without passwords)
// @access  Public
router.get("/", getUsers);

module.exports = router;
