// backend/routes/insightRoutes.js
const express = require("express");
const { getAIInsights } = require("../controllers/insightController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Auto-generate insights from logged-in user’s data
router.get("/me", protect, getAIInsights);

// ✅ Generate insights from custom data (e.g., testing, admin)
router.post("/", getAIInsights);

module.exports = router;
