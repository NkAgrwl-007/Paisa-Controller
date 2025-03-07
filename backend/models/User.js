const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Add admin field
  },
  { timestamps: true } // Enables createdAt & updatedAt fields
);

module.exports = mongoose.model("User", userSchema);
