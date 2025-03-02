const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    totalBalance: { type: Number, default: 0 },
    monthlyBudget: { type: Number, default: 0 },
    savingsGoal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create an index for email to enforce uniqueness at the database level
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
